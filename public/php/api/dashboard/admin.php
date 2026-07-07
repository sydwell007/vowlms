<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('GET');

$payload = requireAuth();
requireRole($payload, 'admin');

$db = getDb();

// Platform totals
$totals = [
    'users'       => (int)$db->query('SELECT COUNT(*) FROM users WHERE is_active = 1')->fetchColumn(),
    'courses'     => (int)$db->query('SELECT COUNT(*) FROM courses WHERE status = "published"')->fetchColumn(),
    'enrollments' => (int)$db->query('SELECT COUNT(*) FROM enrollments')->fetchColumn(),
    'certificates'=> (int)$db->query('SELECT COUNT(*) FROM certificates')->fetchColumn(),
    'revenue'     => (float)$db->query('SELECT COALESCE(SUM(amount),0) FROM payments WHERE status = "paid"')->fetchColumn(),
];

// Role breakdown
$roleStmt = $db->query('SELECT role, COUNT(*) AS cnt FROM users GROUP BY role');
$roles    = array_column($roleStmt->fetchAll(), 'cnt', 'role');

// Recent signups
$recentStmt = $db->query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10'
);
$recentUsers = $recentStmt->fetchAll();

// Top 5 courses by enrollment
$topCourses = $db->query(
    'SELECT c.title, c.slug, COUNT(e.id) AS enrolment_count
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     GROUP BY c.id ORDER BY enrolment_count DESC LIMIT 5'
)->fetchAll();

// Academy breakdown
$academyStats = $db->query(
    'SELECT a.name, COUNT(c.id) AS course_count,
            SUM((SELECT COUNT(*) FROM enrollments WHERE course_id = c.id)) AS total_enrolments
     FROM academies a LEFT JOIN courses c ON c.academy_id = a.id AND c.status = "published"
     GROUP BY a.id ORDER BY total_enrolments DESC'
)->fetchAll();

// Monthly revenue (last 6 months)
$revStmt = $db->query(
    'SELECT DATE_FORMAT(created_at, "%Y-%m") AS month,
            COALESCE(SUM(amount),0) AS revenue
     FROM payments WHERE status = "paid" AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
     GROUP BY month ORDER BY month ASC'
);
$monthlyRevenue = $revStmt->fetchAll();

jsonOk([
    'totals'         => $totals,
    'roleCounts'     => $roles,
    'recentUsers'    => $recentUsers,
    'topCourses'     => $topCourses,
    'academyStats'   => $academyStats,
    'monthlyRevenue' => $monthlyRevenue,
]);
