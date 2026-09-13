<?php
/**
 * Creates a Lemon Squeezy hosted checkout for unlocking one or more
 * Upskilling courses. The amount is always the server-computed converted
 * price from computeInternationalUnlockPrice() — never a value the frontend
 * sends — passed as `custom_price` (integer cents) against a single
 * "pay what you want" variant configured once in the Lemon Squeezy
 * dashboard (LEMONSQUEEZY_STORE_ID / LEMONSQUEEZY_VARIANT_ID) rather than
 * one variant per course. Unlike Paystack/PayPal, there is no popup/inline
 * flow here — the buyer is redirected to Lemon Squeezy's own hosted page and
 * back; lemonsqueezy-webhook.php (not this endpoint) is the one that
 * actually grants access once Lemon Squeezy confirms the order was paid.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/international_pricing.php';
require_once __DIR__ . '/../../lib/lemonsqueezy_client.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId = $payload['sub'];
$userEmail = $payload['email'] ?? null;
$db = getDb();

$body = getJsonBody();
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

$storeId = env('LEMONSQUEEZY_STORE_ID', '');
$variantId = env('LEMONSQUEEZY_VARIANT_ID', '');
if ($storeId === '' || $variantId === '') jsonError('Lemon Squeezy is not configured', 503);

// This endpoint only ever creates a Lemon Squeezy checkout, so pricing is
// always resolved against Lemon Squeezy's own configured currency (always
// USD — see lemonsqueezy_client.php) — never the country-based
// auto-detected gateway, which could differ if the learner manually chose
// Lemon Squeezy via "Other payment options".
try {
    $pricing = computeInternationalUnlockPrice($db, $parentSlugs, 'DEFAULT', 'lemonsqueezy');
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
$redirectSlug = $realSlugs[0];

try {
    $result = lemonSqueezyRequest('POST', '/checkouts', [
        'data' => [
            'type' => 'checkouts',
            'attributes' => [
                // Integer cents in USD — Lemon Squeezy's own currency, never ZAR.
                'custom_price' => (int)round($pricing['amountCharged'] * 100),
                'checkout_data' => array_filter([
                    'email' => $userEmail,
                    'custom' => [
                        'user_id' => $userId,
                        // JSON-encoded like PayPal's custom_id, since custom_data
                        // fields are simplest treated as flat strings.
                        'parent_slugs' => json_encode($realSlugs),
                    ],
                ]),
                'product_options' => array_filter([
                    'name' => substr($itemName, 0, 255),
                    'redirect_url' => "{$appUrl}/courses/{$redirectSlug}?payment=success",
                ]),
                'expires_at' => null,
            ],
            'relationships' => [
                'store' => ['data' => ['type' => 'stores', 'id' => (string)$storeId]],
                'variant' => ['data' => ['type' => 'variants', 'id' => (string)$variantId]],
            ],
        ],
    ]);
} catch (Throwable $error) {
    error_log('Lemon Squeezy create checkout failed: ' . $error->getMessage());
    jsonError('Payment service is not configured', 503);
}

$checkoutUrl = $result['data']['data']['attributes']['url'] ?? null;
if ($result['status'] !== 201 || !$checkoutUrl) {
    error_log('Lemon Squeezy create checkout unexpected response: ' . json_encode($result));
    jsonError('Could not start Lemon Squeezy checkout', 502);
}

jsonCreated([
    'checkoutUrl' => $checkoutUrl,
    'currency' => $pricing['currency'],
    'amountCharged' => $pricing['amountCharged'],
]);
