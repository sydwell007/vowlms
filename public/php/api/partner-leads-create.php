<?php
/**
 * VowLMS — Partner Leads API (create)
 * Upload to: /home/goalvxiw/api.goalvow.com/api/partner-leads-create.php
 * Route:     POST /partner-leads
 * Auth:      X-Bridge-Key required
 */

ob_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://vowlms.vercel.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, X-Bridge-Key, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed','timestamp'=>date('c')]); exit; }

function respond(bool $ok, mixed $data = null, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'data' => $data, 'error' => $error, 'timestamp' => date('c')]);
    exit;
}

requireBridgeKey();

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$name    = trim($body['name']         ?? '');
$email   = trim($body['email']        ?? '');
$org     = trim($body['organisation'] ?? '');
$type    = trim($body['partner_type'] ?? '');
$message = trim($body['message']      ?? '');

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, null, 'name and valid email are required', 422);
}

try {
    $db = getDb();
    $id = 'prt-' . bin2hex(random_bytes(10));

    $stmt = $db->prepare(
        'INSERT INTO partner_leads (id, name, email, organisation, partner_type, message)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$id, $name, $email, $org, $type, $message]);

    respond(true, ['id' => $id], '', 201);
} catch (Throwable $e) {
    respond(false, null, 'Internal error: ' . $e->getMessage(), 500);
}
