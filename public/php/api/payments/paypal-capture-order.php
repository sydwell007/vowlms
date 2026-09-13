<?php
/**
 * Captures a PayPal order after buyer approval and grants access — verifies
 * the capture status directly with PayPal server-side (never trusts the
 * frontend SDK's own onApprove callback alone) before touching anything.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/international_pricing.php';
require_once __DIR__ . '/../../lib/paypal_client.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId = $payload['sub'];
$db = getDb();

$body = getJsonBody();
$orderId = trim($body['orderId'] ?? '');
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];

if ($orderId === '') jsonError('orderId is required');
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

try {
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'paypal');
} catch (Throwable $error) {
    error_log('computeInternationalUnlockPrice failed: ' . $error->getMessage());
    jsonError('Pricing is temporarily unavailable, please try again shortly', 503);
}
if ($pricing === null) jsonError('None of the requested courses have unlock pricing configured', 404);

$realSlugs = array_column($pricing['zar']['items'], 'parentSlug');
$childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
if (count($childCourseIds) === 0) jsonError('No unlockable modules found for these courses', 404);

if (alreadyOwnsAllCourses($db, $userId, $childCourseIds)) {
    jsonError('You already have full access to this course', 409);
}

try {
    $capture = paypalRequest('POST', "/v2/checkout/orders/{$orderId}/capture", null, generateId());
} catch (Throwable $error) {
    error_log('PayPal capture failed: ' . $error->getMessage());
    jsonError('Could not confirm the PayPal payment', 502);
}

if (!in_array($capture['status'], [200, 201], true) || ($capture['data']['status'] ?? '') !== 'COMPLETED') {
    jsonError('Payment was not completed', 400);
}

$captureUnit = $capture['data']['purchase_units'][0]['payments']['captures'][0] ?? null;
$captureId = $captureUnit['id'] ?? $orderId;
$paidAmount = (float)($captureUnit['amount']['value'] ?? 0);
$paidCurrency = strtoupper($captureUnit['amount']['currency_code'] ?? '');

if ($paidCurrency !== $pricing['currency'] || abs($paidAmount - $pricing['amountCharged']) > 0.02) {
    error_log("PayPal amount/currency mismatch for order {$orderId}: expected {$pricing['amountCharged']} {$pricing['currency']}, got {$paidAmount} {$paidCurrency}");
    jsonError('Payment amount does not match the expected price', 400);
}

try {
    $db->beginTransaction();

    $existingStmt = $db->prepare('SELECT id, status FROM international_payments WHERE gateway = "paypal" AND external_transaction_id = ? FOR UPDATE');
    $existingStmt->execute([$captureId]);
    $existing = $existingStmt->fetch();

    if ($existing && $existing['status'] === 'completed') {
        $db->commit();
        jsonOk(['status' => 'completed', 'alreadyProcessed' => true]);
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
            $captureId, $pricing['zar']['totalZar'], $paidAmount, $paidCurrency, $pricing['exchangeRate'],
            json_encode(['isBundle' => $pricing['zar']['isBundle'], 'unlockedModules' => $enrolledCount, 'orderId' => $orderId]),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('PayPal capture/grant failed: ' . $error->getMessage());
    jsonError('Could not complete the unlock right now', 500);
}

jsonCreated([
    'status' => 'completed',
    'parentSlugs' => $realSlugs,
    'amountCharged' => $paidAmount,
    'currency' => $paidCurrency,
    'unlockedModules' => $enrolledCount,
]);
