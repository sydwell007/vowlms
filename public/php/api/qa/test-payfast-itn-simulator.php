<?php
/**
 * ⚠️ DEV/TEST ONLY — DISABLE BEFORE PRODUCTION TRAFFIC BEGINS. ⚠️
 * This endpoint exercises the real ITN handler (public/php/api/payments/payfast-notify.php)
 * with a synthetic payload. It is disabled by default and requires BOTH the bridge key AND
 * a dedicated opt-in env var — remove this file, or ensure ALLOW_QA_SIMULATORS is never set
 * to "true" in production, before go-live.
 *
 * IMPORTANT LIMITATION: the real ITN handler cross-validates every callback against PayFast's
 * own live /eng/query/validate endpoint (payfast-notify.php:85-101) and requires a matching
 * `payments` row that a real /api/payments/payfast/create call would have created. A synthetic
 * ITN can never pass that live PayFast check — this simulator can only verify the handler's
 * own pipeline up to that point (bridge auth, signature format, merchant id match), and will
 * correctly, expectedly receive "payfast-verify-failed" or "payment-not-found" back. That is
 * confirmation the handler is reachable and validating correctly, not a false "OK".
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/lib/health-log.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

if (env('ALLOW_QA_SIMULATORS') !== 'true') {
    jsonError('QA simulators are disabled. Set ALLOW_QA_SIMULATORS=true to enable in a non-production environment only.', 403);
}

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$merchantId = env('PAYFAST_MERCHANT_ID');
$passphrase = env('PAYFAST_PASSPHRASE');
$bridgeKey = env('BRIDGE_API_KEY');

if ($merchantId === '') jsonError('PAYFAST_MERCHANT_ID is not configured', 503);

$fakePfData = [
    'm_payment_id' => 'qa-simulated-' . bin2hex(random_bytes(6)),
    'pf_payment_id' => (string)random_int(100000000, 999999999),
    'payment_status' => 'COMPLETE',
    'amount_gross' => '199.00',
    'merchant_id' => $merchantId,
];

// Real PayFast signature algorithm (payfastParamString + md5), so the handler's own
// signature check passes and it proceeds to the (unavoidably failing) live PayFast validation.
$pairs = [];
foreach ($fakePfData as $key => $value) {
    $pairs[] = $key . '=' . urlencode(trim((string)$value));
}
$parameterString = implode('&', $pairs);
if ($passphrase !== '') $parameterString .= '&passphrase=' . urlencode($passphrase);
$fakePfData['signature'] = md5($parameterString);

$notifyUrl = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '/php/api/payments/payfast-notify.php';

$start = microtime(true);
$ch = curl_init($notifyUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Bridge-Key: ' . $bridgeKey],
    CURLOPT_POSTFIELDS => json_encode(['itnRaw' => http_build_query($fakePfData)]),
]);
$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

$responseText = $response === false ? null : trim((string)$response);
// Any of these responses means the handler correctly received, authenticated, and validated
// the request through its own pipeline before hitting the (expected) live-PayFast wall.
$handlerReachedCorrectly = in_array($responseText, ['payment-not-found', 'payfast-verify-failed', 'amount-mismatch'], true);

$db = getDb();
logIntegrationHealth($db, [
    'service_name' => 'payfast',
    'endpoint' => $notifyUrl,
    'status_code' => $statusCode ?: null,
    'response_time_ms' => (int)round((microtime(true) - $start) * 1000),
    'success' => $handlerReachedCorrectly,
    'error_message' => $handlerReachedCorrectly ? null : ($curlError ?: "Unexpected response: {$responseText}"),
    'triggered_by' => $payload['sub'] ?? null,
]);

jsonOk([
    'itn_accepted' => $handlerReachedCorrectly,
    'access_granted' => $responseText === 'OK', // Will only ever be true against a real pending payment.
    'raw_handler_response' => $responseText,
    'error' => $handlerReachedCorrectly ? null : ($curlError ?: "Unexpected response: {$responseText}"),
]);
