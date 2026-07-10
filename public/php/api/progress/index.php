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
$lessonSlug = trim($body['lessonSlug'] ?? '');
$completed = array_key_exists('completed', $body) ? (bool)$body['completed'] : true;

if ($lessonSlug === '') jsonError('lessonSlug is required');

$db = getDb();
$lessonStmt = $db->prepare(
    'SELECT l.id, m.course_id
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     WHERE l.slug = ? LIMIT 1'
);
$lessonStmt->execute([$lessonSlug]);
$lesson = $lessonStmt->fetch();
if (!$lesson) jsonError('Lesson not found', 404);

try {
    $db->beginTransaction();

    // Lock the learner-course row so repeated completion requests are serialised.
    $enrolmentStmt = $db->prepare(
        'SELECT id, status FROM enrollments
         WHERE user_id = ? AND course_id = ? LIMIT 1 FOR UPDATE'
    );
    $enrolmentStmt->execute([$userId, $lesson['course_id']]);
    $enrolment = $enrolmentStmt->fetch();
    if (!$enrolment || !in_array($enrolment['status'], ['active', 'completed'], true)) {
        $db->rollBack();
        jsonError('An active enrolment is required', 403);
    }

    $existingStmt = $db->prepare(
        'SELECT id, completed FROM progress WHERE user_id = ? AND lesson_id = ? LIMIT 1 FOR UPDATE'
    );
    $existingStmt->execute([$userId, $lesson['id']]);
    $existing = $existingStmt->fetch();
    $wasCompleted = $existing ? (bool)$existing['completed'] : false;
    $completedAt = $completed ? date('Y-m-d H:i:s') : null;

    if ($existing) {
        $db->prepare(
            'UPDATE progress SET completed = ?, completed_at = ?, updated_at = NOW() WHERE id = ?'
        )->execute([(int)$completed, $completedAt, $existing['id']]);
    } else {
        $db->prepare(
            'INSERT INTO progress (id, user_id, lesson_id, completed, completed_at)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([generateId(), $userId, $lesson['id'], (int)$completed, $completedAt]);
    }

    $totalStmt = $db->prepare(
        'SELECT COUNT(l.id) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?'
    );
    $totalStmt->execute([$lesson['course_id']]);
    $totalLessons = (int)$totalStmt->fetchColumn();

    $doneStmt = $db->prepare(
        'SELECT COUNT(p.id)
         FROM progress p
         JOIN lessons l ON l.id = p.lesson_id
         JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = ? AND p.user_id = ? AND p.completed = 1'
    );
    $doneStmt->execute([$lesson['course_id'], $userId]);
    $doneLessons = (int)$doneStmt->fetchColumn();

    $enrolmentProgress = $totalLessons > 0
        ? min(100, max(0, (int)round(($doneLessons / $totalLessons) * 100)))
        : 0;
    $courseComplete = $enrolmentProgress === 100;

    $db->prepare(
        'UPDATE enrollments SET progress = ?, status = ?, completed_at = ?, updated_at = NOW()
         WHERE id = ?'
    )->execute([
        $enrolmentProgress,
        $courseComplete ? 'completed' : 'active',
        $courseComplete ? date('Y-m-d H:i:s') : null,
        $enrolment['id'],
    ]);

    if ($completed && !$wasCompleted) {
        $db->prepare(
            'INSERT INTO reward_events (id, user_id, event, points, metadata)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([
            generateId(),
            $userId,
            'lesson_complete',
            5,
            json_encode(['lesson_id' => $lesson['id']]),
        ]);
    }

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Progress update failed: ' . $error->getMessage());
    jsonError('Progress could not be updated', 500);
}

jsonCreated([
    'lessonSlug' => $lessonSlug,
    'completed' => $completed,
    'enrollmentProgress' => $enrolmentProgress,
    'courseComplete' => $courseComplete,
]);
