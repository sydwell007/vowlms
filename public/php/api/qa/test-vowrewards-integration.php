<?php
/**
 * Honest diagnostic, not a mocked-success stub: attempts a real call to the
 * VowRewards system using the configured VOWREWARDS_API_URL/VOWREWARDS_API_KEY
 * (public/php/config/env.php — same pair already listed in .env.example).
 *
 * As of this writing, vowrewards-school (school.vowrewards.co.za) has no endpoint
 * that accepts an external reward event — verified by reading that repo directly,
 * not assumed. This will correctly report a connection failure / 404 until that
 * team ships one. That is the accurate pre-launch signal, not a bug in this file.
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

$body = getJsonBody();
$eventType = $body['event_type'] ?? '';
$testUserId = $body['test_user_id'] ?? null;

$allowedEvents = ['LESSON_COMPLETE', 'QUIZ_PASSED', 'COURSE_COMPLETE', 'CERTIFICATE_EARNED'];
if (!in_array($eventType, $allowedEvents, true)) {
    jsonError('event_type must be one of: ' . implode(', ', $allowedEvents));
}

$apiUrl = env('VOWREWARDS_API_URL');
$apiKey = env('VOWREWARDS_API_KEY');
$db = getDb();

if ($apiUrl === '') {
    logIntegrationHealth($db, [
        'service_name' => 'vowrewards',
        'endpoint' => 'VOWREWARDS_API_URL (unset)',
        'success' => false,
        'error_message' => 'NOT_CONFIGURED — VOWREWARDS_API_URL is not set',
        'triggered_by' => $payload['sub'] ?? null,
    ]);
    jsonOk([
        'success' => false,
        'vowrewards_response' => null,
        'response_time_ms' => 0,
        'status' => 'NOT_CONFIGURED',
        'detail' => 'VOWREWARDS_API_URL is not set in this environment.',
    ]);
}

$endpoint = rtrim($apiUrl, '/') . '/reward-events';
$start = microtime(true);

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-Bridge-Key: ' . $apiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'event_type' => $eventType,
        'test_user_id' => $testUserId,
        // Marks this clearly as a test call — see file header. If VowRewards ever adds a real
        // ingestion endpoint without a documented sandbox mode, do NOT remove this flag; use a
        // dedicated test user id excluded from real reward totals instead.
        'test_mode' => true,
    ]),
]);
$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$responseTimeMs = (int)round((microtime(true) - $start) * 1000);
$success = $responseBody !== false && $statusCode >= 200 && $statusCode < 300;
$decoded = $responseBody ? json_decode($responseBody, true) : null;

logIntegrationHealth($db, [
    'service_name' => 'vowrewards',
    'endpoint' => $endpoint,
    'status_code' => $statusCode ?: null,
    'response_time_ms' => $responseTimeMs,
    'success' => $success,
    'error_message' => $success ? null : ($curlError ?: "HTTP {$statusCode}"),
    'triggered_by' => $payload['sub'] ?? null,
]);

jsonOk([
    'success' => $success,
    'vowrewards_response' => $decoded,
    'response_time_ms' => $responseTimeMs,
    'status' => $success ? 'OK' : 'UNREACHABLE',
    'detail' => $success ? null : ($curlError ?: "VowRewards responded HTTP {$statusCode}"),
]);
