<?php
/**
 * VowLMS — Support Services API
 * Upload to: /home/goalvxiw/api.goalvow.com/api/support-services.php
 * Route:     GET /support-services
 */

ob_start();
require_once __DIR__ . '/../../config/db.php';
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://vowlms.vercel.app');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function respond(bool $ok, mixed $data = null, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'data' => $data, 'error' => $error, 'timestamp' => date('c')]);
    exit;
}

try {
    $db       = getDb();
    $category = trim($_GET['category'] ?? '');

    $sql    = 'SELECT * FROM support_services WHERE is_active = 1';
    $params = [];
    if ($category !== '') { $sql .= ' AND category = ?'; $params[] = $category; }
    $sql .= ' ORDER BY sort_order ASC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    respond(true, $rows);
} catch (Throwable $e) {
    error_log('support-services failed: ' . $e->getMessage());
    respond(false, null, 'Internal server error', 500);
}
