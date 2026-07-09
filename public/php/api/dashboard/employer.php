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
requireRole($payload, 'employer', 'admin');

$employerId = $payload['sub'];
$db = getDb();

// Employer details
$uStmt = $db->prepare('SELECT name, email, company FROM users WHERE id = ? LIMIT 1');
$uStmt->execute([$employerId]);
$employer = $uStmt->fetch();

// Opportunities posted by this employer
$oppStmt = $db->prepare(
    'SELECT * FROM opportunities WHERE posted_by = ? ORDER BY created_at DESC'
);
$oppStmt->execute([$employerId]);
$opportunities = $oppStmt->fetchAll();

// Platform-wide talent pool: learners with at least one certificate
$talentStmt = $db->query(
    'SELECT u.id, u.name, u.email, u.city,
            COUNT(DISTINCT cert.id) AS certificate_count,
            COALESCE(SUM(re.points),0) AS reward_points
     FROM users u
     JOIN certificates cert ON cert.user_id = u.id
     LEFT JOIN reward_events re ON re.user_id = u.id
     WHERE u.role = "learner" AND u.is_active = 1
     GROUP BY u.id
     ORDER BY certificate_count DESC, reward_points DESC
     LIMIT 20'
);
$talent = $talentStmt->fetchAll();

// Recent VR assessment high-scorers
$vrStmt = $db->query(
    'SELECT u.name, u.email, u.city, vr.score, vr.attempted_at, c.title AS course_title
     FROM vr_attempts vr
     JOIN users u ON u.id = vr.user_id
     JOIN vr_practices vp ON vp.id = vr.vr_practice_id
     JOIN courses c ON c.id = vp.course_id
     WHERE vr.score >= 80
     ORDER BY vr.attempted_at DESC LIMIT 10'
);
$vrHighScorers = $vrStmt->fetchAll();

// Upcoming events
$calStmt = $db->prepare(
    'SELECT title, type, start_at, join_url FROM calendar_events
     WHERE start_at >= NOW() ORDER BY start_at ASC LIMIT 5'
);
$calStmt->execute();
$events = $calStmt->fetchAll();

$totalOpps   = count($opportunities);
$activeOpps  = count(array_filter($opportunities, fn($o) => (bool)$o['is_active']));

jsonOk([
    'employer'       => $employer['name'] ?? 'Employer',
    'email'          => $employer['email'] ?? '',
    'company'        => $employer['company'] ?? '',
    'metrics'        => [
        ['label' => 'Opportunities posted', 'value' => (string)$totalOpps],
        ['label' => 'Active listings',      'value' => (string)$activeOpps],
        ['label' => 'Talent pool size',     'value' => (string)count($talent)],
        ['label' => 'VR high-scorers',      'value' => (string)count($vrHighScorers)],
    ],
    'opportunities'  => $opportunities,
    'talent'         => $talent,
    'vrHighScorers'  => $vrHighScorers,
    'upcomingEvents' => $events,
]);
