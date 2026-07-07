<?php
/**
 * GET /files/serve?hash={sha1}&name={filename}
 *   Serves a lesson resource file from the `courses/` symlink.
 *   The `courses` directory at the domain root is a symlink to
 *   Moodle's moodledata/filedir where files are stored as:
 *     courses/AB/CD/ABCDEF...  (first 2 / next 2 chars of SHA-1 hash)
 *
 * Fallback: if file not found on filesystem (no hash / wrong path),
 *   issues a 302 redirect to the stored Moodle pluginfile URL.
 *
 * Supports HTTP Range requests so browsers can seek inside videos.
 *
 * NO Bridge-Key required — browser fetches files directly.
 * Security: hash is validated against lesson_resources table so we
 *           only serve files that belong to our courses, not arbitrary
 *           files from Moodle's filedir.
 */

require_once __DIR__ . '/../../../config/db.php';

// CORS — allow the VowLMS Vercel app and local dev
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'https://vowlms.vercel.app',
    'https://vowlms.goalvow.com',
    'http://localhost:3000',
    'http://localhost:3001',
];
if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Vary: Origin");
} else {
    header("Access-Control-Allow-Origin: https://vowlms.vercel.app");
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Range");
header("Access-Control-Expose-Headers: Content-Range, Accept-Ranges, Content-Length");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET')      { http_response_code(405); exit; }

$hash     = trim($_GET['hash'] ?? '');
$reqName  = trim($_GET['name'] ?? '');

if ($hash === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'hash parameter required']);
    exit;
}

// Strict SHA-1 format: exactly 40 hex chars
if (!preg_match('/^[a-f0-9]{40}$/i', $hash)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Invalid hash format']);
    exit;
}
$hash = strtolower($hash);

// ── Look up resource in DB ────────────────────────────────────────────────────
$db = getDb();
$stmt = $db->prepare(
    'SELECT type, filename, mime_type, filesize, file_url
     FROM lesson_resources
     WHERE content_hash = ? LIMIT 1'
);
$stmt->execute([$hash]);
$resource = $stmt->fetch();

// Also check lessons.video_hash
if (!$resource) {
    $lesStmt = $db->prepare('SELECT type, video_url AS file_url FROM lessons WHERE video_hash = ? LIMIT 1');
    $lesStmt->execute([$hash]);
    $lesRow = $lesStmt->fetch();
    if ($lesRow) {
        $resource = [
            'type'     => 'video',
            'filename' => $reqName ?: 'video.mp4',
            'mime_type'=> 'video/mp4',
            'filesize' => 0,
            'file_url' => $lesRow['file_url'],
        ];
    }
}

if (!$resource) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Resource not found']);
    exit;
}

// ── Determine filesystem path ────────────────────────────────────────────────
// `courses` symlink sits at the domain root: api.goalvow.com/courses/
// This PHP file is at: api.goalvow.com/api/files/serve.php
//   __DIR__ = .../api.goalvow.com/api/files
//   Two levels up = .../api.goalvow.com
$domainRoot  = dirname(dirname(__DIR__));
$coursesDir  = $domainRoot . '/courses';
$filePath    = $coursesDir . '/' . substr($hash, 0, 2) . '/' . substr($hash, 2, 2) . '/' . $hash;

$filename = $reqName ?: ($resource['filename'] ?? 'file');
$mimeType = $resource['mime_type'] ?? guessMime($filename);
$filesize = (int)($resource['filesize'] ?? 0);

// ── Serve from filesystem (fast path) ────────────────────────────────────────
if (file_exists($filePath) && is_file($filePath)) {
    $realSize = filesize($filePath);
    serveFile($filePath, $realSize, $mimeType, $filename);
    exit;
}

// ── Fallback: redirect to Moodle pluginfile URL ───────────────────────────────
$fallbackUrl = $resource['file_url'] ?? '';
if ($fallbackUrl !== '') {
    // 302 redirect — browser downloads directly from Moodle
    header("Location: {$fallbackUrl}", true, 302);
    exit;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['ok' => false, 'error' => 'File not available']);
exit;

// ── Helpers ───────────────────────────────────────────────────────────────────

function serveFile(string $path, int $size, string $mimeType, string $filename): void
{
    $safeFilename = rawurlencode(preg_replace('/[^\w.\- ]/u', '_', $filename));

    header("Content-Type: {$mimeType}");
    header("Content-Disposition: inline; filename=\"{$safeFilename}\"");
    header("Accept-Ranges: bytes");
    header("Cache-Control: private, max-age=86400");
    header("X-Content-Type-Options: nosniff");

    $rangeHeader = $_SERVER['HTTP_RANGE'] ?? '';

    if ($rangeHeader === '') {
        // Full file
        header("Content-Length: {$size}");
        readfile($path);
        return;
    }

    // ── HTTP Range request (video seeking) ────────────────────────────────────
    if (!preg_match('/^bytes=(\d*)-(\d*)$/', $rangeHeader, $m)) {
        http_response_code(416); // Range Not Satisfiable
        header("Content-Range: bytes */{$size}");
        return;
    }

    $start = $m[1] !== '' ? (int)$m[1] : 0;
    $end   = $m[2] !== '' ? (int)$m[2] : $size - 1;

    if ($start > $end || $end >= $size) {
        http_response_code(416);
        header("Content-Range: bytes */{$size}");
        return;
    }

    $length = $end - $start + 1;

    http_response_code(206);
    header("Content-Range: bytes {$start}-{$end}/{$size}");
    header("Content-Length: {$length}");

    $fp = fopen($path, 'rb');
    fseek($fp, $start);
    $bytesLeft = $length;
    while ($bytesLeft > 0 && !feof($fp)) {
        $chunk = fread($fp, min(65536, $bytesLeft));
        if ($chunk === false) break;
        echo $chunk;
        $bytesLeft -= strlen($chunk);
        flush();
    }
    fclose($fp);
}

function guessMime(string $filename): string
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $map = [
        'pdf'  => 'application/pdf',
        'mp4'  => 'video/mp4',
        'webm' => 'video/webm',
        'ogg'  => 'video/ogg',
        'avi'  => 'video/x-msvideo',
        'mov'  => 'video/quicktime',
        'mkv'  => 'video/x-matroska',
        'mp3'  => 'audio/mpeg',
        'wav'  => 'audio/wav',
        'm4a'  => 'audio/mp4',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'zip'  => 'application/zip',
        'txt'  => 'text/plain',
    ];
    return $map[$ext] ?? 'application/octet-stream';
}
