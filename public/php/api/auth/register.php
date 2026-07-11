<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/jwt.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/mail.php';
require_once __DIR__ . '/../../lib/rate-limit.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$body     = getJsonBody();
$name     = trim($body['name'] ?? '');
$email    = trim(strtolower($body['email'] ?? ''));
$password = $body['password'] ?? '';
$phone    = trim($body['phone'] ?? '');
$role     = 'learner'; // Elevated roles are assigned only by an authorised administrator.
$city     = trim($body['city'] ?? '');
$country  = trim($body['country'] ?? 'ZA');

if (!$name || !$email || strlen($password) < 8) {
    jsonError('name, email, and password (min 8 chars) are required');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Invalid email address');
}
requireRateLimit('register', $email, 5, 3600);

$db = getDb();

$check = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$check->execute([$email]);
if ($check->fetch()) {
    jsonError('An account with this email already exists', 409);
}

$id   = generateId();
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

try {
    $db->beginTransaction();
    $stmt = $db->prepare(
        'INSERT INTO users (id, name, email, password_hash, role, phone, city, country, preferred_academy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $name, $email, $hash, $role,
        $phone ?: null, $city ?: null, $country,
        $body['preferredAcademy'] ?? null,
    ]);

    $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
       ->execute([generateId(), $id, 'register', 100]);
    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Registration failed: ' . $error->getMessage());
    if ($error instanceof PDOException && $error->getCode() === '23000') {
        jsonError('An account with this email already exists', 409);
    }
    jsonError('Registration failed', 500);
}

// Welcome email should never break account creation.
try {
    sendMail($email, 'Welcome to VowLMS — GoalVow Holdings', welcomeEmail($name));
} catch (Throwable $error) {
    error_log('Welcome email failed: ' . $error->getMessage());
}

try {
    $token = JWT::encode(['sub' => $id, 'email' => $email, 'role' => $role, 'name' => $name]);
} catch (Throwable $error) {
    error_log('Registration JWT failed: ' . $error->getMessage());
    jsonError('Registration completed but session setup failed. Check JWT_SECRET on the bridge.', 500);
}

jsonCreated([
    'token' => $token,
    'user'  => ['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role],
]);
