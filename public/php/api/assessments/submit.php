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

/**
 * Mirrors AssessmentPlayer.tsx's isAnswerCorrect() exactly — matching/ordering
 * answers arrive as JSON-encoded strings (the same shape the client submits),
 * fill-blank accepts any of `acceptableAnswers` too. Before this, every
 * question type was scored with plain `===`, which silently failed every
 * matching/ordering question (no `answer` field to match against) and
 * ignored acceptableAnswers on fill-blank.
 */
function isAssessmentAnswerCorrect(array $question, ?string $submitted): bool {
    if ($submitted === null || $submitted === '') return false;
    $type = $question['type'] ?? 'multiple-choice';

    switch ($type) {
        case 'fill-blank':
            $normalize = fn(string $s) => preg_replace('/\s+/', ' ', strtolower(trim($s)));
            $accepted = array_map($normalize, array_filter(array_merge(
                [$question['answer'] ?? ''],
                $question['acceptableAnswers'] ?? []
            )));
            return in_array($normalize($submitted), $accepted, true);

        case 'matching': {
            $picked = json_decode($submitted, true);
            $pairs = $question['pairs'] ?? null;
            if (!is_array($picked) || !is_array($pairs)) return false;
            foreach ($pairs as $i => $pair) {
                if (($picked[(string)$i] ?? null) !== ($pair['right'] ?? null)) return false;
            }
            return true;
        }

        case 'ordering': {
            $order = json_decode($submitted, true);
            $items = $question['items'] ?? null;
            if (!is_array($order) || !is_array($items) || count($order) !== count($items)) return false;
            foreach ($order as $i => $value) {
                if ($value !== $items[$i]) return false;
            }
            return true;
        }

        case 'true-false':
        case 'scenario':
        case 'multiple-choice':
        default:
            return array_key_exists('answer', $question) && $submitted === $question['answer'];
    }
}

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
    if (is_string($submitted) && isAssessmentAnswerCorrect($question, $submitted)) $correct++;
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
