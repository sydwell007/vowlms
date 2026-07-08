<?php
// Capture the UTF-8 BOM that PHP emits when any included file was saved
// with BOM encoding, then immediately discard it before anything else runs.
// This must be the FIRST two statements so all subsequent header() calls work.
ob_start();
require_once __DIR__ . '/../../config/db.php';
ob_end_clean();

// ── CORS ─────────────────────────────────────────────────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'https://vowlms.vercel.app',
    'https://vowlms.goalvow.com',
    'http://localhost:3000',
    'http://localhost:3001',
];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Vary: Origin");
} else {
    header("Access-Control-Allow-Origin: https://vowlms.vercel.app");
}
header("Access-Control-Allow-Methods: GET, HEAD, OPTIONS");
header("Access-Control-Allow-Headers: Range");
header("Access-Control-Expose-Headers: Content-Range, Accept-Ranges, Content-Length, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) { http_response_code(405); exit; }

$hash    = trim($_GET['hash'] ?? '');
$id      = trim($_GET['id']   ?? '');
$url     = trim($_GET['url']  ?? '');   // Mode C — direct Moodle URL proxy
$reqName = trim($_GET['name'] ?? '');

if ($hash === '' && $id === '' && $url === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'hash, id, or url parameter required']);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODE C — Direct URL proxy (for pluginfile.php URLs embedded in lesson HTML)
// Restricted to known Moodle hosts only to prevent open-proxy abuse.
// ─────────────────────────────────────────────────────────────────────────────
if ($url !== '' && $hash === '' && $id === '') {
    if (!preg_match('#^https?://(goalvow\.com|www\.goalvow\.com)/#i', $url)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'URL domain not allowed']);
        exit;
    }
    $cleanUrl = preg_replace('/([?&])forcedownload=\d+&?/', '$1', $url);
    $cleanUrl = rtrim($cleanUrl, '?&');
    $filename = $reqName ?: basename(parse_url($cleanUrl, PHP_URL_PATH) ?: 'file');
    $mimeType = guessMime($filename);
    proxyFromMoodle($cleanUrl, $mimeType, $filename);
    exit;
}

$db = getDb();

// ─────────────────────────────────────────────────────────────────────────────
// MODE A — Hash-based filesystem serving
// ─────────────────────────────────────────────────────────────────────────────
if ($hash !== '') {
    if (!preg_match('/^[a-f0-9]{40}$/i', $hash)) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Invalid hash format']);
        exit;
    }
    $hash = strtolower($hash);

    $stmt = $db->prepare(
        'SELECT id, type, filename, mime_type, filesize, file_url
         FROM lesson_resources WHERE content_hash = ? LIMIT 1'
    );
    $stmt->execute([$hash]);
    $resource = $stmt->fetch();

    if (!$resource) {
        $ls = $db->prepare('SELECT video_url AS file_url FROM lessons WHERE video_hash = ? LIMIT 1');
        $ls->execute([$hash]);
        $lr = $ls->fetch();
        if ($lr) {
            $resource = ['type' => 'video', 'filename' => $reqName ?: 'video.mp4',
                         'mime_type' => 'video/mp4', 'filesize' => 0, 'file_url' => null, 'id' => null];
        }
    }

    if (!$resource) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Resource not found']);
        exit;
    }

    $domainRoot = dirname(dirname(__DIR__));
    $filePath   = $domainRoot . '/courses/' . substr($hash, 0, 2) . '/' . substr($hash, 2, 2) . '/' . $hash;

    if (file_exists($filePath) && is_file($filePath)) {
        $filename = $reqName ?: ($resource['filename'] ?? 'file');
        $mimeType = $resource['mime_type'] ?? guessMime($filename);
        $filesize = (int)($resource['filesize'] ?? filesize($filePath));
        serveFromFilesystem($filePath, $filesize, $mimeType, $filename);
        exit;
    }

    if (!($resource['id'] ?? null)) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'File not on filesystem']);
        exit;
    }
    $id = $resource['id'];
}

// ─────────────────────────────────────────────────────────────────────────────
// MODE B — ID-based proxy (fetch from Moodle, control all headers)
// ─────────────────────────────────────────────────────────────────────────────
if ($id !== '') {
    if (!preg_match('/^[a-z0-9\-]{1,64}$/i', $id)) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Invalid id format']);
        exit;
    }

    $stmt = $db->prepare(
        'SELECT type, filename, file_url, filesize, mime_type, content_hash
         FROM lesson_resources WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$id]);
    $resource = $stmt->fetch();

    if (!$resource) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Resource not found']);
        exit;
    }

    if (!empty($resource['content_hash'])) {
        $hashVal    = strtolower($resource['content_hash']);
        $domainRoot = dirname(dirname(__DIR__));
        $filePath   = $domainRoot . '/courses/' . substr($hashVal, 0, 2) . '/' . substr($hashVal, 2, 2) . '/' . $hashVal;
        if (file_exists($filePath) && is_file($filePath)) {
            $filename = $reqName ?: ($resource['filename'] ?? 'file');
            $mimeType = $resource['mime_type'] ?? guessMime($filename);
            $filesize = (int)($resource['filesize'] ?? filesize($filePath));
            serveFromFilesystem($filePath, $filesize, $mimeType, $filename);
            exit;
        }
    }

    $fileUrl = $resource['file_url'] ?? '';
    if ($fileUrl === '') {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'No file URL stored for this resource']);
        exit;
    }

    $fileUrl  = preg_replace('/([?&])forcedownload=\d+&?/', '$1', $fileUrl);
    $fileUrl  = rtrim($fileUrl, '?&');
    $filename = $reqName ?: ($resource['filename'] ?? 'file');
    $mimeType = $resource['mime_type'] ?? guessMime($filename);

    proxyFromMoodle($fileUrl, $mimeType, $filename);
    exit;
}

