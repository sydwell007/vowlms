<?php
/**
 * VowLMS — Ecosystem Services API
 * Upload to: /home/goalvxiw/api.goalvow.com/api/ecosystem-services.php
 * Route:     GET /ecosystem-services
 */

ob_start();
require_once __DIR__ . '/../../config/db.php';
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://vowlms.vercel.app');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, X-Bridge-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed','timestamp'=>date('c')]); exit; }

function respond(bool $ok, mixed $data = null, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'data' => $data, 'error' => $error, 'timestamp' => date('c')]);
    exit;
}

try {
    $db = getDb();

    $statusFilter = trim($_GET['status'] ?? '');
    $slugFilter   = trim($_GET['slug'] ?? '');

    if ($slugFilter !== '') {
        $stmt = $db->prepare('SELECT * FROM ecosystem_services WHERE slug = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$slugFilter]);
        $row = $stmt->fetch();
        if (!$row) { respond(false, null, 'Service not found', 404); }
        respond(true, $row);
    }

    $sql    = 'SELECT * FROM ecosystem_services WHERE is_active = 1';
    $params = [];

    if ($statusFilter !== '') {
        $sql    .= ' AND status = ?';
        $params[] = $statusFilter;
    }

    $sql .= ' ORDER BY sort_order ASC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    respond(true, $rows);

} catch (Throwable $e) {
    respond(false, null, 'Internal error: ' . $e->getMessage(), 500);
}
