<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/jwt.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/mail.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$body     = getJsonBody();
$name     = trim($body['name'] ?? '');
$email    = trim(strtolower($body['email'] ?? ''));
$password = $body['password'] ?? '';
$phone    = trim($body['phone'] ?? '');
$role     = in_array($body['role'] ?? '', ['learner','facilitator','employer'], true) ? $body['role'] : 'learner';
$city     = trim($body['city'] ?? '');
$country  = trim($body['country'] ?? 'ZA');

if (!$name || !$email || strlen($password) < 8) {
    jsonError('name, email, and password (min 8 chars) are required');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Invalid email address');
}

$db = getDb();

$check = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$check->execute([$email]);
if ($check->fetch()) {
    jsonError('An account with this email already exists', 409);
}

$id   = generateId();
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

$stmt = $db->prepare(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city, country, preferred_academy)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $id, $name, $email, $hash, $role,
    $phone ?: null, $city ?: null, $country,
    $body['preferredAcademy'] ?? null,
]);

// Award registration points
$db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
   ->execute([generateId(), $id, 'register', 100]);

// Welcome email
sendMail($email, 'Welcome to VowLMS — GoalVow Holdings', welcomeEmail($name));

$token = JWT::encode(['sub' => $id, 'email' => $email, 'role' => $role, 'name' => $name]);

jsonCreated([
    'token' => $token,
    'user'  => ['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role],
]);
