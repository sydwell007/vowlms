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
requireMethod('POST');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$start = microtime(true);
$db = null;
$tables = ['courses' => null, 'users' => null, 'academies' => null];
$error = null;

try {
    $db = getDb();
    foreach (array_keys($tables) as $table) {
        $stmt = $db->query("SELECT COUNT(*) FROM `{$table}`");
        $tables[$table] = (int)$stmt->fetchColumn();
    }
} catch (Throwable $e) {
    $error = $e->getMessage();
}

$latencyMs = (int)round((microtime(true) - $start) * 1000);
$success = $error === null;

logIntegrationHealth($db, [
    'service_name' => 'db',
    'endpoint' => 'qa/test-db-connection',
    'status_code' => $success ? 200 : 500,
    'response_time_ms' => $latencyMs,
    'success' => $success,
    'error_message' => $error,
    'triggered_by' => $payload['sub'] ?? null,
]);

jsonOk([
    'success' => $success,
    'tables' => $tables,
    'latencyMs' => $latencyMs,
    'error' => $error,
]);
