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

$db   = getDb();
$stmt = $db->prepare(
    'SELECT id, name, email, role, phone, city, country, bio, preferred_academy,
            email_notifications, language, timezone
     FROM users WHERE id = ? AND is_active = 1 LIMIT 1'
);
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
    jsonError('User not found', 404);
}

// Reward points balance
$pts = $db->prepare('SELECT COALESCE(SUM(points), 0) AS total FROM reward_events WHERE user_id = ?');
$pts->execute([$userId]);
$user['rewardPoints'] = (int)($pts->fetch()['total'] ?? 0);

jsonOk($user);
