<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('GET');

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

// Learner name
$uStmt = $db->prepare('SELECT name, email, city FROM users WHERE id = ? LIMIT 1');
$uStmt->execute([$userId]);
$user = $uStmt->fetch();

// Active enrollments
$enrStmt = $db->prepare(
    'SELECT e.id, e.progress, e.status, e.enrolled_at,
            c.slug AS course_slug, c.title AS course_title,
            c.description, c.level, a.name AS academy_name
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     JOIN academies a ON a.id = c.academy_id
     WHERE e.user_id = ?
     ORDER BY e.enrolled_at DESC LIMIT 10'
);
$enrStmt->execute([$userId]);
$enrollments = $enrStmt->fetchAll();

// Certificates
$certStmt = $db->prepare(
    'SELECT cert.certificate_id, cert.course_name, cert.issued_at,
            c.slug AS course_slug
     FROM certificates cert JOIN courses c ON c.id = cert.course_id
     WHERE cert.user_id = ? ORDER BY cert.issued_at DESC LIMIT 5'
);
$certStmt->execute([$userId]);
$certificates = $certStmt->fetchAll();

// Reward balance
$rewStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$rewStmt->execute([$userId]);
$rewardPoints = (int)$rewStmt->fetchColumn();

// Upcoming calendar events
$calStmt = $db->prepare(
    'SELECT title, type, start_at, join_url FROM calendar_events
     WHERE start_at >= NOW() ORDER BY start_at ASC LIMIT 5'
);
$calStmt->execute();
$events = $calStmt->fetchAll();

// Counts
$totalEnrolled  = count($enrollments);
$totalCompleted = count(array_filter($enrollments, fn($e) => $e['status'] === 'completed'));

jsonOk([
    'learner'      => $user['name'] ?? 'Learner',
    'email'        => $user['email'] ?? '',
    'city'         => $user['city'] ?? '',
    'metrics'      => [
        ['label' => 'Courses enrolled',  'value' => (string)$totalEnrolled],
        ['label' => 'Completed',          'value' => (string)$totalCompleted],
        ['label' => 'Certificates',       'value' => (string)count($certificates)],
        ['label' => 'Reward points',      'value' => number_format($rewardPoints) . ' pts'],
    ],
    'enrolledCourses' => $enrollments,
    'certificates'    => $certificates,
    'upcomingEvents'  => $events,
    'rewardPoints'    => $rewardPoints,
]);
