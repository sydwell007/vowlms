<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['POST', 'DELETE'], true)) jsonError('Method not allowed', 405);

$payload = requireAuth();
$userId = (string)$payload['sub'];
$db = getDb();
$uploadRoot = dirname(dirname(__DIR__)) . '/uploads/avatars';

if ($method === 'DELETE') {
    $previous = $db->prepare('SELECT avatar_url FROM users WHERE id = ? LIMIT 1');
    $previous->execute([$userId]);
    $previousUrl = (string)($previous->fetchColumn() ?: '');

    $db->prepare('UPDATE users SET avatar_url = NULL WHERE id = ?')->execute([$userId]);
    deleteManagedAvatar($previousUrl, $uploadRoot);
    jsonOk(['avatar_url' => null]);
}

if (!isset($_FILES['avatar']) || !is_array($_FILES['avatar'])) {
    jsonError('Choose an image to upload.', 400);
}

$file = $_FILES['avatar'];
$error = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
if ($error !== UPLOAD_ERR_OK) {
    $message = match ($error) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The image is too large.',
        UPLOAD_ERR_PARTIAL => 'The image upload was interrupted.',
        default => 'The image could not be uploaded.',
    };
    jsonError($message, 400);
}

$tmpPath = (string)($file['tmp_name'] ?? '');
$size = (int)($file['size'] ?? 0);
if ($tmpPath === '' || !is_uploaded_file($tmpPath) || $size < 1 || $size > 4 * 1024 * 1024) {
    jsonError('The image must be smaller than 4 MB.', 400);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string)$finfo->file($tmpPath);
$extensions = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];
if (!isset($extensions[$mime])) {
    jsonError('Use a JPG, PNG, or WebP image.', 400);
}

$dimensions = @getimagesize($tmpPath);
if ($dimensions === false) jsonError('The uploaded file is not a valid image.', 400);
[$width, $height] = $dimensions;
if ($width < 64 || $height < 64 || $width > 4096 || $height > 4096) {
    jsonError('Use an image between 64 x 64 and 4096 x 4096 pixels.', 400);
}

if (!is_dir($uploadRoot) && !mkdir($uploadRoot, 0755, true) && !is_dir($uploadRoot)) {
    error_log('Avatar directory could not be created: ' . $uploadRoot);
    jsonError('Avatar storage is unavailable.', 500);
}

$filename = bin2hex(random_bytes(20)) . '.' . $extensions[$mime];
$destination = $uploadRoot . '/' . $filename;
if (!move_uploaded_file($tmpPath, $destination)) {
    error_log('Avatar move failed for user ' . $userId);
    jsonError('Avatar storage is unavailable.', 500);
}
@chmod($destination, 0644);

$apiBase = rtrim(env('API_BASE_URL', 'https://api.goalvow.com'), '/');
$avatarUrl = $apiBase . '/uploads/avatars/' . rawurlencode($filename);
$previous = $db->prepare('SELECT avatar_url FROM users WHERE id = ? LIMIT 1');
$previous->execute([$userId]);
$previousUrl = (string)($previous->fetchColumn() ?: '');

try {
    $update = $db->prepare('UPDATE users SET avatar_url = ? WHERE id = ?');
    $update->execute([$avatarUrl, $userId]);
} catch (Throwable $error) {
    @unlink($destination);
    throw $error;
}

deleteManagedAvatar($previousUrl, $uploadRoot, $destination);

jsonOk(['avatar_url' => $avatarUrl]);

function deleteManagedAvatar(string $url, string $uploadRoot, string $except = ''): void
{
    if ($url === '' || !str_contains($url, '/uploads/avatars/')) return;

    $filename = basename((string)parse_url($url, PHP_URL_PATH));
    if (!preg_match('/^[a-f0-9]{40}\.(?:jpg|png|webp)$/', $filename)) return;

    $path = $uploadRoot . '/' . $filename;
    if ($path !== $except && is_file($path)) @unlink($path);
}
