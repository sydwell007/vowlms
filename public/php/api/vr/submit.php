<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('POST');

$payload      = requireAuth();
$userId       = $payload['sub'];
$body         = getJsonBody();
$practiceSlug = trim($body['practiceSlug'] ?? '');
$score        = isset($body['score']) ? (int)$body['score'] : null;
$feedback     = $body['feedback'] ?? null;

if (!$practiceSlug) jsonError('practiceSlug is required');

$db   = getDb();
$stmt = $db->prepare('SELECT * FROM vr_practices WHERE slug = ? LIMIT 1');
$stmt->execute([$practiceSlug]);
$practice = $stmt->fetch();
if (!$practice) jsonError('VR practice not found', 404);

$finalScore = $score ?? $practice['score_placeholder'];
$attemptId  = generateId();

$db->prepare(
    'INSERT INTO vr_attempts (id, user_id, vr_practice_id, score, feedback) VALUES (?, ?, ?, ?, ?)'
)->execute([$attemptId, $userId, $practice['id'], $finalScore, $feedback]);

if ($finalScore >= 70) {
    $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
       ->execute([generateId(), $userId, 'vr_practice_pass', 75]);
}

jsonCreated([
    'vrAttemptId'  => $attemptId,
    'practiceSlug' => $practiceSlug,
    'score'        => $finalScore,
    'passed'       => $finalScore >= 70,
]);
