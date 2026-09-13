<?php
/**
 * Paystack webhook — a redundant, defense-in-depth confirmation path
 * alongside paystack-verify-transaction.php (the primary grant path, called
 * right after the frontend popup closes). Paystack calls this directly, so
 * it authenticates via the x-paystack-signature HMAC header instead of the
 * bridge key, exactly like payfast-notify.php authenticates PayFast's own
 * ITN via signature rather than a bridge key. Processes idempotently since
 * a webhook can legitimately arrive more than once, and may arrive for a
 * transaction paystack-verify-transaction.php already completed.
 */
ob_start();
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/international_pricing.php';
ob_end_clean();

header('Content-Type: text/plain; charset=utf-8');

function finishText(string $message, int $status = 200): never {
    http_response_code($status);
    echo $message;
    exit;
}

$secretKey = env('PAYSTACK_SECRET_KEY', '');
$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '';

if ($secretKey === '' || $signature === '') finishText('not-configured', 503);

$expectedSignature = hash_hmac('sha512', $rawBody, $secretKey);
if (!hash_equals($expectedSignature, $signature)) {
    finishText('invalid-signature', 401);
}

$event = json_decode($rawBody, true);
if (!is_array($event)) finishText('invalid-payload', 400);

if (($event['event'] ?? '') !== 'charge.success') {
    // We only act on successful charges — every other event type (failed
    // charges, transfers, etc.) is acknowledged without any further work.
    finishText('OK');
}

$txn = $event['data'] ?? [];
$reference = $txn['reference'] ?? '';
if ($reference === '') finishText('missing-reference', 400);

$metadata = $txn['metadata'] ?? [];
$userId = $metadata['user_id'] ?? null;
$parentSlugs = is_array($metadata['parent_slugs'] ?? null) ? $metadata['parent_slugs'] : [];

if (!$userId || count($parentSlugs) === 0) {
    // Nothing to grant without knowing who/what — paystack-verify-transaction.php
    // (which does have this context from the authenticated request) is the
    // real grant path; this webhook is a safety net for when that call fails
    // to complete after a real charge succeeded.
    finishText('missing-context');
}

$db = getDb();

try {
    $db->beginTransaction();

    $existingStmt = $db->prepare('SELECT id, status FROM international_payments WHERE gateway = "paystack" AND external_transaction_id = ? FOR UPDATE');
    $existingStmt->execute([$reference]);
    $existing = $existingStmt->fetch();

    if ($existing && $existing['status'] === 'completed') {
        $db->commit();
        finishText('OK');
    }

    // Always resolved against Paystack's own currency — this webhook only
    // ever carries Paystack events, never the client-supplied metadata's
    // country, exactly like paystack-verify-transaction.php.
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'paystack');
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

    // Paystack Inline's `amount` is set in the buyer's own browser JS, so it
    // is never trustworthy on its own — this webhook payload is genuinely
    // from Paystack (signature-verified above), but what Paystack reports as
    // charged must still match our own server-computed expected price before
    // anything is granted, same as the primary verify-transaction path.
    $expectedMinorUnits = (int)round($pricing['amountCharged'] * 100);
    $paidMinorUnits = (int)($txn['amount'] ?? 0);
    $paidCurrency = strtoupper($txn['currency'] ?? '');
    if ($paidCurrency !== $pricing['currency'] || abs($paidMinorUnits - $expectedMinorUnits) > 5) {
        $db->rollBack();
        error_log("Paystack webhook amount/currency mismatch for ref {$reference}: expected {$expectedMinorUnits} {$pricing['currency']}, got {$paidMinorUnits} {$paidCurrency}");
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
             VALUES (?, ?, ?, ?, "paystack", ?, ?, ?, ?, ?, "completed", ?)'
        )->execute([
            generateId(), $userId, $childCourseIds[0], json_encode($realSlugs),
            $reference, $pricing['zar']['totalZar'], $paidMinorUnits / 100, $paidCurrency, $pricing['exchangeRate'],
            json_encode(['isBundle' => $pricing['zar']['isBundle'], 'unlockedModules' => $enrolledCount, 'source' => 'webhook']),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Paystack webhook processing failed: ' . $error->getMessage());
    finishText('processing-failed', 500);
}

finishText('OK');
