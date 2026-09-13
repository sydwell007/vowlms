<?php
/**
 * Verifies a Paystack transaction server-side (never trusts the frontend
 * popup's own success callback alone) before granting course access.
 * Mirrors payfast-notify.php's idempotency pattern and unlock-with-vowr.php's
 * already-owns-everything guard, applied to the new international_payments
 * ledger instead of the PayFast-specific `payments` table.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/international_pricing.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId = $payload['sub'];
$db = getDb();

$body = getJsonBody();
$reference = trim($body['reference'] ?? '');
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];

if ($reference === '') jsonError('reference is required');
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

$secretKey = env('PAYSTACK_SECRET_KEY', '');
if ($secretKey === '') jsonError('Paystack is not configured', 503);

// This endpoint is only ever reached because the learner paid via Paystack
// (possibly after manually overriding their auto-detected gateway), so the
// expected charge is always recomputed against Paystack's own configured
// currency — never the country-based auto-detected gateway, which could
// differ from what was actually shown/charged if they did override it.
try {
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'paystack');
} catch (Throwable $error) {
    error_log('computeInternationalUnlockPrice failed: ' . $error->getMessage());
    jsonError('Pricing is temporarily unavailable, please try again shortly', 503);
}
if ($pricing === null) jsonError('None of the requested courses have unlock pricing configured', 404);
if (!$pricing['conversionAvailable']) jsonError('Pricing is temporarily unavailable, please try again shortly', 503);

$realSlugs = array_column($pricing['zar']['items'], 'parentSlug');
$childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
if (count($childCourseIds) === 0) jsonError('No unlockable modules found for these courses', 404);

if (alreadyOwnsAllCourses($db, $userId, $childCourseIds)) {
    jsonError('You already have full access to this course', 409);
}

// Verify the transaction directly with Paystack — the one source of truth
// for whether real money actually changed hands.
$ch = curl_init("https://api.paystack.co/transaction/verify/" . rawurlencode($reference));
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer {$secretKey}"],
]);
$verifyResponse = curl_exec($ch);
$verifyStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($verifyResponse === false || $verifyStatus !== 200) {
    jsonError('Could not verify payment with Paystack', 502);
}

$verifyData = json_decode($verifyResponse, true);
$txn = $verifyData['data'] ?? null;
if (!$txn || ($txn['status'] ?? '') !== 'success') {
    jsonError('Payment was not successful', 400);
}

// Paystack amounts are in the smallest currency unit (e.g. cents); compare
// against our own server-computed expected charge, not anything the client
// submitted, with a small tolerance for rounding.
$expectedMinorUnits = (int)round($pricing['amountCharged'] * 100);
$paidMinorUnits = (int)($txn['amount'] ?? 0);
$paidCurrency = strtoupper($txn['currency'] ?? '');

if ($paidCurrency !== $pricing['currency'] || abs($paidMinorUnits - $expectedMinorUnits) > 5) {
    error_log("Paystack amount/currency mismatch for ref {$reference}: expected {$expectedMinorUnits} {$pricing['currency']}, got {$paidMinorUnits} {$paidCurrency}");
    jsonError('Payment amount does not match the expected price', 400);
}

try {
    $db->beginTransaction();

    // Idempotent: a webhook and this verify call can both arrive for the
    // same transaction, or a learner can double-click / retry.
    $existingStmt = $db->prepare('SELECT id, status FROM international_payments WHERE gateway = "paystack" AND external_transaction_id = ? FOR UPDATE');
    $existingStmt->execute([$reference]);
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
             VALUES (?, ?, ?, ?, "paystack", ?, ?, ?, ?, ?, "completed", ?)'
        )->execute([
            generateId(), $userId, $childCourseIds[0], json_encode($realSlugs),
            $reference, $pricing['zar']['totalZar'], $pricing['amountCharged'], $pricing['currency'], $pricing['exchangeRate'],
            json_encode(['isBundle' => $pricing['zar']['isBundle'], 'unlockedModules' => $enrolledCount]),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Paystack verify/grant failed: ' . $error->getMessage());
    jsonError('Could not complete the unlock right now', 500);
}

jsonCreated([
    'status' => 'completed',
    'parentSlugs' => $realSlugs,
    'amountCharged' => $pricing['amountCharged'],
    'currency' => $pricing['currency'],
    'unlockedModules' => $enrolledCount,
]);
