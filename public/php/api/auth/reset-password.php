<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('POST');

$body     = getJsonBody();
$token    = trim($body['token'] ?? '');
$password = $body['password'] ?? '';

if (!$token || strlen($password) < 8) {
    jsonError('token and password (min 8 chars) are required');
}

$db   = getDb();
$stmt = $db->prepare(
    'SELECT pr.id, pr.email, u.id AS user_id
     FROM password_resets pr
     JOIN users u ON u.email = pr.email
     WHERE pr.token = ? AND pr.expires_at > NOW()
     LIMIT 1'
);
$stmt->execute([$token]);
$reset = $stmt->fetch();

if (!$reset) {
    jsonError('Reset link is invalid or has expired. Please request a new one.', 400);
}

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
$db->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $reset['user_id']]);
$db->prepare('DELETE FROM password_resets WHERE id = ?')->execute([$reset['id']]);

jsonOk(['reset' => true]);
