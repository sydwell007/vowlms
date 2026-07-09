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

$db   = getDb();
$type = $_GET['type'] ?? '';

$where  = ['is_active = 1'];
$params = [];

if ($type !== '') { $where[] = 'type = ?'; $params[] = $type; }

$whereClause = implode(' AND ', $where);
$stmt = $db->prepare("SELECT * FROM opportunities WHERE {$whereClause} ORDER BY created_at DESC");
$stmt->execute($params);

jsonOk($stmt->fetchAll());
