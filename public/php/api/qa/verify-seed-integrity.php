<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/lib/health-log.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$start = microtime(true);
$db = null;
$error = null;
$report = [
    'course_counts_by_academy' => [],
    'orphaned_courses' => 0,
    'empty_courses' => 0,
    'courses_without_modules' => 0,
    'duplicate_courses' => [],
];

try {
    $db = getDb();

    $countsStmt = $db->query(
        'SELECT a.name AS academy, a.slug AS academy_slug, COUNT(c.id) AS course_count
         FROM academies a
         LEFT JOIN courses c ON c.academy_id = a.id
         GROUP BY a.id, a.name, a.slug
         ORDER BY course_count DESC'
    );
    $report['course_counts_by_academy'] = $countsStmt->fetchAll();

    $orphanStmt = $db->query(
        'SELECT COUNT(*) FROM courses c LEFT JOIN academies a ON c.academy_id = a.id WHERE a.id IS NULL'
    );
    $report['orphaned_courses'] = (int)$orphanStmt->fetchColumn();

    $emptyStmt = $db->query(
        "SELECT COUNT(*) FROM courses WHERE title IS NULL OR title = '' OR description IS NULL OR description = ''"
    );
    $report['empty_courses'] = (int)$emptyStmt->fetchColumn();

    $noModulesStmt = $db->query(
        'SELECT COUNT(*) FROM courses c LEFT JOIN modules m ON m.course_id = c.id WHERE m.id IS NULL'
    );
    $report['courses_without_modules'] = (int)$noModulesStmt->fetchColumn();

    $dupeStmt = $db->query(
        'SELECT c.title, a.name AS academy, COUNT(*) AS dupes
         FROM courses c
         JOIN academies a ON a.id = c.academy_id
         GROUP BY c.title, a.id, a.name
         HAVING COUNT(*) > 1'
    );
    $report['duplicate_courses'] = $dupeStmt->fetchAll();
} catch (Throwable $e) {
    $error = $e->getMessage();
}

$overallStatus = $error === null
    && $report['orphaned_courses'] === 0
    && $report['empty_courses'] === 0
    && $report['courses_without_modules'] === 0
    && count($report['duplicate_courses']) === 0
    ? 'PASS'
    : 'FAIL';

$report['overall_status'] = $overallStatus;
$report['error'] = $error;

logIntegrationHealth($db, [
    'service_name' => 'seed',
    'endpoint' => 'qa/verify-seed-integrity',
    'status_code' => $error === null ? 200 : 500,
    'response_time_ms' => (int)round((microtime(true) - $start) * 1000),
    'success' => $overallStatus === 'PASS',
    'error_message' => $error,
    'triggered_by' => $payload['sub'] ?? null,
]);

jsonOk($report);
