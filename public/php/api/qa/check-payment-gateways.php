<?php
/**
 * Temporary diagnostic — confirms every payment gateway (PayFast, Paystack,
 * PayPal, Lemon Squeezy) is actually configured and reachable from Afrihost,
 * without exposing any secret value. Booleans and non-sensitive identifiers
 * only (public key prefix, store/variant IDs, sandbox flags, HTTP status
 * codes, provider-returned non-sensitive messages). Bridge-key only, no user
 * auth, read-only — makes no purchase, no charge, no state change anywhere.
 * Delete this file once gateway configuration is confirmed.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
// require (not require_once + a plain check) fatals unconditionally and
// unrecoverably if the file is missing — exactly what we're trying to
// detect here — so these two are deliberately soft: missing either one is
// reported as a step result below instead of crashing the whole diagnostic.
$paypalClientLibFound = file_exists(__DIR__ . '/../../lib/paypal_client.php');
if ($paypalClientLibFound) require_once __DIR__ . '/../../lib/paypal_client.php';
$lemonsqueezyClientLibFound = file_exists(__DIR__ . '/../../lib/lemonsqueezy_client.php');
if ($lemonsqueezyClientLibFound) require_once __DIR__ . '/../../lib/lemonsqueezy_client.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$report = ['steps' => []];

function step(array &$report, string $name, callable $fn): void {
    try {
        $report['steps'][$name] = ['ok' => true, 'result' => $fn()];
    } catch (Throwable $e) {
        $report['steps'][$name] = ['ok' => false, 'error' => $e->getMessage(), 'type' => get_class($e)];
    }
}

function curlJson(string $url, array $headers): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => $headers]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    return ['status' => $status, 'data' => $response ? json_decode($response, true) : null, 'curlError' => $error ?: null];
}

// ── PayFast ───────────────────────────────────────────────────────────────
step($report, 'payfast_env', function () {
    return [
        'merchantIdConfigured' => env('PAYFAST_MERCHANT_ID', '') !== '',
        'merchantKeyConfigured' => env('PAYFAST_MERCHANT_KEY', '') !== '',
        'passphraseConfigured' => env('PAYFAST_PASSPHRASE', '') !== '',
        'sandbox' => env('PAYFAST_SANDBOX', 'true') === 'true',
    ];
});

// ── Paystack ──────────────────────────────────────────────────────────────
step($report, 'paystack_env', function () {
    $pub = env('PAYSTACK_PUBLIC_KEY', '');
    return [
        'secretKeyConfigured' => env('PAYSTACK_SECRET_KEY', '') !== '',
        'publicKeyConfigured' => $pub !== '',
        'publicKeyMode' => str_starts_with($pub, 'pk_live_') ? 'live' : (str_starts_with($pub, 'pk_test_') ? 'test' : 'unknown'),
    ];
});
step($report, 'paystack_live_auth_check', function () {
    $secretKey = env('PAYSTACK_SECRET_KEY', '');
    if ($secretKey === '') throw new RuntimeException('PAYSTACK_SECRET_KEY not configured');
    // A nonexistent reference: Paystack returns 404 "Transaction reference
    // not found" if the key is VALID (auth passed, lookup just found
    // nothing), vs 401 "Invalid key" if the key itself is bad — this tells
    // us the key works without ever touching a real transaction.
    $result = curlJson('https://api.paystack.co/transaction/verify/qa-diagnostic-nonexistent-ref', [
        'Authorization: Bearer ' . $secretKey,
    ]);
    return [
        'httpStatus' => $result['status'],
        'providerMessage' => $result['data']['message'] ?? null,
        'keyLooksValid' => $result['status'] === 404,
    ];
});

// ── PayPal ────────────────────────────────────────────────────────────────
step($report, 'paypal_env', function () {
    return [
        'clientIdConfigured' => env('PAYPAL_CLIENT_ID', '') !== '',
        'clientSecretConfigured' => env('PAYPAL_CLIENT_SECRET', '') !== '',
        'webhookIdConfigured' => env('PAYPAL_WEBHOOK_ID', '') !== '',
        'sandbox' => env('PAYPAL_SANDBOX', 'true') === 'true',
        'apiBase' => paypalApiBase(),
    ];
});
step($report, 'paypal_live_auth_check', function () use ($paypalClientLibFound) {
    if (!$paypalClientLibFound) throw new RuntimeException('lib/paypal_client.php is missing on this server');
    $token = getPaypalAccessToken(); // throws on failure — we never return the token itself
    return ['tokenObtained' => $token !== '', 'tokenLength' => strlen($token)];
});

// ── Lemon Squeezy ─────────────────────────────────────────────────────────
step($report, 'lemonsqueezy_env', function () {
    return [
        'apiKeyConfigured' => env('LEMONSQUEEZY_API_KEY', '') !== '',
        'storeId' => env('LEMONSQUEEZY_STORE_ID', '') ?: null,
        'variantId' => env('LEMONSQUEEZY_VARIANT_ID', '') ?: null,
        'webhookSecretConfigured' => env('LEMONSQUEEZY_WEBHOOK_SECRET', '') !== '',
    ];
});
step($report, 'lemonsqueezy_store_check', function () use ($lemonsqueezyClientLibFound) {
    if (!$lemonsqueezyClientLibFound) throw new RuntimeException('lib/lemonsqueezy_client.php is missing on this server');
    $storeId = env('LEMONSQUEEZY_STORE_ID', '');
    if ($storeId === '') throw new RuntimeException('LEMONSQUEEZY_STORE_ID not configured');
    $result = lemonSqueezyRequest('GET', '/stores/' . $storeId);
    return [
        'httpStatus' => $result['status'],
        'storeName' => $result['data']['data']['attributes']['name'] ?? null,
        'storeFound' => $result['status'] === 200,
    ];
});
step($report, 'lemonsqueezy_variant_check', function () use ($lemonsqueezyClientLibFound) {
    if (!$lemonsqueezyClientLibFound) throw new RuntimeException('lib/lemonsqueezy_client.php is missing on this server');
    $variantId = env('LEMONSQUEEZY_VARIANT_ID', '');
    if ($variantId === '') throw new RuntimeException('LEMONSQUEEZY_VARIANT_ID not configured');
    $result = lemonSqueezyRequest('GET', '/variants/' . $variantId);
    return [
        'httpStatus' => $result['status'],
        'variantName' => $result['data']['data']['attributes']['name'] ?? null,
        'variantPriceCents' => $result['data']['data']['attributes']['price'] ?? null,
        'isPayWhatYouWant' => $result['data']['data']['attributes']['pay_what_you_want'] ?? null,
        'variantFound' => $result['status'] === 200,
    ];
});

// ── Gateway routing + FX cache (DB, read-only) ───────────────────────────
$db = getDb();
step($report, 'gateway_config_rows', function () use ($db) {
    $stmt = $db->query('SELECT country_code, gateway, currency, enabled FROM gateway_config ORDER BY country_code');
    return $stmt->fetchAll();
});
step($report, 'exchange_rate_cache', function () use ($db) {
    $stmt = $db->query('SELECT base_currency, quote_currency, rate, fetched_at, TIMESTAMPDIFF(HOUR, fetched_at, NOW()) AS age_hours FROM exchange_rates');
    return $stmt->fetchAll();
});
step($report, 'cron_secret_env', function () {
    return ['configured' => env('CRON_SECRET', '') !== ''];
});

jsonOk($report);
