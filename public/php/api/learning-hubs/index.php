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

$db     = getDb();
$status = $_GET['status'] ?? '';

$where  = [];
$params = [];
if ($status !== '') { $where[] = 'status = ?'; $params[] = $status; }

$clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
$stmt   = $db->prepare("SELECT * FROM learning_hubs {$clause} ORDER BY status ASC, name ASC");
$stmt->execute($params);

jsonOk($stmt->fetchAll());
