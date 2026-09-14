<?php
/**
 * Creates a PayPal order (Orders v2) for unlocking one or more Upskilling
 * courses. The amount is always the server-computed converted price from
 * computeInternationalUnlockPrice() — never a value the frontend sends —
 * so nothing the browser submits can change what PayPal is asked to charge.
 *
 * Returns the order's real "approve" link so the frontend can do a plain
 * full-page redirect to paypal.com — deliberately NOT the JS SDK's popup
 * Buttons() flow, which was opening two separate windows (an internal
 * about:blank bridge popup plus PayPal's own login popup) and, on some
 * browser/third-party-cookie combinations, tearing the whole flow down if
 * the blank one got closed first. A redirect is exactly what
 * PayFast/Lemon Squeezy already do, so this makes all four gateways behave
 * the same way. PayPal appends its own `?token={orderId}&PayerID=...` to
 * whatever return_url is given below once the buyer approves.
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

$appUrl = env('APP_URL', 'https://vowlms.vercel.app');
$returnCourseSlug = $realSlugs[0];

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
        'application_context' => [
            'return_url' => "{$appUrl}/courses/{$returnCourseSlug}?paypalReturn=1",
            'cancel_url' => "{$appUrl}/courses/{$returnCourseSlug}?payment=cancelled",
            'shipping_preference' => 'NO_SHIPPING',
            'user_action' => 'PAY_NOW',
        ],
    ], generateId());
} catch (Throwable $error) {
    error_log('PayPal create order failed: ' . $error->getMessage());
    jsonError('Payment service is not configured', 503);
}

if ($result['status'] !== 201 || empty($result['data']['id'])) {
    error_log('PayPal create order unexpected response: ' . json_encode($result));
    jsonError('Could not start PayPal checkout', 502);
}

$approveUrl = null;
foreach ($result['data']['links'] ?? [] as $link) {
    if (($link['rel'] ?? '') === 'approve') {
        $approveUrl = $link['href'];
        break;
    }
}
if ($approveUrl === null) {
    error_log('PayPal create order had no approve link: ' . json_encode($result));
    jsonError('Could not start PayPal checkout', 502);
}

jsonCreated([
    'orderId' => $result['data']['id'],
    'approveUrl' => $approveUrl,
    'currency' => $pricing['currency'],
    'amountCharged' => $pricing['amountCharged'],
]);
