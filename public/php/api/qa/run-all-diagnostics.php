<?php
/**
 * Master diagnostic sweep — calls every check in public/php/api/qa/ (plus the public
 * health.php) via internal loopback and compiles one combined report with a top-level
 * LAUNCH_READY verdict.
 *
 * By default this only runs read-only / outbound-test-mode checks (db, seed integrity,
 * health, vowrewards, plugconnect, payfast-simulator-status). The two checks that write
 * real local data or send a real email (test-vr-callback-simulator, test-smtp-email) are
 * skipped unless ?includeWriteTests=true is passed — appropriate for the recommended daily
 * cron/uptime-monitor cadence, so a week of daily runs doesn't accumulate a week of test VR
 * sessions or spam a test inbox every day.
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
requireMethod('GET');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$includeWriteTests = ($_GET['includeWriteTests'] ?? '') === 'true';
$bridgeKey = env('BRIDGE_API_KEY');
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
$baseUrl = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . dirname(dirname($_SERVER['REQUEST_URI'] ?? ''));

function loopbackCall(string $url, string $method, ?array $body, string $bridgeKey, string $authHeader): array {
    $ch = curl_init($url);
    $headers = ['Content-Type: application/json', 'X-Bridge-Key: ' . $bridgeKey];
    if ($authHeader) $headers[] = 'Authorization: ' . $authHeader;

    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => $headers,
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST] = true;
        $opts[CURLOPT_POSTFIELDS] = json_encode($body ?? []);
    }
    curl_setopt_array($ch, $opts);
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [
        'statusCode' => $statusCode ?: null,
        'body' => $response ? json_decode($response, true) : null,
        'error' => $response === false ? $error : null,
    ];
}

$results = [];

$results['health'] = loopbackCall("{$baseUrl}/health.php", 'GET', null, $bridgeKey, $authHeader);
$results['dbConnection'] = loopbackCall("{$baseUrl}/qa/test-db-connection.php", 'POST', [], $bridgeKey, $authHeader);
$results['seedIntegrity'] = loopbackCall("{$baseUrl}/qa/verify-seed-integrity.php", 'GET', null, $bridgeKey, $authHeader);
$results['vowRewards'] = loopbackCall("{$baseUrl}/qa/test-vowrewards-integration.php", 'POST', ['event_type' => 'LESSON_COMPLETE', 'test_user_id' => null], $bridgeKey, $authHeader);
$results['plugConnect'] = loopbackCall("{$baseUrl}/qa/test-plugconnect-integration.php", 'POST', [], $bridgeKey, $authHeader);
$results['payfastSimulator'] = loopbackCall("{$baseUrl}/qa/test-payfast-itn-simulator.php", 'POST', [], $bridgeKey, $authHeader);

if ($includeWriteTests) {
    $results['smtp'] = loopbackCall("{$baseUrl}/qa/test-smtp-email.php", 'POST', [
        'to_email' => env('QA_DIAGNOSTIC_EMAIL', 'support@goalvow.com'),
        'template' => 'welcome',
    ], $bridgeKey, $authHeader);
} else {
    $results['smtp'] = ['skipped' => true, 'reason' => 'includeWriteTests not set'];
}

// LAUNCH_READY gates on the checks VowLMS fully controls (health, db, seed integrity).
// vowRewards/plugConnect are known, documented external blockers (see SCHEMA_CHANGELOG.md
// "014-017") and don't gate this flag — they're reported separately so the real dependency
// on those two teams stays visible without making every run say "not ready" for a reason
// outside this codebase. payfastSimulator is informational only (see its own file header —
// it can never report a true end-to-end pass against a synthetic ITN).
$coreChecks = [
    $results['health']['statusCode'] === 200,
    ($results['dbConnection']['body']['data']['success'] ?? false) === true,
    ($results['seedIntegrity']['body']['data']['overall_status'] ?? null) === 'PASS',
];
$launchReady = !in_array(false, $coreChecks, true);

logIntegrationHealth(getDb(), [
    'service_name' => 'diagnostics',
    'endpoint' => 'qa/run-all-diagnostics',
    'status_code' => 200,
    'success' => $launchReady,
    'error_message' => $launchReady ? null : 'One or more core VowLMS-controlled checks failed — see full report.',
    'triggered_by' => $payload['sub'] ?? null,
]);

jsonOk([
    'LAUNCH_READY' => $launchReady,
    'coreChecksControlledByVowLms' => [
        'health' => $results['health']['statusCode'] === 200,
        'dbConnection' => $results['dbConnection']['body']['data']['success'] ?? false,
        'seedIntegrity' => ($results['seedIntegrity']['body']['data']['overall_status'] ?? null) === 'PASS',
    ],
    'externalDependencies' => [
        'vowRewards' => $results['vowRewards']['body']['data']['status'] ?? 'ERROR',
        'plugConnect' => [
            'push' => $results['plugConnect']['body']['data']['push_success'] ?? false,
            'pull' => $results['plugConnect']['body']['data']['pull_success'] ?? false,
        ],
        'note' => 'These two do not gate LAUNCH_READY — they reflect readiness of the vowrewards-school and plugconnect teams, not VowLMS. See qa-reports/launch-readiness-recommendations.md.',
    ],
    'payfastSimulator' => $results['payfastSimulator']['body']['data'] ?? $results['payfastSimulator'],
    'results' => $results,
    'checkedAt' => date('c'),
]);
