<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

// ---- GET ----------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        'SELECT id, name, email, phone, city, province, country, company,
                avatar_url, bio, role, language, timezone,
                email_notifications, sms_notifications,
                preferred_academy, created_at
         FROM users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) jsonError('User not found', 404);

    $rewStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
    $rewStmt->execute([$userId]);
    $user['reward_points'] = (int)$rewStmt->fetchColumn();

    jsonOk($user);
}

// ---- PUT ----------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = getJsonBody();

    $allowed = [
        'name', 'phone', 'city', 'province', 'country', 'company',
        'bio', 'avatar_url', 'language', 'timezone', 'preferred_academy',
        'email_notifications', 'sms_notifications',
    ];
    $sets   = [];
    $params = [];

    foreach ($allowed as $field) {
        if (array_key_exists($field, $body)) {
            $sets[]   = "`{$field}` = ?";
            $val = $body[$field];
            // Cast booleans to int for TINYINT columns
            if (in_array($field, ['email_notifications', 'sms_notifications'], true)) {
                $val = $val ? 1 : 0;
            } else {
                $val = $val !== null ? trim((string)$val) : null;
            }
            $params[] = $val;
        }
    }

    if (empty($sets)) jsonError('No valid fields provided');

    // Optional password change
    if (!empty($body['currentPassword']) && !empty($body['newPassword'])) {
        $passStmt = $db->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
        $passStmt->execute([$userId]);
        $hash = $passStmt->fetchColumn();
        if (!password_verify($body['currentPassword'], $hash)) {
            jsonError('Current password is incorrect', 400);
        }
        if (strlen($body['newPassword']) < 8) {
            jsonError('New password must be at least 8 characters', 400);
        }
        $sets[]   = '`password_hash` = ?';
        $params[] = password_hash($body['newPassword'], PASSWORD_BCRYPT, ['cost' => 10]);
    }

    $params[] = $userId;
    $db->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);

    $stmt = $db->prepare(
        'SELECT id, name, email, phone, city, province, country, company,
                avatar_url, bio, role, language, timezone,
                email_notifications, sms_notifications,
                preferred_academy, created_at
         FROM users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$userId]);
    jsonOk($stmt->fetch());
}

jsonError('Method not allowed', 405);
