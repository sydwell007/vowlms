<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('POST');

$payload    = requireAuth();
$userId     = $payload['sub'];
$body       = getJsonBody();
$lessonSlug = trim($body['lessonSlug'] ?? '');
$completed  = (bool)($body['completed'] ?? true);

if (!$lessonSlug) jsonError('lessonSlug is required');

$db = getDb();

// Find lesson
$les = $db->prepare('SELECT l.id, l.module_id FROM lessons l WHERE l.slug = ? LIMIT 1');
$les->execute([$lessonSlug]);
$lesson = $les->fetch();
if (!$lesson) jsonError('Lesson not found', 404);

// Upsert progress
$progId = generateId();
$db->prepare(
    'INSERT INTO progress (id, user_id, lesson_id, completed, completed_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE completed = VALUES(completed), completed_at = VALUES(completed_at)'
)->execute([$progId, $userId, $lesson['id'], (int)$completed, $completed ? date('Y-m-d H:i:s') : null]);

// Recalculate enrollment progress
$courseQuery = $db->prepare(
    'SELECT c.id AS course_id
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     JOIN courses c ON c.id = m.course_id
     WHERE l.id = ? LIMIT 1'
);
$courseQuery->execute([$lesson['id']]);
$courseRow = $courseQuery->fetch();

$enrollmentProgress = 0;
$courseComplete     = false;

if ($courseRow) {
    $courseId = $courseRow['course_id'];

    $totStmt = $db->prepare(
        'SELECT COUNT(l.id) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?'
    );
    $totStmt->execute([$courseId]);
    $totalLessons = (int)$totStmt->fetchColumn();

    if ($totalLessons > 0) {
        $doneStmt = $db->prepare(
            'SELECT COUNT(p.id) FROM progress p
             JOIN lessons l ON l.id = p.lesson_id
             JOIN modules m ON m.id = l.module_id
             WHERE m.course_id = ? AND p.user_id = ? AND p.completed = 1'
        );
        $doneStmt->execute([$courseId, $userId]);
        $doneLessons = (int)$doneStmt->fetchColumn();

        $enrollmentProgress = (int)round(($doneLessons / $totalLessons) * 100);
        $courseComplete     = $enrollmentProgress >= 100;
    }

    // Update enrollment
    $db->prepare(
        'UPDATE enrollments SET progress = ?, status = ?, completed_at = ?
         WHERE user_id = ? AND course_id = ?'
    )->execute([
        $enrollmentProgress,
        $courseComplete ? 'completed' : 'active',
        $courseComplete ? date('Y-m-d H:i:s') : null,
        $userId,
        $courseId,
    ]);

    // Award +5 pts per completed lesson
    if ($completed) {
        $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
           ->execute([generateId(), $userId, 'lesson_complete', 5]);
    }
}

jsonCreated([
    'lessonSlug'         => $lessonSlug,
    'completed'          => $completed,
    'enrollmentProgress' => $enrollmentProgress,
    'courseComplete'     => $courseComplete,
]);
