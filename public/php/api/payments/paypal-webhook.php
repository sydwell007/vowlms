<?php
/**
 * PayPal webhook — a redundant, defense-in-depth confirmation path
 * alongside paypal-capture-order.php (the primary grant path). Verifies the
 * webhook signature via PayPal's own verify-webhook-signature API before
 * processing anything, and is idempotent since a webhook can legitimately
 * arrive more than once, or for a capture paypal-capture-order.php already
 * completed.
 */
ob_start();
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/international_pricing.php';
require_once __DIR__ . '/../../lib/paypal_client.php';
ob_end_clean();

header('Content-Type: text/plain; charset=utf-8');

function finishText(string $message, int $status = 200): never {
    http_response_code($status);
    echo $message;
    exit;
}

$webhookId = env('PAYPAL_WEBHOOK_ID', '');
$rawBody = file_get_contents('php://input');
$event = json_decode($rawBody, true);

if ($webhookId === '' || !is_array($event)) finishText('not-configured', 503);

try {
    $verify = paypalRequest('POST', '/v1/notifications/verify-webhook-signature', [
        'transmission_id' => $_SERVER['HTTP_PAYPAL_TRANSMISSION_ID'] ?? '',
        'transmission_time' => $_SERVER['HTTP_PAYPAL_TRANSMISSION_TIME'] ?? '',
        'cert_url' => $_SERVER['HTTP_PAYPAL_CERT_URL'] ?? '',
        'auth_algo' => $_SERVER['HTTP_PAYPAL_AUTH_ALGO'] ?? '',
        'transmission_sig' => $_SERVER['HTTP_PAYPAL_TRANSMISSION_SIG'] ?? '',
        'webhook_id' => $webhookId,
        'webhook_event' => $event,
    ]);
} catch (Throwable $error) {
    error_log('PayPal webhook signature verification request failed: ' . $error->getMessage());
    finishText('verification-failed', 502);
}

if (($verify['data']['verification_status'] ?? '') !== 'SUCCESS') {
    finishText('invalid-signature', 401);
}

if (($event['event_type'] ?? '') !== 'PAYMENT.CAPTURE.COMPLETED') {
    finishText('OK');
}

$resource = $event['resource'] ?? [];
$captureId = $resource['id'] ?? '';
if ($captureId === '') finishText('missing-capture-id', 400);

$customId = $resource['custom_id'] ?? null;
$custom = $customId ? json_decode($customId, true) : null;
$userId = $custom['userId'] ?? null;
$parentSlugs = is_array($custom['parentSlugs'] ?? null) ? $custom['parentSlugs'] : [];

if (!$userId || count($parentSlugs) === 0) {
    // paypal-capture-order.php (which has this context from the authenticated
    // request) is the real grant path; this webhook is a safety net.
    finishText('missing-context');
}

$db = getDb();

try {
    $db->beginTransaction();

    $existingStmt = $db->prepare('SELECT id, status FROM international_payments WHERE gateway = "paypal" AND external_transaction_id = ? FOR UPDATE');
    $existingStmt->execute([$captureId]);
    $existing = $existingStmt->fetch();

    if ($existing && $existing['status'] === 'completed') {
        $db->commit();
        finishText('OK');
    }

    // Always resolved against PayPal's own currency — this webhook only ever
    // carries PayPal events, never the client-supplied custom_id's country,
    // exactly like paypal-create-order.php / paypal-capture-order.php.
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'paypal');
    if ($pricing === null) {
        $db->rollBack();
        finishText('unknown-course', 404);
    }
    if (!$pricing['conversionAvailable']) {
        $db->rollBack();
        finishText('conversion-unavailable', 503);
    }

    $realSlugs = array_column($pricing['zar']['items'], 'parentSlug');
    $childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
    if (count($childCourseIds) === 0) {
        $db->rollBack();
        finishText('no-unlockable-modules', 404);
    }

    // The order itself was created server-side with the correct amount
    // (paypal-create-order.php), so this should already match — but this
    // webhook is a defense-in-depth safety net, so it verifies independently
    // rather than assuming that held, same as the primary capture path.
    $paidAmount = (float)($resource['amount']['value'] ?? 0);
    $paidCurrency = strtoupper($resource['amount']['currency_code'] ?? '');
    if ($paidCurrency !== $pricing['currency'] || abs($paidAmount - $pricing['amountCharged']) > 0.02) {
        $db->rollBack();
        error_log("PayPal webhook amount/currency mismatch for capture {$captureId}: expected {$pricing['amountCharged']} {$pricing['currency']}, got {$paidAmount} {$paidCurrency}");
        finishText('amount-mismatch', 400);
    }

    $enrolledCount = grantInternationalCourseUnlock($db, $userId, $realSlugs, $childCourseIds, $pricing['zar']['isBundle']);

    if ($existing) {
        $db->prepare('UPDATE international_payments SET status = "completed", updated_at = NOW() WHERE id = ?')
            ->execute([$existing['id']]);
    } else {
        $db->prepare(
            'INSERT INTO international_payments
             (id, user_id, course_id, unlock_parent_slugs, gateway, external_transaction_id, amount_zar, amount_charged, currency_charged, exchange_rate_used, status, metadata)
             VALUES (?, ?, ?, ?, "paypal", ?, ?, ?, ?, ?, "completed", ?)'
        )->execute([
            generateId(), $userId, $childCourseIds[0], json_encode($realSlugs),
            $captureId, $pricing['zar']['totalZar'], $paidAmount, $paidCurrency, $pricing['exchangeRate'] ?? 1,
            json_encode(['isBundle' => $pricing['zar']['isBundle'], 'unlockedModules' => $enrolledCount, 'source' => 'webhook']),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('PayPal webhook processing failed: ' . $error->getMessage());
    finishText('processing-failed', 500);
}

finishText('OK');
