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
$expires = (int)($_GET['expires'] ?? 0);
$signature = trim($_GET['sig'] ?? '');

if ($hash === '' && $id === '' && $url === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'hash, id, or url parameter required']);
    exit;
}

$selector = $hash !== '' ? 'hash:' . $hash : ($id !== '' ? 'id:' . $id : 'url:' . $url);
$signingSecret = env('RESOURCE_SIGNING_SECRET', '');
$expectedSignature = $expires > 0 && $signingSecret !== ''
    ? hash_hmac('sha256', $selector . '|' . $expires, $signingSecret)
    : '';
if (
    $expires < time() ||
    $expires > time() + 3600 ||
    $signature === '' ||
    $expectedSignature === '' ||
    !hash_equals($expectedSignature, $signature)
) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Invalid or expired resource link']);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODE C — Direct URL proxy (for pluginfile.php URLs embedded in lesson HTML)
// Restricted to known Moodle hosts only to prevent open-proxy abuse.
// Plain pluginfile.php requires a browser session; convert it to the
// webservice variant and inject the token belonging to that academy.
// ─────────────────────────────────────────────────────────────────────────────
if ($url !== '' && $hash === '' && $id === '') {
    if (!preg_match('#^https?://(goalvow\.com|www\.goalvow\.com)/#i', $url)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'URL domain not allowed']);
        exit;
    }
    $cleanUrl = prepareMoodleUrl($url);
    if ($cleanUrl === '') {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Moodle token not configured for this academy']);
        exit;
    }

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

    $fileUrl = prepareMoodleUrl($fileUrl);
    if ($fileUrl === '') {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Moodle token not configured for this academy']);
        exit;
    }
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
//
// iOS Safari always sends a HEAD request to a <video> URL before it will play
// it, to inspect Accept-Ranges/Content-Length/Content-Type — and refuses to
// play at all if that HEAD response is malformed (e.g. carries a body, which
// is exactly what happened here: HEAD was never special-cased, so this proxy
// ran a full GET against Moodle regardless of the client's method and then
// echoed the entire video body onto what should have been a bodyless HEAD
// response). Desktop browsers tolerate that; iOS does not. CURLOPT_NOBODY
// below makes the upstream request a real HEAD too when the client's was,
// and $emitHeaders is shared so the exact same header logic runs whether it's
// triggered by the first streamed byte (GET) or by curl_exec finishing with
// no body at all (HEAD).
// ─────────────────────────────────────────────────────────────────────────────
function proxyFromMoodle(string $url, string $mimeType, string $filename): void
{
    $host = strtolower((string)parse_url($url, PHP_URL_HOST));
    if (!in_array($host, ['goalvow.com', 'www.goalvow.com'], true)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Resource host not allowed']);
        return;
    }

    if (!function_exists('curl_init')) {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Resource service unavailable']);
        return;
    }

    $safe   = rawurlencode(preg_replace('/[^\w.\- ]/u', '_', $filename));
    $range  = $_SERVER['HTTP_RANGE'] ?? '';
    $isHead = $_SERVER['REQUEST_METHOD'] === 'HEAD';

    // goalvow.com's own pluginfile.php ignores Range entirely on these
    // mod_label videos — confirmed live: a `Range: bytes=0-1023` request
    // still comes back `200 OK` / `Transfer-Encoding: chunked` with the
    // *entire* multi-megabyte file. Safari requests a small range before it
    // will play a video at all and expects `206` back for exactly that
    // range; getting `200` with the whole file instead is why playback
    // failed even after the HEAD fix. Since we can't change goalvow.com,
    // $rangeStart/$rangeEnd let the WRITEFUNCTION below slice the requested
    // window out of upstream's response itself and answer with a real 206 —
    // aborting the transfer the moment we have those bytes, so a small seek
    // doesn't still cost a full download every time.
    $rangeStart = null;
    $rangeEnd   = null;
    if (!$isHead && $range !== '' && preg_match('/^bytes=(\d*)-(\d*)$/', $range, $rm)) {
        $rangeStart = $rm[1] !== '' ? (int)$rm[1] : 0;
        $rangeEnd   = $rm[2] !== '' ? (int)$rm[2] : null;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT      => 'VowLMS-FileProxy/1.0',
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_BUFFERSIZE     => 65536,
    ]);

    if ($isHead) {
        // A real upstream HEAD: no video body ever gets fetched or sent.
        curl_setopt($ch, CURLOPT_NOBODY, true);
    } elseif ($range !== '') {
        // Still ask upstream properly — if it ever starts honouring Range,
        // $upstream206 below takes the cheap passthrough path instead.
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

    $headersSet   = false;
    $upstream206  = false;

    // Shared by both the streaming path (GET, called on the first body byte)
    // and the no-body path (HEAD, called after curl_exec) so a HEAD response
    // gets identical Content-Type/Accept-Ranges/Content-Length headers to
    // what the follow-up ranged GET will send — never a guess, never a body.
    $emitHeaders = function () use (&$moodleHeaders, $mimeType, $safe, $ch, $rangeStart, $rangeEnd, &$upstream206): void {
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $upstream206 = ($httpCode === 206 && isset($moodleHeaders['content-range']));

        $upstreamType = strtolower($moodleHeaders['content-type'] ?? '');
        $isErrorPayload = $httpCode >= 400
            || str_contains($upstreamType, 'application/json')
            || str_contains($upstreamType, 'text/html');

        if ($isErrorPayload) {
            http_response_code($httpCode >= 400 ? $httpCode : 502);
            header('Content-Type: ' . ($upstreamType ?: 'application/json'));
            header('Cache-Control: no-store');
            header('X-Content-Type-Options: nosniff');
            return;
        }

        if ($upstream206) {
            http_response_code(206);
            header("Content-Range: {$moodleHeaders['content-range']}");
            if (isset($moodleHeaders['content-length'])) {
                header("Content-Length: {$moodleHeaders['content-length']}");
            }
        } elseif ($rangeStart !== null) {
            // Upstream ignored our Range — we'll slice it out ourselves.
            $total = isset($moodleHeaders['content-length']) ? (int)$moodleHeaders['content-length'] : null;
            $end = $rangeEnd ?? ($total !== null ? $total - 1 : $rangeStart + 1048575);
            http_response_code(206);
            header("Content-Range: bytes {$rangeStart}-{$end}/" . ($total !== null ? $total : '*'));
            header('Content-Length: ' . ($end - $rangeStart + 1));
        } else {
            http_response_code($httpCode >= 400 ? $httpCode : 200);
            if (isset($moodleHeaders['content-length'])) {
                header("Content-Length: {$moodleHeaders['content-length']}");
            }
        }

        header("Content-Type: {$mimeType}");
        header("Content-Disposition: inline; filename=\"{$safe}\"");
        header("Accept-Ranges: bytes");
        header("Cache-Control: private, max-age=3600");
        header("X-Content-Type-Options: nosniff");
        header_remove('X-Frame-Options');
        header("Cross-Origin-Resource-Policy: cross-origin");
    };

    // ob_end_clean() was already called at script start — headers are clean.
    $consumed = 0; // absolute byte offset of upstream data seen so far
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $data) use (
        &$headersSet, $emitHeaders, &$upstream206, $rangeStart, $rangeEnd, &$consumed
    ) {
        if (!$headersSet) {
            $emitHeaders();
            $headersSet = true;
        }

        $len = strlen($data);

        // No range requested, or upstream honoured ours with a real 206 —
        // plain passthrough.
        if ($rangeStart === null || $upstream206) {
            echo $data;
            flush();
            return $len;
        }

        // Upstream is sending the whole file regardless — keep only the
        // slice of it the client actually asked for.
        $chunkStart = $consumed;
        $chunkEnd   = $consumed + $len - 1;
        $consumed  += $len;

        $wantEnd = $rangeEnd ?? PHP_INT_MAX;
        $overlapStart = max($chunkStart, $rangeStart);
        $overlapEnd   = min($chunkEnd, $wantEnd);

        if ($overlapStart <= $overlapEnd) {
            echo substr($data, $overlapStart - $chunkStart, $overlapEnd - $overlapStart + 1);
            flush();
        }

        // We have everything the client asked for — abort the transfer
        // rather than keep downloading (and discarding) the rest of a
        // multi-megabyte file just to satisfy a small Range request.
        if ($chunkEnd >= $wantEnd) {
            return 0;
        }

        return $len;
    });

    curl_exec($ch);
    $err = curl_error($ch);

    if ($err && !$headersSet) {
        http_response_code(502);
        header('Content-Type: application/json');
        error_log('Moodle resource proxy failed: ' . $err);
        echo json_encode(['ok' => false, 'error' => 'Resource fetch failed']);
        curl_close($ch);
        return;
    }

    // HEAD (or any successful response with zero bytes of body) never
    // triggers WRITEFUNCTION — emit the same headers now, from the same
    // curl handle, before it's closed. No body follows, matching a real HEAD.
    if (!$headersSet) {
        $emitHeaders();
    }

    curl_close($ch);
}

