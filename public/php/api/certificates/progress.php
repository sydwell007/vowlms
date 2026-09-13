<?php
/**
 * Real per-learner certificate-attainment progress for the authenticated
 * user's own account — the same three gates certificates/generate.php
 * enforces (every course's real lesson progress, Module 0 orientation, and
 * every assessment passed), expressed as one combined percentage so the
 * "Certificate of Completion" card can show a real progress bar instead of
 * a flat "locked" message with no indication of how close the learner is.
 *
 * GET ?courseSlugs=child1,child2&parentSlug=business-ethics
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$payload = requireAuth();
$userId = $payload['sub'];
$db = getDb();

$courseSlugsParam = trim($_GET['courseSlugs'] ?? '');
$parentSlug = trim($_GET['parentSlug'] ?? '');
if ($courseSlugsParam === '' || $parentSlug === '') jsonError('courseSlugs and parentSlug are required');

$courseSlugs = array_values(array_filter(array_map('trim', explode(',', $courseSlugsParam))));
if (count($courseSlugs) === 0 || count($courseSlugs) > 30) jsonError('Invalid courseSlugs');

$totalItems = 0;
$doneItems = 0;

// 1. Real lesson progress, per child course.
$placeholders = implode(',', array_fill(0, count($courseSlugs), '?'));
$courseRowsStmt = $db->prepare("SELECT id, slug FROM courses WHERE slug IN ($placeholders)");
$courseRowsStmt->execute($courseSlugs);
$courseRows = $courseRowsStmt->fetchAll();

foreach ($courseRows as $course) {
    $totalStmt = $db->prepare('SELECT COUNT(l.id) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?');
    $totalStmt->execute([$course['id']]);
    $total = (int)$totalStmt->fetchColumn();

    $doneStmt = $db->prepare(
        'SELECT COUNT(p.id) FROM progress p JOIN lessons l ON l.id = p.lesson_id JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = ? AND p.user_id = ? AND p.completed = 1'
    );
    $doneStmt->execute([$course['id'], $userId]);
    $done = min((int)$doneStmt->fetchColumn(), $total);

    $totalItems += $total;
    $doneItems += $done;
}

// 2. Module 0 orientation — always exactly 4 lessons.
$orientationStmt = $db->prepare(
    'SELECT COUNT(*) FROM course_orientation_progress WHERE user_id = ? AND course_slug = ? AND completed = 1'
);
$orientationStmt->execute([$userId, $parentSlug]);
$orientationDone = min((int)$orientationStmt->fetchColumn(), 4);
$totalItems += 4;
$doneItems += $orientationDone;

// 3. Every assessment tied to these child courses needs one passing attempt.
$courseIds = array_column($courseRows, 'id');
if (count($courseIds) > 0) {
    $idPlaceholders = implode(',', array_fill(0, count($courseIds), '?'));
    $assessStmt = $db->prepare("SELECT id FROM assessments WHERE course_id IN ($idPlaceholders)");
    $assessStmt->execute($courseIds);
    $assessmentIds = $assessStmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($assessmentIds as $assessmentId) {
        $totalItems += 1;
        $passStmt = $db->prepare('SELECT COUNT(*) FROM assessment_attempts WHERE user_id = ? AND assessment_id = ? AND passed = 1');
        $passStmt->execute([$userId, $assessmentId]);
        if ((int)$passStmt->fetchColumn() > 0) $doneItems += 1;
    }
}

$percent = $totalItems > 0 ? min(100, max(0, (int)round(($doneItems / $totalItems) * 100))) : 0;

jsonOk([
    'percent' => $percent,
    'doneItems' => $doneItems,
    'totalItems' => $totalItems,
]);
