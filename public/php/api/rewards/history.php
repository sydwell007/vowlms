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

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

$filter = $_GET['filter'] ?? 'all'; // all | earned | redeemed
$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = min(50, max(1, (int)($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

$where = 'WHERE user_id = ?';
$params = [$userId];
if ($filter === 'earned') {
    $where .= ' AND points > 0';
} elseif ($filter === 'redeemed') {
    $where .= ' AND points < 0';
}

$countStmt = $db->prepare("SELECT COUNT(*) FROM reward_events {$where}");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

$rowsStmt = $db->prepare(
    "SELECT id, event, points, metadata, created_at
     FROM reward_events
     {$where}
     ORDER BY created_at DESC
     LIMIT {$limit} OFFSET {$offset}"
);
$rowsStmt->execute($params);
$events = $rowsStmt->fetchAll();

$balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$balStmt->execute([$userId]);
$balance = (int)$balStmt->fetchColumn();

jsonOk([
    'balance' => $balance,
    'events'  => $events,
    'page'    => $page,
    'limit'   => $limit,
    'total'   => $total,
    'hasMore' => $offset + count($events) < $total,
]);
