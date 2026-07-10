<?php
/**
 * VowLMS — Service Interest Log API
 * Upload to: /home/goalvxiw/api.goalvow.com/api/service-interest-create.php
 * Route:     POST /service-interest
 */

ob_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://vowlms.vercel.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Bridge-Key, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed','timestamp'=>date('c')]); exit; }
requireBridgeKey();

function respond(bool $ok, mixed $data = null, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'data' => $data, 'error' => $error, 'timestamp' => date('c')]);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$serviceSlug = trim($body['service_slug'] ?? '');
$email       = trim($body['email']        ?? '');
$name        = trim($body['name']         ?? '');

if ($serviceSlug === '') { respond(false, null, 'service_slug is required', 422); }
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) { respond(false, null, 'Invalid email', 422); }

try {
    $db = getDb();
    $id = 'si-' . bin2hex(random_bytes(10));

    $stmt = $db->prepare('INSERT INTO service_interest_logs (id, service_slug, email, name) VALUES (?, ?, ?, ?)');
    $stmt->execute([$id, $serviceSlug, $email ?: null, $name ?: null]);

    respond(true, ['id' => $id], '', 201);
} catch (Throwable $e) {
    error_log('service-interest-create failed: ' . $e->getMessage());
    respond(false, null, 'Internal server error', 500);
}
