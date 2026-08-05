<?php
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
$userId  = $payload['sub'];
$db      = getDb();

$attemptsStmt = $db->prepare(
    'SELECT aa.id, aa.score, aa.passed, aa.attempted_at,
            a.title AS assessment_title, a.pass_mark,
            c.slug AS course_slug, c.title AS course_title
     FROM assessment_attempts aa
     JOIN assessments a ON a.id = aa.assessment_id
     JOIN courses c ON c.id = a.course_id
     WHERE aa.user_id = ?
     ORDER BY aa.attempted_at DESC'
);
$attemptsStmt->execute([$userId]);
$attempts = $attemptsStmt->fetchAll();

$totalAttempts = count($attempts);
$passedAttempts = count(array_filter($attempts, fn($a) => (int)$a['passed'] === 1));
$averageScore = $totalAttempts > 0
    ? (int)round(array_sum(array_column($attempts, 'score')) / $totalAttempts)
    : 0;
$passRate = $totalAttempts > 0 ? (int)round(($passedAttempts / $totalAttempts) * 100) : 0;

$certStmt = $db->prepare('SELECT COUNT(*) FROM certificates WHERE user_id = ?');
$certStmt->execute([$userId]);
$completedCourses = (int)$certStmt->fetchColumn();

jsonOk([
    'attempts' => $attempts,
    'summary' => [
        'totalAttempts'    => $totalAttempts,
        'averageScore'     => $averageScore,
        'passRate'         => $passRate,
        'completedCourses' => $completedCourses,
    ],
]);
