<?php
/**
 * Real inbound receiver for the VR platform (virtual-reality-simulation) to call when a
 * learner completes a VR session. Unlike the VowRewards/PlugConnect diagnostics, this side
 * is genuinely functional today regardless of whether the VR platform has been built to call
 * it yet — verified by reading that repo: it currently has zero backend/outbound calls, so
 * nothing calls this in production yet, but VowLMS's receiving half is real.
 *
 * "Mark corresponding module as complete in Progress table" (original spec) is implemented as
 * marking every lesson in that module complete — `progress` is a per-lesson table
 * (001_schema.sql), there is no module-level progress row in the real schema.
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

$body = getJsonBody();
$userId = $body['user_id'] ?? null;
$courseId = $body['course_id'] ?? null;
$moduleId = $body['module_id'] ?? null;
$scenarioId = trim($body['vr_scenario_id'] ?? '');
$score = isset($body['score']) ? (float)$body['score'] : null;
$completedAt = $body['completed_at'] ?? null;

if (!$userId || !$courseId || !$scenarioId) {
    jsonError('user_id, course_id, and vr_scenario_id are required');
}

$db = getDb();
$start = microtime(true);
$progressUpdated = false;
$rewardTriggered = false;
$error = null;

try {
    $db->beginTransaction();

    $sessionId = generateId();
    $db->prepare(
        'INSERT INTO vr_sessions (id, user_id, course_id, module_id, vr_scenario_id, completed_at, score, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, "completed")'
    )->execute([$sessionId, $userId, $courseId, $moduleId, $scenarioId, $completedAt ?: date('c'), $score]);

    if ($moduleId) {
        $lessonStmt = $db->prepare('SELECT id FROM lessons WHERE module_id = ?');
        $lessonStmt->execute([$moduleId]);
        $lessonIds = $lessonStmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($lessonIds as $lessonId) {
            $db->prepare(
                'INSERT INTO progress (id, user_id, lesson_id, completed, completed_at)
                 VALUES (?, ?, ?, 1, NOW())
                 ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()'
            )->execute([generateId(), $userId, $lessonId]);
        }
        $progressUpdated = count($lessonIds) > 0;

        $db->prepare('UPDATE vr_sessions SET synced_to_lms_progress = 1 WHERE id = ?')->execute([$sessionId]);
    }

    $db->commit();
} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    $error = $e->getMessage();
}

// Trigger the VowRewards event for this completion (same honest-diagnostic reality as
// test-vowrewards-integration.php — logged either way).
if ($error === null) {
    $apiUrl = env('VOWREWARDS_API_URL');
    if ($apiUrl !== '') {
        $ch = curl_init(rtrim($apiUrl, '/') . '/reward-events');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Bridge-Key: ' . env('VOWREWARDS_API_KEY')],
            CURLOPT_POSTFIELDS => json_encode(['event_type' => 'VR_PRACTICE_COMPLETE', 'user_id' => $userId, 'test_mode' => false]),
        ]);
        $rewardResponse = curl_exec($ch);
        $rewardStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $rewardTriggered = $rewardResponse !== false && $rewardStatus >= 200 && $rewardStatus < 300;

        if ($rewardTriggered) {
            $db->prepare('UPDATE vr_sessions SET synced_to_rewards = 1 WHERE id = ?')->execute([$sessionId]);
        }
    }
}

logIntegrationHealth($db, [
    'service_name' => 'vr',
    'endpoint' => 'qa/test-vr-callback',
    'status_code' => $error === null ? 200 : 500,
    'response_time_ms' => (int)round((microtime(true) - $start) * 1000),
    'success' => $error === null,
    'error_message' => $error,
    'triggered_by' => $payload['sub'] ?? null,
]);

if ($error !== null) {
    jsonError($error, 500);
}

jsonOk([
    'success' => true,
    'progressUpdated' => $progressUpdated,
    'rewardTriggered' => $rewardTriggered,
]);
