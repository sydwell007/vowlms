<?php
/**
 * One-off remediation for accounts hit by the silent progress-sync failure
 * markComplete() used to have (see LessonPlayer.tsx — the /api/progress POST
 * was fire-and-forget with every failure swallowed, so a learner's device
 * could show a module 100% complete while the server had recorded nothing
 * at all, with zero indication anything was wrong). Marks every real lesson
 * in one course complete for one real user (by email), then recalculates
 * enrollments.progress exactly like progress/index.php does.
 *
 * Deliberately narrow and explicit (one email + one courseSlug per call, not
 * a blanket "fix everyone") — this is a manual remediation tool for a
 * confirmed, diagnosed case, not an automatic correction applied to accounts
 * that may have a 0% module for a genuine reason (never actually enrolled,
 * never actually started it).
 *
 * POST { email, courseSlug }
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$db = getDb();
$body = getJsonBody();
$email = trim($body['email'] ?? '');
$courseSlug = trim($body['courseSlug'] ?? '');
if ($email === '' || $courseSlug === '') jsonError('email and courseSlug are required');

$userStmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$userStmt->execute([$email]);
$userId = $userStmt->fetchColumn();
if (!$userId) jsonError('No user found for that email', 404);

$courseStmt = $db->prepare('SELECT id FROM courses WHERE slug = ? LIMIT 1');
$courseStmt->execute([$courseSlug]);
$courseId = $courseStmt->fetchColumn();
if (!$courseId) jsonError('No course found for that slug', 404);

try {
    $db->beginTransaction();

    $enrolStmt = $db->prepare('SELECT id, status, completed_at FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1 FOR UPDATE');
    $enrolStmt->execute([$userId, $courseId]);
    $enrolment = $enrolStmt->fetch();
    if (!$enrolment) {
        $db->rollBack();
        jsonError('No enrolment on file for this user/course — nothing to backfill', 404);
    }

    $lessonsStmt = $db->prepare('SELECT l.id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?');
    $lessonsStmt->execute([$courseId]);
    $lessonIds = $lessonsStmt->fetchAll(PDO::FETCH_COLUMN);

    $backfilled = 0;
    foreach ($lessonIds as $lessonId) {
        $existingStmt = $db->prepare('SELECT id, completed FROM progress WHERE user_id = ? AND lesson_id = ? LIMIT 1 FOR UPDATE');
        $existingStmt->execute([$userId, $lessonId]);
        $existing = $existingStmt->fetch();

        if ($existing) {
            if (!(bool)$existing['completed']) {
                $db->prepare('UPDATE progress SET completed = 1, completed_at = NOW(), updated_at = NOW() WHERE id = ?')
                    ->execute([$existing['id']]);
                $backfilled++;
            }
        } else {
            $db->prepare(
                'INSERT INTO progress (id, user_id, lesson_id, completed, completed_at) VALUES (?, ?, ?, 1, NOW())'
            )->execute([generateId(), $userId, $lessonId]);
            $backfilled++;
        }
    }

    $totalLessons = count($lessonIds);
    $doneStmt = $db->prepare(
        'SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id = p.lesson_id JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = ? AND p.user_id = ? AND p.completed = 1'
    );
    $doneStmt->execute([$courseId, $userId]);
    $doneLessons = (int)$doneStmt->fetchColumn();

    $newProgress = $totalLessons > 0 ? min(100, max(0, (int)round(($doneLessons / $totalLessons) * 100))) : 0;
    $nowComplete = $newProgress === 100;
    $newCompletedAt = $enrolment['completed_at'] ?? ($nowComplete ? date('Y-m-d H:i:s') : null);

    $db->prepare(
        'UPDATE enrollments SET progress = ?, status = ?, completed_at = ?, updated_at = NOW() WHERE id = ?'
    )->execute([
        $newProgress,
        $nowComplete ? 'completed' : $enrolment['status'],
        $newCompletedAt,
        $enrolment['id'],
    ]);

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('backfill-lesson-progress failed: ' . $error->getMessage());
    jsonError('Backfill failed', 500);
}

jsonOk([
    'userId' => $userId,
    'courseSlug' => $courseSlug,
    'lessonsBackfilled' => $backfilled,
    'totalLessons' => $totalLessons,
    'doneLessons' => $doneLessons,
    'newProgress' => $newProgress,
]);
