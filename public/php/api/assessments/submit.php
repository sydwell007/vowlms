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

$payload        = requireAuth();
$userId         = $payload['sub'];
$body           = getJsonBody();
$assessmentSlug = trim($body['assessmentSlug'] ?? '');
$answers        = $body['answers'] ?? [];

if (!$assessmentSlug) jsonError('assessmentSlug is required');

$db   = getDb();
$stmt = $db->prepare('SELECT * FROM assessments WHERE slug = ? LIMIT 1');
$stmt->execute([$assessmentSlug]);
$assessment = $stmt->fetch();
if (!$assessment) jsonError('Assessment not found', 404);

$questions = json_decode($assessment['questions'] ?? '[]', true);
$passMark  = (int)$assessment['pass_mark'];

// Score: count correct answers
$total   = count($questions);
$correct = 0;
foreach ($questions as $q) {
    $qId       = $q['id'] ?? '';
    $submitted = $answers[$qId] ?? null;
    if ($submitted !== null && $submitted === ($q['answer'] ?? null)) {
        $correct++;
    }
}
$score  = $total > 0 ? (int)round(($correct / $total) * 100) : 0;
$passed = $score >= $passMark;

$attemptId = generateId();
$db->prepare(
    'INSERT INTO assessment_attempts (id, user_id, assessment_id, score, passed, answers)
     VALUES (?, ?, ?, ?, ?, ?)'
)->execute([$attemptId, $userId, $assessment['id'], $score, (int)$passed, json_encode($answers)]);

if ($passed) {
    $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
       ->execute([generateId(), $userId, 'assessment_pass', 100]);
}

jsonCreated([
    'attemptId'      => $attemptId,
    'assessmentSlug' => $assessmentSlug,
    'score'          => $score,
    'passed'         => $passed,
    'passMark'       => $passMark,
    'correct'        => $correct,
    'total'          => $total,
]);
