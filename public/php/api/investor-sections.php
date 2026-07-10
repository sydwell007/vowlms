<?php
/**
 * VowLMS — Investor Sections API
 * Upload to: /home/goalvxiw/api.goalvow.com/api/investor-sections.php
 * Route:     GET /investor-sections
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
    $db      = getDb();
    $section = trim($_GET['section'] ?? '');

    $sql    = 'SELECT * FROM investor_sections WHERE is_active = 1';
    $params = [];
    if ($section !== '') { $sql .= ' AND section_key = ?'; $params[] = $section; }
    $sql .= ' ORDER BY sort_order ASC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // Parse JSON content fields
    foreach ($rows as &$row) {
        foreach (['content_json', 'meta_json'] as $col) {
            if (isset($row[$col]) && $row[$col] !== null) {
                $row[$col] = json_decode($row[$col], true);
            }
        }
    }
    unset($row);

    respond(true, $rows);
} catch (Throwable $e) {
    error_log('investor-sections failed: ' . $e->getMessage());
    respond(false, null, 'Internal server error', 500);
}
