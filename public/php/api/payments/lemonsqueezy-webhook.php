<?php
/**
 * Lemon Squeezy webhook — the PRIMARY grant path for this gateway (unlike
 * Paystack/PayPal's popup+verify flow, Lemon Squeezy checkout is a full
 * redirect to their hosted page and back, so there is no synchronous
 * "verify" call the frontend can make — this webhook, plus the existing
 * enrollment-status polling the frontend already does elsewhere for
 * PayFast's own async ITN delay, is what actually unlocks the course).
 *
 * Verifies the `X-Signature` header (HMAC-SHA256 of the raw body using
 * LEMONSQUEEZY_WEBHOOK_SECRET) before processing anything, and is idempotent
 * since Lemon Squeezy can legitimately redeliver the same event.
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

$webhookSecret = env('LEMONSQUEEZY_WEBHOOK_SECRET', '');
$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_SIGNATURE'] ?? '';

if ($webhookSecret === '' || $signature === '') finishText('not-configured', 503);

$expectedSignature = hash_hmac('sha256', $rawBody, $webhookSecret);
if (!hash_equals($expectedSignature, $signature)) {
    finishText('invalid-signature', 401);
}

$event = json_decode($rawBody, true);
if (!is_array($event)) finishText('invalid-payload', 400);

if (($event['meta']['event_name'] ?? '') !== 'order_created') {
    // We only act on completed one-time orders — every other event type
    // (refunds, subscription events — unused here) is acknowledged without
    // any further work.
    finishText('OK');
}

$order = $event['data']['attributes'] ?? [];
$orderId = $event['data']['id'] ?? '';
if ($orderId === '') finishText('missing-order-id', 400);

if (($order['status'] ?? '') !== 'paid') {
    // e.g. a pending/failed order notification — nothing to grant yet.
    finishText('OK');
}

$customData = $event['meta']['custom_data'] ?? [];
$userId = $customData['user_id'] ?? null;
$parentSlugsRaw = $customData['parent_slugs'] ?? null;
$parentSlugs = is_string($parentSlugsRaw) ? (json_decode($parentSlugsRaw, true) ?: []) : [];

if (!$userId || count($parentSlugs) === 0) {
    // Nothing to grant without knowing who/what — this should never happen
    // for an order created via lemonsqueezy-create-checkout.php, which
    // always sets this custom data.
    finishText('missing-context');
}

$db = getDb();

try {
    $db->beginTransaction();

    $existingStmt = $db->prepare('SELECT id, status FROM international_payments WHERE gateway = "lemonsqueezy" AND external_transaction_id = ? FOR UPDATE');
    $existingStmt->execute([$orderId]);
    $existing = $existingStmt->fetch();

    if ($existing && $existing['status'] === 'completed') {
        $db->commit();
        finishText('OK');
    }

    // Always resolved against Lemon Squeezy's own currency — this webhook
    // only ever carries Lemon Squeezy events, never a client-supplied
    // country, exactly like lemonsqueezy-create-checkout.php.
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'lemonsqueezy');
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

    // `total` is in cents, in the order's own `currency` — since checkouts
    // are always created with custom_price in USD cents, this should always
    // be USD, but the currency is still checked rather than assumed.
    $expectedCents = (int)round($pricing['amountCharged'] * 100);
    $paidCents = (int)($order['total'] ?? 0);
    $paidCurrency = strtoupper($order['currency'] ?? '');
    if ($paidCurrency !== $pricing['currency'] || abs($paidCents - $expectedCents) > 5) {
        $db->rollBack();
        error_log("Lemon Squeezy webhook amount/currency mismatch for order {$orderId}: expected {$expectedCents} {$pricing['currency']}, got {$paidCents} {$paidCurrency}");
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
             VALUES (?, ?, ?, ?, "lemonsqueezy", ?, ?, ?, ?, ?, "completed", ?)'
        )->execute([
            generateId(), $userId, $childCourseIds[0], json_encode($realSlugs),
            $orderId, $pricing['zar']['totalZar'], $paidCents / 100, $paidCurrency, $pricing['exchangeRate'],
            json_encode(['isBundle' => $pricing['zar']['isBundle'], 'unlockedModules' => $enrolledCount, 'source' => 'webhook']),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Lemon Squeezy webhook processing failed: ' . $error->getMessage());
    finishText('processing-failed', 500);
}

finishText('OK');
