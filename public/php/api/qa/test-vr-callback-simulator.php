<?php
/**
 * Fires a fake VR-completion event at test-vr-callback.php via an internal loopback call,
 * so that receiver can be exercised without a real VR session (or a working VR platform —
 * see that file's header for why nothing calls it in production yet).
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$body = getJsonBody();
$userId = $body['user_id'] ?? $payload['sub'];
$courseId = $body['course_id'] ?? null;
$moduleId = $body['module_id'] ?? null;

if (!$courseId) jsonError('course_id is required (a real course id to simulate a session for)');

$bridgeKey = env('BRIDGE_API_KEY');
$selfUrl = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . dirname($_SERVER['REQUEST_URI'] ?? '') . '/test-vr-callback.php';

$fakePayload = [
    'user_id' => $userId,
    'course_id' => $courseId,
    'module_id' => $moduleId,
    'vr_scenario_id' => 'qa-simulated-scenario-' . substr(bin2hex(random_bytes(4)), 0, 8),
    'score' => 86.5,
    'completed_at' => date('c'),
];

$ch = curl_init($selfUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-Bridge-Key: ' . $bridgeKey,
        'Authorization: ' . ($_SERVER['HTTP_AUTHORIZATION'] ?? ''),
    ],
    CURLOPT_POSTFIELDS => json_encode($fakePayload),
]);
$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

jsonOk([
    'simulatedPayload' => $fakePayload,
    'callbackStatusCode' => $statusCode ?: null,
    'callbackResponse' => $response ? json_decode($response, true) : null,
    'error' => $response === false ? $curlError : null,
]);