function moodleTokenForUrl(string $url): string
{
    $path = strtolower((string)parse_url($url, PHP_URL_PATH));
    $tokenByPath = [
        '/upskilling/'     => 'UPSKILLING_MOODLE_TOKEN',
        '/skills-training/' => 'SKILLS_TRAINING_MOODLE_TOKEN',
        '/skillstraining/'  => 'SKILLS_TRAINING_MOODLE_TOKEN',
        '/chef-academy/'    => 'CHEF_ACADEMY_MOODLE_TOKEN',
        '/chefacademy/'     => 'CHEF_ACADEMY_MOODLE_TOKEN',
        '/schools/'        => 'GOALVOW_SCHOOLS_MOODLE_TOKEN',
        '/business-school/' => 'BUSINESS_SCHOOL_MOODLE_TOKEN',
        '/businessschool/'  => 'BUSINESS_SCHOOL_MOODLE_TOKEN',
        '/university/'     => 'GOALVOW_UNIVERSITY_MOODLE_TOKEN',
    ];

    foreach ($tokenByPath as $academyPath => $envName) {
        if (str_contains($path, $academyPath)) {
            return cleanEnvToken($envName);
        }
    }

    return cleanEnvToken('MOODLE_TOKEN');
}

function cleanEnvToken(string $name): string
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        $value = $_ENV[$name] ?? '';
    }
    return trim((string)$value, " \t\n\r\0\x0B;\"'");
}

