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

$payload = requireAuth();
$userId = $payload['sub'];
$body = getJsonBody();
$assessmentSlug = trim($body['assessmentSlug'] ?? '');
$answers = $body['answers'] ?? null;

if ($assessmentSlug === '') jsonError('assessmentSlug is required');
if (!is_array($answers)) jsonError('answers must be an object');

$db = getDb();
$assessmentStmt = $db->prepare('SELECT * FROM assessments WHERE slug = ? LIMIT 1');
$assessmentStmt->execute([$assessmentSlug]);
$assessment = $assessmentStmt->fetch();
if (!$assessment) jsonError('Assessment not found', 404);

$questions = json_decode($assessment['questions'] ?? '[]', true);
if (!is_array($questions) || count($questions) === 0) {
    jsonError('Assessment is not configured', 503);
}

$passMark = min(100, max(0, (int)$assessment['pass_mark']));
$correct = 0;
foreach ($questions as $question) {
    $questionId = $question['id'] ?? '';
    $submitted = $answers[$questionId] ?? null;
    if ($submitted !== null && $submitted === ($question['answer'] ?? null)) $correct++;
}

$total = count($questions);
$score = min(100, max(0, (int)round(($correct / $total) * 100)));
$passed = $score >= $passMark;

try {
    $db->beginTransaction();

    $enrolmentStmt = $db->prepare(
        'SELECT id FROM enrollments
         WHERE user_id = ? AND course_id = ? AND status IN ("active", "completed")
         LIMIT 1 FOR UPDATE'
    );
    $enrolmentStmt->execute([$userId, $assessment['course_id']]);
    if (!$enrolmentStmt->fetch()) {
        $db->rollBack();
        jsonError('An active enrolment is required', 403);
    }

    $previousPassStmt = $db->prepare(
        'SELECT id FROM assessment_attempts
         WHERE user_id = ? AND assessment_id = ? AND passed = 1 LIMIT 1'
    );
    $previousPassStmt->execute([$userId, $assessment['id']]);
    $previouslyPassed = (bool)$previousPassStmt->fetchColumn();

    $attemptId = generateId();
    $db->prepare(
        'INSERT INTO assessment_attempts (id, user_id, assessment_id, score, passed, answers)
         VALUES (?, ?, ?, ?, ?, ?)'
    )->execute([
        $attemptId,
        $userId,
        $assessment['id'],
        $score,
        (int)$passed,
        json_encode($answers),
    ]);

    if ($passed && !$previouslyPassed) {
        $db->prepare(
            'INSERT INTO reward_events (id, user_id, event, points, metadata)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([
            generateId(),
            $userId,
            'assessment_pass',
            100,
            json_encode(['assessment_id' => $assessment['id']]),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Assessment submission failed: ' . $error->getMessage());
    jsonError('Assessment could not be submitted', 500);
}

jsonCreated([
    'attemptId' => $attemptId,
    'assessmentSlug' => $assessmentSlug,
    'score' => $score,
    'passed' => $passed,
    'passMark' => $passMark,
    'correct' => $correct,
    'total' => $total,
]);
