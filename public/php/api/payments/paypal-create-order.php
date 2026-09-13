<?php
/**
 * Creates a PayPal order (Orders v2) for unlocking one or more Upskilling
 * courses. The amount is always the server-computed converted price from
 * computeInternationalUnlockPrice() — never a value the frontend sends —
 * so nothing the browser submits can change what PayPal is asked to charge.
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
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

// This endpoint only ever creates a PayPal order, so pricing is always
// resolved against PayPal's own configured currency — never the
// country-based auto-detected gateway (which could differ if the learner
// manually chose PayPal via "Other payment options").
try {
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'paypal');
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

$itemName = count($realSlugs) > 1
    ? 'GoalVow Career Path (' . count($realSlugs) . ' courses)'
    : ('Unlock: ' . $realSlugs[0]);

try {
    $result = paypalRequest('POST', '/v2/checkout/orders', [
        'intent' => 'CAPTURE',
        'purchase_units' => [[
            'description' => substr($itemName, 0, 127),
            'custom_id' => json_encode(['userId' => $userId, 'parentSlugs' => $realSlugs]),
            'amount' => [
                'currency_code' => $pricing['currency'],
                'value' => number_format($pricing['amountCharged'], 2, '.', ''),
            ],
        ]],
    ], generateId());
} catch (Throwable $error) {
    error_log('PayPal create order failed: ' . $error->getMessage());
    jsonError('Payment service is not configured', 503);
}

if ($result['status'] !== 201 || empty($result['data']['id'])) {
    error_log('PayPal create order unexpected response: ' . json_encode($result));
    jsonError('Could not start PayPal checkout', 502);
}

jsonCreated([
    'orderId' => $result['data']['id'],
    'currency' => $pricing['currency'],
    'amountCharged' => $pricing['amountCharged'],
]);
