<?php
/**
 * GET /lessons/[slug]
 * Returns a single lesson with its content, module, course, prev/next,
 * and all modules (for the sidebar) — everything LessonPlayer needs.
 *
 * No auth required: lesson content is visible to any enrolled learner.
 * Bridge-key check is still enforced so only our Next.js app can call this.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

function signedMediaUrl(string $kind, string $value, string $filename): ?string
{
    $secret = env('RESOURCE_SIGNING_SECRET', '');
    $apiBase = rtrim(env('API_BASE_URL', 'https://api.goalvow.com'), '/');
    if ($secret === '' || $apiBase === '' || $value === '') return null;

    $expires = time() + 3600;
    $signature = hash_hmac('sha256', $kind . ':' . $value . '|' . $expires, $secret);
    $query = http_build_query([
        $kind => $value,
        'name' => $filename,
        'expires' => $expires,
        'sig' => $signature,
    ], '', '&', PHP_QUERY_RFC3986);

    return $apiBase . '/files/serve?' . $query;
}

function cleanMoodleSourceUrl(string $url): string
{
    $url = html_entity_decode($url, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $url = preg_replace('/([?&])forcedownload=\d+&?/i', '$1', $url);
    $url = preg_replace('/([?&])token=[^&]*&?/i', '$1', (string)$url);
    return rtrim((string)$url, '?&');
}

function filenameFromUrl(string $url, string $fallback = 'video.mp4'): string
{
    $path = (string)parse_url($url, PHP_URL_PATH);
    $filename = rawurldecode(basename($path));
    return $filename !== '' ? $filename : $fallback;
}

$slug = trim($_GET['slug'] ?? '');
if ($slug === '') jsonError('Lesson slug is required', 400);

$db = getDb();

// ── 1. Fetch the lesson ───────────────────────────────────────────────────────
$stmt = $db->prepare(
    'SELECT l.id, l.slug, l.title, l.type, l.content, l.video_url, l.video_hash,
            l.duration_minutes, l.position, l.module_id
     FROM lessons l
     WHERE l.slug = ? LIMIT 1'
);
$stmt->execute([$slug]);
$lesson = $stmt->fetch();
if (!$lesson) jsonError('Lesson not found', 404);

// ── 2. Fetch the module ───────────────────────────────────────────────────────
$modStmt = $db->prepare('SELECT id, title, position, course_id FROM modules WHERE id = ? LIMIT 1');
$modStmt->execute([$lesson['module_id']]);
$module = $modStmt->fetch();
if (!$module) jsonError('Module not found', 500);

// ── 3. Fetch the course ───────────────────────────────────────────────────────
$courseStmt = $db->prepare(
    'SELECT c.id, c.slug, c.title, c.description, c.level, c.duration, c.price, c.is_free,
            a.slug AS academy_slug, a.name AS academy_name
     FROM courses c JOIN academies a ON a.id = c.academy_id
     WHERE c.id = ? LIMIT 1'
);
$courseStmt->execute([$module['course_id']]);
$course = $courseStmt->fetch();
if (!$course) jsonError('Course not found', 500);

// ── 4. All modules with their lessons (sidebar) ───────────────────────────────
$modsStmt = $db->prepare(
    'SELECT id, title, position FROM modules WHERE course_id = ? ORDER BY position'
);
$modsStmt->execute([$module['course_id']]);
$allModules = $modsStmt->fetchAll();

// Flat ordered list for prev/next calculation
$flatLessons = [];

foreach ($allModules as &$m) {
    $lesStmt = $db->prepare(
        'SELECT id, slug, title, type, duration_minutes, position
         FROM lessons WHERE module_id = ? ORDER BY position'
    );
    $lesStmt->execute([$m['id']]);
    $mLessons = $lesStmt->fetchAll();
    $m['lessons'] = $mLessons;
    foreach ($mLessons as $l) {
        $flatLessons[] = $l;
    }
}
unset($m);

// ── 5. Prev / next navigation ─────────────────────────────────────────────────
$currentIdx = -1;
foreach ($flatLessons as $i => $fl) {
    if ($fl['slug'] === $slug) { $currentIdx = $i; break; }
}

$prevLesson = $currentIdx > 0 ? [
    'slug'             => $flatLessons[$currentIdx - 1]['slug'],
    'title'            => $flatLessons[$currentIdx - 1]['title'],
    'duration_minutes' => $flatLessons[$currentIdx - 1]['duration_minutes'],
] : null;

$nextLesson = $currentIdx >= 0 && $currentIdx < count($flatLessons) - 1 ? [
    'slug'             => $flatLessons[$currentIdx + 1]['slug'],
    'title'            => $flatLessons[$currentIdx + 1]['title'],
    'duration_minutes' => $flatLessons[$currentIdx + 1]['duration_minutes'],
] : null;

// ── 6. Fetch lesson resources (PDFs, videos, etc.) ───────────────────────────
$resources = [];
try {
    $resStmt = $db->prepare(
        'SELECT id, type, filename, content_hash, file_url, filesize, mime_type, position
         FROM lesson_resources
         WHERE lesson_id = ?
         ORDER BY position ASC'
    );
    $resStmt->execute([$lesson['id']]);
    $resources = $resStmt->fetchAll();
} catch (Throwable $e) {
    // lesson_resources table may not exist yet — return empty list rather than crashing
    $resources = [];
}

// Sign media on the bridge so Vercel never needs to share the signing secret.
foreach ($resources as &$resource) {
    $resource['serve_url'] = signedMediaUrl(
        'id',
        (string)$resource['id'],
        (string)($resource['filename'] ?? 'file')
    );
}
unset($resource);

$lesson['media_url'] = null;
if (!empty($lesson['video_hash'])) {
    $lesson['media_url'] = signedMediaUrl('hash', (string)$lesson['video_hash'], 'video.mp4');
} elseif (!empty($lesson['video_url']) && preg_match('#/pluginfile\.php/#i', (string)$lesson['video_url'])) {
    $sourceUrl = cleanMoodleSourceUrl((string)$lesson['video_url']);
    $lesson['media_url'] = signedMediaUrl('url', $sourceUrl, filenameFromUrl($sourceUrl));
} elseif (!empty($lesson['content']) && preg_match(
    '/<(?:source|video)\b[^>]*\bsrc=["\'](https?:\/\/[^"\']*\/pluginfile\.php\/[^"\']+)["\']/i',
    (string)$lesson['content'],
    $mediaMatch
)) {
    $sourceUrl = cleanMoodleSourceUrl($mediaMatch[1]);
    $lesson['media_url'] = signedMediaUrl('url', $sourceUrl, filenameFromUrl($sourceUrl));
}

// ── 7. Return ─────────────────────────────────────────────────────────────────
jsonOk([
    'lesson'      => $lesson,
    'module'      => [
        'id'       => $module['id'],
        'title'    => $module['title'],
        'position' => (int)$module['position'],
    ],
    'course'      => [
        'id'          => $course['id'],
        'slug'        => $course['slug'],
        'title'       => $course['title'],
        'academy_slug'=> $course['academy_slug'],
        'academy_name'=> $course['academy_name'],
        'level'       => $course['level'],
        'price'       => (float)$course['price'],
        'is_free'     => (bool)$course['is_free'],
    ],
    'all_modules' => $allModules,
    'prev_lesson' => $prevLesson,
    'next_lesson' => $nextLesson,
    'resources'   => $resources,
]);
