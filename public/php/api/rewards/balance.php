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

$balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$balStmt->execute([$userId]);
$balance = (int)$balStmt->fetchColumn();

$recentStmt = $db->prepare(
    'SELECT id, event, points, metadata, created_at
     FROM reward_events
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 3'
);
$recentStmt->execute([$userId]);
$recentEvents = $recentStmt->fetchAll();

jsonOk([
    'balance'      => $balance,
    'recentEvents' => $recentEvents,
]);
