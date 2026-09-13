<?php
/**
 * Read-only diagnostic — reports exactly what certificates/generate.php
 * checks for one real learner + course grouping, by email, so a reported
 * "certificate won't unlock" case can be root-caused directly against real
 * account data instead of guessed at. Never mutates anything.
 *
 * GET ?email=...&courseSlugs=slug1,slug2&anchorSlug=slug2
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

$db = getDb();

$email = trim($_GET['email'] ?? '');
$courseSlugsParam = trim($_GET['courseSlugs'] ?? '');
$anchorSlug = trim($_GET['anchorSlug'] ?? '');
$parentSlug = trim($_GET['parentSlug'] ?? '');
if ($email === '' || $courseSlugsParam === '') jsonError('email and courseSlugs are required');
$courseSlugs = array_filter(array_map('trim', explode(',', $courseSlugsParam)));
if ($anchorSlug === '') $anchorSlug = end($courseSlugs);
if ($parentSlug === '') $parentSlug = $anchorSlug;

$userStmt = $db->prepare('SELECT id, email, name FROM users WHERE email = ? LIMIT 1');
$userStmt->execute([$email]);
$user = $userStmt->fetch();
if (!$user) jsonError('No user found for that email', 404);
$userId = $user['id'];

$report = ['user' => ['id' => $userId, 'email' => $user['email'], 'name' => $user['name']], 'courses' => []];

$placeholders = implode(',', array_fill(0, count($courseSlugs), '?'));
$courseStmt = $db->prepare("SELECT id, slug, title FROM courses WHERE slug IN ($placeholders)");
$courseStmt->execute($courseSlugs);
$courses = $courseStmt->fetchAll();

foreach ($courses as $course) {
    $courseId = $course['id'];

    $enrolStmt = $db->prepare('SELECT status, progress, completed_at FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1');
    $enrolStmt->execute([$userId, $courseId]);
    $enrolment = $enrolStmt->fetch();

    $totalLessonsStmt = $db->prepare('SELECT COUNT(l.id) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?');
    $totalLessonsStmt->execute([$courseId]);
    $totalLessons = (int)$totalLessonsStmt->fetchColumn();

    $doneLessonsStmt = $db->prepare(
        'SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id = p.lesson_id JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = ? AND p.user_id = ? AND p.completed = 1'
    );
    $doneLessonsStmt->execute([$courseId, $userId]);
    $doneLessons = (int)$doneLessonsStmt->fetchColumn();

    $assessStmt = $db->prepare('SELECT id, slug, title, pass_mark FROM assessments WHERE course_id = ?');
    $assessStmt->execute([$courseId]);
    $assessments = $assessStmt->fetchAll();

    $assessmentReport = [];
    foreach ($assessments as $assessment) {
        $attemptStmt = $db->prepare(
            'SELECT score, passed, attempted_at FROM assessment_attempts WHERE user_id = ? AND assessment_id = ? ORDER BY attempted_at DESC'
        );
        $attemptStmt->execute([$userId, $assessment['id']]);
        $attempts = $attemptStmt->fetchAll();
        $assessmentReport[] = [
            'slug' => $assessment['slug'],
            'title' => $assessment['title'],
            'passMark' => (int)$assessment['pass_mark'],
            'attempts' => $attempts,
            'hasPassingAttempt' => count(array_filter($attempts, fn($a) => (int)$a['passed'] === 1)) > 0,
        ];
    }

    $report['courses'][] = [
        'slug' => $course['slug'],
        'title' => $course['title'],
        'enrollment' => $enrolment ?: null,
        'realTotalLessons' => $totalLessons,
        'realDoneLessons' => $doneLessons,
        'assessments' => $assessmentReport,
    ];
}

$orientationStmt = $db->prepare(
    'SELECT lesson_slug, completed, completed_at FROM course_orientation_progress WHERE user_id = ? AND course_slug = ?'
);
$orientationStmt->execute([$userId, $parentSlug]);
$report['orientationForParentSlug'] = ['parentSlug' => $parentSlug, 'rows' => $orientationStmt->fetchAll()];

$certStmt = $db->prepare(
    'SELECT cert.* FROM certificates cert JOIN courses c ON c.id = cert.course_id WHERE cert.user_id = ? AND c.slug = ?'
);
$certStmt->execute([$userId, $anchorSlug]);
$report['existingCertificateForAnchor'] = $certStmt->fetch() ?: null;

jsonOk($report);
