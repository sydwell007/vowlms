<?php
/**
 * Refreshes the cached ZAR→USD exchange rate that Paystack/PayPal/Lemon
 * Squeezy pricing depends on (see lib/exchange_rates.php's
 * EXCHANGE_RATE_MAX_AGE_HOURS = 36 — after that, computeInternationalUnlockPrice()
 * reports conversionAvailable: false and those three gateways show
 * "Unavailable" to real learners).
 *
 * Gated by the bridge key rather than CRON_SECRET — a real Afrihost cPanel
 * scheduled task calling this on a timer turned out to be unreliable to set
 * up/keep in sync (CRON_SECRET drifted between Vercel and Afrihost twice).
 * Instead this is meant to be called by a Vercel Cron job
 * (vercel.json → /api/cron/refresh-exchange-rate, which itself verifies
 * Vercel's own cron auth before calling through to this endpoint) — Vercel
 * Cron is entirely within the same infrastructure this project already
 * deploys through reliably, so there's nothing extra to configure on
 * Afrihost's side going forward.
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
