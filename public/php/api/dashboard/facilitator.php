<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('GET');

$payload = requireAuth();
requireRole($payload, 'facilitator', 'admin');

$facilitatorId = $payload['sub'];
$db = getDb();

// Facilitator details
$uStmt = $db->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
$uStmt->execute([$facilitatorId]);
$facilitator = $uStmt->fetch();

// Courses managed by this facilitator
$coursesStmt = $db->prepare(
    'SELECT c.id, c.slug, c.title, c.level, c.status, c.is_free,
            a.name AS academy_name,
            COUNT(DISTINCT e.id) AS total_enrolments,
            AVG(e.progress) AS avg_progress
     FROM courses c
     JOIN academies a ON a.id = c.academy_id
     LEFT JOIN enrollments e ON e.course_id = c.id
     WHERE c.facilitator_id = ?
     GROUP BY c.id
     ORDER BY c.created_at DESC'
);
$coursesStmt->execute([$facilitatorId]);
$courses = $coursesStmt->fetchAll();

// Total unique learners across all facilitated courses
$learnerCountStmt = $db->prepare(
    'SELECT COUNT(DISTINCT e.user_id) AS cnt
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE c.facilitator_id = ?'
);
$learnerCountStmt->execute([$facilitatorId]);
$totalLearners = (int)$learnerCountStmt->fetchColumn();

// Assessments recently submitted in facilitator's courses
$assessStmt = $db->prepare(
    'SELECT aa.id, aa.user_id, u.name AS learner_name, aa.score, aa.passed, aa.submitted_at,
            a.title AS assessment_title, c.title AS course_title
     FROM assessment_attempts aa
     JOIN assessments a ON a.id = aa.assessment_id
     JOIN courses c ON c.id = a.course_id
     JOIN users u ON u.id = aa.user_id
     WHERE c.facilitator_id = ?
     ORDER BY aa.submitted_at DESC LIMIT 20'
);
$assessStmt->execute([$facilitatorId]);
$recentAttempts = $assessStmt->fetchAll();

// Upcoming calendar events
$calStmt = $db->prepare(
    'SELECT title, type, start_at, join_url FROM calendar_events
     WHERE start_at >= NOW() ORDER BY start_at ASC LIMIT 5'
);
$calStmt->execute();
$events = $calStmt->fetchAll();

$totalEnrolled  = array_sum(array_column($courses, 'total_enrolments'));
$totalCompleted = 0;
foreach ($courses as $c) {
    $compStmt = $db->prepare(
        'SELECT COUNT(*) FROM enrollments WHERE course_id = ? AND status = "completed"'
    );
    $compStmt->execute([$c['id']]);
    $totalCompleted += (int)$compStmt->fetchColumn();
}

jsonOk([
    'facilitator'    => $facilitator['name'] ?? 'Facilitator',
    'email'          => $facilitator['email'] ?? '',
    'metrics'        => [
        ['label' => 'My courses',       'value' => (string)count($courses)],
        ['label' => 'Total learners',   'value' => (string)$totalLearners],
        ['label' => 'Total enrolments', 'value' => (string)$totalEnrolled],
        ['label' => 'Completions',      'value' => (string)$totalCompleted],
    ],
    'courses'        => $courses,
    'recentAttempts' => $recentAttempts,
    'upcomingEvents' => $events,
]);
