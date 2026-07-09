<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/mail.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$body  = getJsonBody();
$email = trim(strtolower($body['email'] ?? ''));

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('A valid email address is required');
}

$db   = getDb();
$stmt = $db->prepare('SELECT id, name FROM users WHERE email = ? AND is_active = 1 LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Always return success — don't reveal if email exists
if ($user) {
    $token     = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour

    // Remove old tokens for this email
    $db->prepare('DELETE FROM password_resets WHERE email = ?')->execute([$email]);

    $db->prepare('INSERT INTO password_resets (id, email, token, expires_at) VALUES (?, ?, ?, ?)')
       ->execute([generateId(), $email, $token, $expiresAt]);

    sendMail($email, 'Reset your VowLMS password', resetPasswordEmail($user['name'], $token));
}

jsonOk(['sent' => true]);
