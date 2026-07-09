<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$body     = getJsonBody();
$targetId = $body['userId'] ?? $payload['sub'];
$event    = trim($body['event'] ?? '');
$points   = (int)($body['points'] ?? 0);
$metadata = $body['metadata'] ?? null;

if (!$event || $points === 0) jsonError('event and points are required');

$db = getDb();

$id = generateId();
$db->prepare(
    'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
)->execute([$id, $targetId, $event, $points, $metadata ? json_encode($metadata) : null]);

$balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$balStmt->execute([$targetId]);
$balance = (int)$balStmt->fetchColumn();

jsonCreated([
    'rewardEventId' => $id,
    'event'         => $event,
    'points'        => $points,
    'totalBalance'  => $balance,
]);
