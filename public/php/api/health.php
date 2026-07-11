<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../lib/response.php';

setCors();

$dbStatus = 'unknown';
$schemaStatus = 'unknown';
$jwtStatus = 'unknown';
try {
    $db = getDb();
    $db->query('SELECT 1');
    $dbStatus = 'healthy';

    $stmt = $db->query("SHOW TABLES LIKE 'users'");
    $usersTableExists = (bool)$stmt->fetchColumn();

    if ($usersTableExists) {
        $columnStmt = $db->query("SHOW COLUMNS FROM users LIKE 'password_hash'");
        $passwordColumnExists = (bool)$columnStmt->fetchColumn();
        $schemaStatus = $passwordColumnExists ? 'healthy' : 'error';
    } else {
        $schemaStatus = 'error';
    }

    $jwtStatus = strlen(env('JWT_SECRET', '')) >= 32 ? 'healthy' : 'error';
} catch (Throwable $e) {
    $dbStatus = 'error';
    $schemaStatus = 'error';
    $jwtStatus = 'error';
}

jsonOk([
    'service' => 'VowLMS Bridge',
    'status'  => ($dbStatus === 'healthy' && $schemaStatus === 'healthy' && $jwtStatus === 'healthy') ? 'healthy' : 'degraded',
    'version' => '1.0.1',
    'checks'  => [
        'db'     => $dbStatus,
        'schema' => $schemaStatus,
        'jwt'    => $jwtStatus,
    ],
]);
