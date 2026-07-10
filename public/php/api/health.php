<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../lib/response.php';

setCors();

$dbStatus = 'unknown';
try {
    getDb()->query('SELECT 1');
    $dbStatus = 'healthy';
} catch (Throwable $e) {
    $dbStatus = 'error';
}

jsonOk([
    'service' => 'VowLMS Bridge',
    'status'  => $dbStatus === 'healthy' ? 'healthy' : 'degraded',
    'version' => '1.0.0',
    'checks'  => [
        'db'  => $dbStatus,
    ],
]);
