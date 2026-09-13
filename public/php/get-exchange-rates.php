<?php
/**
 * Scheduled ZAR → USD exchange-rate refresh. Intended to run once daily via
 * an Afrihost cPanel cron job (either as a CLI command — `php
 * /path/to/get-exchange-rates.php` — or as a curl'd URL with the cron
 * secret; both work). This is the ONLY place in the whole payment system
 * that calls a third-party FX API — every checkout/display path reads the
 * cache this writes via lib/exchange_rates.php.
 *
 * ⚠ Requires a real EXCHANGE_RATE_API_KEY (config/env.local.php or a host
 * environment variable) from a real FX data provider — this script refuses
 * to run without one rather than fabricate or hardcode a rate. Written
 * against exchangerate-api.com's v6 shape; swap EXCHANGE_RATE_API_BASE_URL
 * if a different provider is chosen.
 *
 * Only USD is fetched today because that's the only currency gateway_config
 * currently routes Paystack/PayPal learners to (see 023_gateway_config.sql)
 * — add more currencies to $quoteCurrencies below if that ever changes.
 */
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/db.php';

$isCli = php_sapi_name() === 'cli';
if (!$isCli) {
    $cronSecret = env('CRON_SECRET', '');
    if ($cronSecret === '' || !hash_equals($cronSecret, $_GET['token'] ?? '')) {
        http_response_code(403);
        echo 'Forbidden';
        exit;
    }
}

$apiKey = env('EXCHANGE_RATE_API_KEY', '');
if ($apiKey === '') {
    fwrite(STDERR, "EXCHANGE_RATE_API_KEY is not set — refusing to fetch or fabricate a rate.\n");
    exit(1);
}

$apiBase = env('EXCHANGE_RATE_API_BASE_URL', 'https://v6.exchangerate-api.com/v6');
$quoteCurrencies = ['USD'];

$url = rtrim($apiBase, '/') . '/' . $apiKey . '/latest/ZAR';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
]);
$response = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $httpStatus !== 200) {
    fwrite(STDERR, "Exchange rate fetch failed: HTTP $httpStatus $curlError\n");
    exit(1);
}

$data = json_decode($response, true);
$rates = $data['conversion_rates'] ?? null;
if (!is_array($rates)) {
    fwrite(STDERR, "Unexpected exchange rate API response shape.\n");
    exit(1);
}

$db = getDb();
$stmt = $db->prepare(
    'INSERT INTO exchange_rates (base_currency, quote_currency, rate, fetched_at)
     VALUES (\'ZAR\', ?, ?, NOW())
     ON DUPLICATE KEY UPDATE rate = VALUES(rate), fetched_at = NOW()'
);

$updated = [];
foreach ($quoteCurrencies as $currency) {
    if (!isset($rates[$currency])) {
        fwrite(STDERR, "No rate returned for $currency, skipping.\n");
        continue;
    }
    $stmt->execute([$currency, (float)$rates[$currency]]);
    $updated[] = $currency;
}

echo 'Updated: ' . implode(', ', $updated) . "\n";
