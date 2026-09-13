<?php
/**
 * One-time corrective re-score of every existing `assessment_attempts` row
 * using the current, correct per-type scoring logic (lib/assessment_scoring.php).
 *
 * An earlier version of that logic did plain `$submitted === $question['answer']`
 * for every question type, which could never score a matching/ordering
 * question correct at all (those types have no plain `answer` field — see
 * assessment_scoring.php). Real assessments (see public/sql/028) have 2
 * matching/ordering questions out of 8, capping any attempt scored under the
 * old logic at 75% — below every course's 80% pass mark. Any real learner
 * who took an assessment before that fix shipped is left with a permanently
 * "failed" attempt on file, which silently blocks certificate issuance
 * forever (generate.php requires a passing attempt per assessment) with no
 * action available to them — retaking the same assessment with the exact
 * same correct answers would now score 100%, but nothing prompts them to.
 *
 * This re-scores every stored attempt's `answers` against its assessment's
 * real `questions` and updates `score`/`passed` if — and only if — the
 * recomputed result differs from what's on file. Never touches attempts that
 * were already scored correctly. Also awards the "assessment_pass" reward
 * for any attempt that flips from failed to passed for the first time,
 * matching what submit.php would have done had it scored correctly the
 * first time — an attempt that was already passed is left alone (no
 * double-award).
 *
 * Bridge-key gated only (no per-user auth) — this is an idempotent
 * maintenance operation across all users, not a user-facing endpoint. Safe
 * to re-run: recomputing an already-correct row is a no-op.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/assessment_scoring.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$db = getDb();

$attemptsStmt = $db->query(
    'SELECT aa.id, aa.user_id, aa.assessment_id, aa.score, aa.passed, aa.answers,
            a.questions, a.pass_mark
     FROM assessment_attempts aa
     JOIN assessments a ON a.id = aa.assessment_id'
);
$attempts = $attemptsStmt->fetchAll();

$checked = 0;
$updated = 0;
$flippedToPassed = 0;
$errors = [];

foreach ($attempts as $attempt) {
    $checked++;
    $questions = json_decode($attempt['questions'] ?? '[]', true);
    $answers = json_decode($attempt['answers'] ?? '{}', true);
    if (!is_array($questions) || count($questions) === 0 || !is_array($answers)) {
        $errors[] = ['attemptId' => $attempt['id'], 'reason' => 'unparseable questions/answers'];
        continue;
    }

    $result = scoreAssessmentAnswers($questions, $answers);
    $passMark = min(100, max(0, (int)$attempt['pass_mark']));
    $newPassed = $result['score'] >= $passMark;
    $oldPassed = (bool)$attempt['passed'];

    if ($result['score'] === (int)$attempt['score'] && $newPassed === $oldPassed) {
        continue;
    }

    try {
        $db->beginTransaction();

        $db->prepare('UPDATE assessment_attempts SET score = ?, passed = ? WHERE id = ?')
            ->execute([$result['score'], (int)$newPassed, $attempt['id']]);

        if ($newPassed && !$oldPassed) {
            $previousPassStmt = $db->prepare(
                'SELECT id FROM assessment_attempts
                 WHERE user_id = ? AND assessment_id = ? AND passed = 1 AND id != ? LIMIT 1'
            );
            $previousPassStmt->execute([$attempt['user_id'], $attempt['assessment_id'], $attempt['id']]);
            $alreadyHadAPass = (bool)$previousPassStmt->fetchColumn();

            if (!$alreadyHadAPass) {
                $db->prepare(
                    'INSERT INTO reward_events (id, user_id, event, points, metadata)
                     VALUES (?, ?, ?, ?, ?)'
                )->execute([
                    generateId(),
                    $attempt['user_id'],
                    'assessment_pass',
                    100,
                    json_encode(['assessment_id' => $attempt['assessment_id'], 'source' => 'rescore']),
                ]);
            }
            $flippedToPassed++;
        }

        $db->commit();
        $updated++;
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        $errors[] = ['attemptId' => $attempt['id'], 'reason' => $error->getMessage()];
    }
}

jsonOk([
    'checked' => $checked,
    'updated' => $updated,
    'flippedToPassed' => $flippedToPassed,
    'errors' => $errors,
]);
