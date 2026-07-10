<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

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
if ($score === null || $score < 0 || $score > 100) jsonError('score must be between 0 and 100');

$db   = getDb();
$stmt = $db->prepare('SELECT * FROM vr_practices WHERE slug = ? LIMIT 1');
$stmt->execute([$practiceSlug]);
$practice = $stmt->fetch();
if (!$practice) jsonError('VR practice not found', 404);

$enrolment = $db->prepare(
    'SELECT id FROM enrollments
     WHERE user_id = ? AND course_id = ? AND status IN ("active", "completed") LIMIT 1'
);
$enrolment->execute([$userId, $practice['course_id']]);
if (!$enrolment->fetch()) jsonError('An active enrolment is required', 403);

$finalScore = $score;
$attemptId  = generateId();

$db->prepare(
    'INSERT INTO vr_attempts (id, user_id, vr_practice_id, score, feedback) VALUES (?, ?, ?, ?, ?)'
)->execute([$attemptId, $userId, $practice['id'], $finalScore, $feedback]);

jsonCreated([
    'vrAttemptId'  => $attemptId,
    'practiceSlug' => $practiceSlug,
    'score'        => $finalScore,
    'passed'       => $finalScore >= 70,
    'rewarded'     => false,
]);
