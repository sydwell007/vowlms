<?php
/**
 * One-time manual trigger for the exchange-rate refresh, identical to
 * get-exchange-rates.php's own logic, but gated by the bridge key (already
 * proven reachable/working) instead of CRON_SECRET (currently mismatched on
 * this server — see docs/vowrewards/VOWR_LEDGER_AND_PAYMENT_FLOW.md). Fixes
 * the live "Pricing unavailable" state blocking Paystack/PayPal/Lemon
 * Squeezy checkout right now, without waiting on that separately. Safe to
 * re-run (ON DUPLICATE KEY UPDATE). Delete this file once the real
 * CRON_SECRET mismatch is fixed and the scheduled cron job takes over.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$apiKey = env('EXCHANGE_RATE_API_KEY', '');
if ($apiKey === '') jsonError('EXCHANGE_RATE_API_KEY is not configured on this server', 503);

$apiBase = env('EXCHANGE_RATE_API_BASE_URL', 'https://v6.exchangerate-api.com/v6');
$quoteCurrencies = ['USD'];

$url = rtrim($apiBase, '/') . '/' . $apiKey . '/latest/ZAR';
$ch = curl_init($url);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15]);
$response = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $httpStatus !== 200) {
    jsonError("Exchange rate fetch failed: HTTP {$httpStatus} " . ($curlError ?: ''), 502);
}

$data = json_decode($response, true);
$rates = $data['conversion_rates'] ?? null;
if (!is_array($rates)) jsonError('Unexpected exchange rate API response shape', 502);

$db = getDb();
$stmt = $db->prepare(
    "INSERT INTO exchange_rates (base_currency, quote_currency, rate, fetched_at)
     VALUES ('ZAR', ?, ?, NOW())
     ON DUPLICATE KEY UPDATE rate = VALUES(rate), fetched_at = NOW()"
);

$updated = [];
foreach ($quoteCurrencies as $currency) {
    if (!isset($rates[$currency])) continue;
    $stmt->execute([$currency, (float)$rates[$currency]]);
    $updated[] = ['currency' => $currency, 'rate' => (float)$rates[$currency]];
}

jsonOk(['updated' => $updated]);
