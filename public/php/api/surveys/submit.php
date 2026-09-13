<?php
/**
 * Submits (or updates) a learner's "Rate this Module" survey response, and
 * marks that survey lesson complete in the same transaction — submitting
 * the survey IS how this lesson is completed, there's no separate "mark
 * complete" action for it like there is for a plain text/video lesson.
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

$payload = requireAuth();
$userId = $payload['sub'];
$body = getJsonBody();

$lessonSlug = trim($body['lessonSlug'] ?? '');
$rating = $body['rating'] ?? null;
$liked = is_string($body['liked'] ?? null) ? trim($body['liked']) : null;
$improve = is_string($body['improve'] ?? null) ? trim($body['improve']) : null;

if ($lessonSlug === '') jsonError('lessonSlug is required');
if (!is_int($rating) && !(is_numeric($rating) && (int)$rating == $rating)) jsonError('rating must be a whole number 1-5');
$rating = (int)$rating;
if ($rating < 1 || $rating > 5) jsonError('rating must be between 1 and 5');
if ($liked !== null && $liked === '') $liked = null;
if ($improve !== null && $improve === '') $improve = null;
if ($liked !== null && strlen($liked) > 2000) jsonError('liked feedback is too long');
if ($improve !== null && strlen($improve) > 2000) jsonError('improve feedback is too long');

$db = getDb();

$lessonStmt = $db->prepare('SELECT l.id, m.course_id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE l.slug = ? LIMIT 1');
$lessonStmt->execute([$lessonSlug]);
$lesson = $lessonStmt->fetch();
if (!$lesson) jsonError('Lesson not found', 404);

try {
    $db->beginTransaction();

    $enrolStmt = $db->prepare(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status IN ("active", "completed") LIMIT 1 FOR UPDATE'
    );
    $enrolStmt->execute([$userId, $lesson['course_id']]);
    if (!$enrolStmt->fetch()) {
        $db->rollBack();
        jsonError('An active enrolment is required', 403);
    }

    $db->prepare(
        'INSERT INTO module_survey_responses (id, user_id, lesson_id, rating, liked, improve)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE rating = VALUES(rating), liked = VALUES(liked), improve = VALUES(improve), updated_at = NOW()'
    )->execute([generateId(), $userId, $lesson['id'], $rating, $liked, $improve]);

    $existingProgressStmt = $db->prepare('SELECT id, completed FROM progress WHERE user_id = ? AND lesson_id = ? LIMIT 1 FOR UPDATE');
    $existingProgressStmt->execute([$userId, $lesson['id']]);
    $existingProgress = $existingProgressStmt->fetch();
    $wasCompleted = $existingProgress ? (bool)$existingProgress['completed'] : false;

    if ($existingProgress) {
        if (!$wasCompleted) {
            $db->prepare('UPDATE progress SET completed = 1, completed_at = NOW(), updated_at = NOW() WHERE id = ?')
                ->execute([$existingProgress['id']]);
        }
    } else {
        $db->prepare('INSERT INTO progress (id, user_id, lesson_id, completed, completed_at) VALUES (?, ?, ?, 1, NOW())')
            ->execute([generateId(), $userId, $lesson['id']]);
    }

    if (!$wasCompleted) {
        $totalStmt = $db->prepare('SELECT COUNT(l.id) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?');
        $totalStmt->execute([$lesson['course_id']]);
        $totalLessons = (int)$totalStmt->fetchColumn();

        $doneStmt = $db->prepare(
            'SELECT COUNT(p.id) FROM progress p JOIN lessons l ON l.id = p.lesson_id JOIN modules m ON m.id = l.module_id
             WHERE m.course_id = ? AND p.user_id = ? AND p.completed = 1'
        );
        $doneStmt->execute([$lesson['course_id'], $userId]);
        $doneLessons = (int)$doneStmt->fetchColumn();

        $newProgress = $totalLessons > 0 ? min(100, max(0, (int)round(($doneLessons / $totalLessons) * 100))) : 0;
        $nowComplete = $newProgress === 100;

        $db->prepare(
            'UPDATE enrollments SET progress = ?, status = IF(?, "completed", status),
             completed_at = IF(? AND completed_at IS NULL, NOW(), completed_at), updated_at = NOW()
             WHERE user_id = ? AND course_id = ?'
        )->execute([$newProgress, (int)$nowComplete, (int)$nowComplete, $userId, $lesson['course_id']]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Survey submission failed: ' . $error->getMessage());
    jsonError('Survey could not be submitted', 500);
}

jsonCreated(['lessonSlug' => $lessonSlug, 'rating' => $rating]);
