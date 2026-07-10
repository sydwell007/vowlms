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

// Learner-level records require an explicit organisation assignment and
// consent model. Until those tables are deployed, no platform-wide learner
// identity, email, certificate, or score data is exposed to employers.
$talent = [];
$vrHighScorers = [];

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
        ['label' => 'Assigned learners',    'value' => 'Restricted'],
        ['label' => 'Skills evidence',      'value' => 'Restricted'],
    ],
    'opportunities'  => $opportunities,
    'talent'         => $talent,
    'vrHighScorers'  => $vrHighScorers,
    'upcomingEvents' => $events,
]);
