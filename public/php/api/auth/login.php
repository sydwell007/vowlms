<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/jwt.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$body     = getJsonBody();
$email    = trim(strtolower($body['email'] ?? ''));
$password = $body['password'] ?? '';

if (!$email || !$password) {
    jsonError('email and password are required');
}

$db   = getDb();
$stmt = $db->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Invalid email or password', 401);
}

$token = JWT::encode([
    'sub'   => $user['id'],
    'email' => $user['email'],
    'role'  => $user['role'],
    'name'  => $user['name'],
]);

jsonOk([
    'token' => $token,
    'user'  => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'],
    ],
]);