function prepareMoodleUrl(string $url): string
{
    $cleanUrl = preg_replace('/([?&])forcedownload=\d+&?/', '$1', $url);
    $cleanUrl = rtrim((string)$cleanUrl, '?&');
    $cleanUrl = str_ireplace(
        ['/skillstraining/', '/chefacademy/', '/businessschool/'],
        ['/skills-training/', '/chef-academy/', '/business-school/'],
        $cleanUrl
    );

    if (!preg_match('#/pluginfile\.php/#i', $cleanUrl)) {
        return $cleanUrl;
    }

    $moodleToken = moodleTokenForUrl($cleanUrl);
    if ($moodleToken === '') {
        return '';
    }

    if (!preg_match('#/webservice/pluginfile\.php/#i', $cleanUrl)) {
        $cleanUrl = preg_replace('#/pluginfile\.php/#i', '/webservice/pluginfile.php/', $cleanUrl);
    }

    // Replace any stale token stored in lesson HTML or lesson_resources.
    $cleanUrl = preg_replace('/([?&])token=[^&]*&?/i', '$1', (string)$cleanUrl);
    $cleanUrl = rtrim((string)$cleanUrl, '?&');
    $separator = strpos($cleanUrl, '?') !== false ? '&' : '?';

    return $cleanUrl . $separator . 'token=' . urlencode($moodleToken);
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
