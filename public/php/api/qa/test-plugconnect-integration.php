<?php
/**
 * Honest diagnostic: attempts real push (certified-learner profile) and pull
 * (sample opportunities) calls against PLUGCONNECT_API_URL.
 *
 * Verified by reading the plugconnect repo directly: it has no opportunities
 * push/pull API today — its only bridge route explicitly rejects POST with
 * "Protected mutations must use a dedicated authenticated route" (405), and
 * there is no /api/opportunities endpoint at all. Both calls below are expected
 * to fail until that's built — this file reports that accurately rather than
 * faking a pass.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/lib/health-log.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

function plugConnectCall(string $endpoint, string $method, ?array $body, string $apiKey): array {
    $start = microtime(true);
    $ch = curl_init($endpoint);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Bridge-Key: ' . $apiKey],
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST] = true;
        $opts[CURLOPT_POSTFIELDS] = json_encode($body);
    }
    curl_setopt_array($ch, $opts);
    $responseBody = curl_exec($ch);
    $curlError = curl_error($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $success = $responseBody !== false && $statusCode >= 200 && $statusCode < 300;
    return [
        'success' => $success,
        'status_code' => $statusCode ?: null,
        'response_time_ms' => (int)round((microtime(true) - $start) * 1000),
        'body' => $responseBody ? json_decode($responseBody, true) : null,
        'error' => $success ? null : ($curlError ?: "HTTP {$statusCode}"),
    ];
}

$apiUrl = env('PLUGCONNECT_API_URL');
$apiKey = env('PLUGCONNECT_API_KEY');
$db = getDb();
$triggeredBy = $payload['sub'] ?? null;

if ($apiUrl === '') {
    logIntegrationHealth($db, [
        'service_name' => 'plugconnect',
        'endpoint' => 'PLUGCONNECT_API_URL (unset)',
        'success' => false,
        'error_message' => 'NOT_CONFIGURED — PLUGCONNECT_API_URL is not set',
        'triggered_by' => $triggeredBy,
    ]);
    jsonOk([
        'push_success' => false,
        'pull_success' => false,
        'sample_opportunities' => [],
        'errors' => ['PLUGCONNECT_API_URL is not set in this environment.'],
    ]);
}

$base = rtrim($apiUrl, '/');

$push = plugConnectCall("{$base}/learners", 'POST', [
    'test_mode' => true,
    'learner' => ['name' => 'QA Test Learner', 'certificateSlug' => 'qa-diagnostic-test'],
], $apiKey);
logIntegrationHealth($db, [
    'service_name' => 'plugconnect',
    'endpoint' => "{$base}/learners",
    'status_code' => $push['status_code'],
    'response_time_ms' => $push['response_time_ms'],
    'success' => $push['success'],
    'error_message' => $push['error'],
    'triggered_by' => $triggeredBy,
]);

$pull = plugConnectCall("{$base}/opportunities?skillCategory=upskilling&limit=3", 'GET', null, $apiKey);
logIntegrationHealth($db, [
    'service_name' => 'plugconnect',
    'endpoint' => "{$base}/opportunities",
    'status_code' => $pull['status_code'],
    'response_time_ms' => $pull['response_time_ms'],
    'success' => $pull['success'],
    'error_message' => $pull['error'],
    'triggered_by' => $triggeredBy,
]);

$errors = array_values(array_filter([$push['error'], $pull['error']]));

jsonOk([
    'push_success' => $push['success'],
    'pull_success' => $pull['success'],
    'sample_opportunities' => $pull['success'] ? ($pull['body']['data'] ?? []) : [],
    'errors' => $errors,
]);
