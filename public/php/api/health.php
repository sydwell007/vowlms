<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/rate-limit.php';

setCors();

// Public, unauthenticated endpoint for uptime monitors (UptimeRobot etc.) — rate-limited
// per IP so it can't be used to hammer the database.
requireRateLimit('health-check', $_SERVER['REMOTE_ADDR'] ?? 'unknown', 1, 5);

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
        $requiredUserColumns = [
            'password_hash',
            'language',
            'timezone',
            'province',
            'company',
            'avatar_url',
            'email_notifications',
            'sms_notifications',
        ];
        $missingColumns = [];
        foreach ($requiredUserColumns as $column) {
            $requiredStmt = $db->query("SHOW COLUMNS FROM users LIKE '{$column}'");
            if (!$requiredStmt->fetchColumn()) {
                $missingColumns[] = $column;
            }
        }

        $schemaStatus = ($passwordColumnExists && count($missingColumns) === 0) ? 'healthy' : 'error';
    } else {
        $schemaStatus = 'error';
    }

    $jwtStatus = strlen(env('JWT_SECRET', '')) >= 32 ? 'healthy' : 'error';
} catch (Throwable $e) {
    $dbStatus = 'error';
    $schemaStatus = 'error';
    $jwtStatus = 'error';
}

$healthy = $dbStatus === 'healthy' && $schemaStatus === 'healthy' && $jwtStatus === 'healthy';

jsonOk([
    'service' => 'VowLMS Bridge',
    'status'  => $healthy ? 'healthy' : 'degraded',
    'version' => '1.0.1',
    'checks'  => [
        'db'     => $dbStatus,
        'schema' => $schemaStatus,
        'jwt'    => $jwtStatus,
    ],
    // DB unreachable specifically (not a schema/jwt config issue) is the one condition an
    // uptime monitor should page on — surfaced separately so 503 means "database is down".
], $dbStatus === 'error' ? 503 : 200);