http_response_code(400);
header('Content-Type: application/json');
echo json_encode(['ok' => false, 'error' => 'Nothing to serve']);
exit;

// ─────────────────────────────────────────────────────────────────────────────
// Serve directly from the Moodle filedir (hash-based filesystem path).
// Supports HTTP Range requests for video seeking.
// ─────────────────────────────────────────────────────────────────────────────
function serveFromFilesystem(string $path, int $size, string $mimeType, string $filename): void
{
    $safe = rawurlencode(preg_replace('/[^\w.\- ]/u', '_', $filename));

    header("Content-Type: {$mimeType}");
    header("Content-Disposition: inline; filename=\"{$safe}\"");
    header("Accept-Ranges: bytes");
    header("Cache-Control: private, max-age=86400");
    header("X-Content-Type-Options: nosniff");
    header_remove('X-Frame-Options');
    header("Cross-Origin-Resource-Policy: cross-origin");

    $range = $_SERVER['HTTP_RANGE'] ?? '';
    if ($range === '') {
        header("Content-Length: {$size}");
        if ($_SERVER['REQUEST_METHOD'] !== 'HEAD') readfile($path);
        return;
    }

    if (!preg_match('/^bytes=(\d*)-(\d*)$/', $range, $m)) {
        http_response_code(416);
        header("Content-Range: bytes */{$size}");
        return;
    }
    $start  = $m[1] !== '' ? (int)$m[1] : 0;
    $end    = $m[2] !== '' ? (int)$m[2] : $size - 1;
    if ($start > $end || $end >= $size) {
        http_response_code(416);
        header("Content-Range: bytes */{$size}");
        return;
    }
    $length = $end - $start + 1;
    http_response_code(206);
    header("Content-Range: bytes {$start}-{$end}/{$size}");
    header("Content-Length: {$length}");

    if ($_SERVER['REQUEST_METHOD'] === 'HEAD') return;

    $fp   = fopen($path, 'rb');
    fseek($fp, $start);
    $left = $length;
    while ($left > 0 && !feof($fp)) {
        $chunk = fread($fp, min(65536, $left));
        if ($chunk === false) break;
        echo $chunk;
        $left -= strlen($chunk);
        flush();
    }
    fclose($fp);
}

// ─────────────────────────────────────────────────────────────────────────────
// Proxy a file from Moodle via cURL.
// All response headers are set in the WRITEFUNCTION on the first data chunk,
// after the output buffer has already been cleaned at script start.
// ─────────────────────────────────────────────────────────────────────────────
function proxyFromMoodle(string $url, string $mimeType, string $filename): void
{
    if (!function_exists('curl_init')) {
        header("Location: {$url}", true, 302);
        exit;
    }

    $safe  = rawurlencode(preg_replace('/[^\w.\- ]/u', '_', $filename));
    $range = $_SERVER['HTTP_RANGE'] ?? '';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_USERAGENT      => 'VowLMS-FileProxy/1.0',
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_BUFFERSIZE     => 65536,
    ]);

    if ($range !== '') {
        curl_setopt($ch, CURLOPT_RANGE, str_replace('bytes=', '', $range));
    }

    $moodleHeaders = [];
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($ch, $headerLine) use (&$moodleHeaders) {
        $h = trim($headerLine);
        if (strpos($h, ':') !== false) {
            [$name, $val] = explode(':', $h, 2);
            $moodleHeaders[strtolower(trim($name))] = trim($val);
        }
        return strlen($headerLine);
    });

    // ob_end_clean() was already called at script start — headers are clean.
    // This WRITEFUNCTION just sets response headers on the first chunk and
    // streams body bytes directly without any additional buffering.
    $headersSet = false;
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $data) use (
        &$headersSet, &$moodleHeaders, $mimeType, $safe, $range
    ) {
        if (!$headersSet) {
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($httpCode === 206 || ($range !== '' && $httpCode === 200)) {
                http_response_code(206);
                if (isset($moodleHeaders['content-range'])) {
                    header("Content-Range: {$moodleHeaders['content-range']}");
                }
            } else {
                http_response_code($httpCode >= 400 ? $httpCode : 200);
            }

            header("Content-Type: {$mimeType}");
            header("Content-Disposition: inline; filename=\"{$safe}\"");
            header("Accept-Ranges: bytes");
            header("Cache-Control: private, max-age=3600");
            header("X-Content-Type-Options: nosniff");
            header_remove('X-Frame-Options');
            header("Cross-Origin-Resource-Policy: cross-origin");

            if (isset($moodleHeaders['content-length'])) {
                header("Content-Length: {$moodleHeaders['content-length']}");
            }

            $headersSet = true;
        }
        echo $data;
        flush();
        return strlen($data);
    });

    curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err && !$headersSet) {
        http_response_code(502);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Proxy fetch failed: ' . $err]);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
function guessMime(string $filename): string
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return [
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
    ][$ext] ?? 'application/octet-stream';
}
