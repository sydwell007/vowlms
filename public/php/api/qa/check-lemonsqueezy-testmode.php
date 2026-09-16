<?php
/**
 * Temporary diagnostic — creates a real (harmless, never captured/charged)
 * Lemon Squeezy checkout and reports whether it came back in test_mode.
 * Bridge-key only. Delete once confirmed.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/lemonsqueezy_client.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$storeId = env('LEMONSQUEEZY_STORE_ID', '');
$variantId = env('LEMONSQUEEZY_VARIANT_ID', '');

$storeResult = lemonSqueezyRequest('GET', '/stores/' . $storeId);
$storeAttrs = $storeResult['data']['data']['attributes'] ?? [];

$checkoutResult = lemonSqueezyRequest('POST', '/checkouts', [
    'data' => [
        'type' => 'checkouts',
        'attributes' => [
            'custom_price' => 1839,
            'checkout_data' => ['email' => 'qa-diagnostic@goalvow.com'],
        ],
        'relationships' => [
            'store' => ['data' => ['type' => 'stores', 'id' => (string)$storeId]],
            'variant' => ['data' => ['type' => 'variants', 'id' => (string)$variantId]],
        ],
    ],
]);
$checkoutAttrs = $checkoutResult['data']['data']['attributes'] ?? null;

jsonOk([
    'storeTestMode' => $storeAttrs['test_mode'] ?? null,
    'checkoutHttpStatus' => $checkoutResult['status'],
    'checkoutUrl' => $checkoutAttrs['url'] ?? null,
    'checkoutTestMode' => $checkoutAttrs['test_mode'] ?? null,
    'checkoutErrors' => $checkoutResult['data']['errors'] ?? null,
]);
