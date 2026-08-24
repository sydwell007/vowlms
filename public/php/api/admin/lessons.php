<?php
/**
 * GET /admin/lessons?q=... or GET /admin/lessons/{slug}
 * PUT /admin/lessons/{slug}
 *
 * Admin-only structured VowHumans presenter configuration. Raw iframe HTML is
 * never accepted or stored.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
$auth = requireAuth();
requireRole($auth, 'admin');

$db = getDb();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$slug = trim((string)($_GET['slug'] ?? ''));

const PRESENTER_COLUMNS =
    'l.id, l.slug, l.title, l.type, l.duration_minutes,
     l.vowhuman_enabled, l.vowhuman_embed_url, l.vowhuman_presenter_name,
     l.vowhuman_intro, l.vowhuman_placement, l.vowhuman_role,
     l.vowhuman_expertise, l.vowhuman_camera_enabled,
     l.vowhuman_microphone_enabled,
     m.title AS module_title, c.slug AS course_slug, c.title AS course_title,
     a.name AS academy_name';

function normalizePresenterLesson(array $row): array
{
    $row['vowhuman_enabled'] = (bool)$row['vowhuman_enabled'];
    $row['vowhuman_camera_enabled'] = (bool)$row['vowhuman_camera_enabled'];
    $row['vowhuman_microphone_enabled'] = (bool)$row['vowhuman_microphone_enabled'];
    $row['duration_minutes'] = (int)$row['duration_minutes'];
    return $row;
}

function fetchPresenterLesson(PDO $db, string $slug): ?array
{
    $stmt = $db->prepare(
        'SELECT ' . PRESENTER_COLUMNS . '
         FROM lessons l
         JOIN modules m ON m.id = l.module_id
         JOIN courses c ON c.id = m.course_id
         JOIN academies a ON a.id = c.academy_id
         WHERE l.slug = ? LIMIT 1'
    );
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    return $row ? normalizePresenterLesson($row) : null;
}

function isAllowedVowHumansUrl(string $value): bool
{
    if ($value === '' || filter_var($value, FILTER_VALIDATE_URL) === false) return false;
    $parts = parse_url($value);
    if (!is_array($parts)) return false;

    return strtolower((string)($parts['scheme'] ?? '')) === 'https'
        && strtolower((string)($parts['host'] ?? '')) === 'vowhumans.com'
        && !isset($parts['port'])
        && !isset($parts['user'])
        && !isset($parts['pass'])
        && !isset($parts['query'])
        && !isset($parts['fragment'])
        && preg_match('#^/embed/[a-zA-Z0-9-]+/[a-zA-Z0-9-]+/?$#', (string)($parts['path'] ?? '')) === 1;
}

function presenterBoolean(mixed $value): bool
{
    return $value === true || $value === 1 || $value === '1';
}

if ($method === 'GET') {
    try {
        if ($slug !== '') {
            $lesson = fetchPresenterLesson($db, $slug);
            if (!$lesson) jsonError('Lesson not found', 404);
            jsonOk($lesson);
        }

        $query = trim((string)($_GET['q'] ?? ''));
        $sql =
            'SELECT ' . PRESENTER_COLUMNS . '
             FROM lessons l
             JOIN modules m ON m.id = l.module_id
             JOIN courses c ON c.id = m.course_id
             JOIN academies a ON a.id = c.academy_id';
        $params = [];
        if ($query !== '') {
            $sql .= ' WHERE l.slug LIKE ? OR l.title LIKE ? OR c.title LIKE ?';
            $like = '%' . substr($query, 0, 120) . '%';
            $params = [$like, $like, $like];
        }
        $sql .= ' ORDER BY l.vowhuman_enabled DESC, c.title, m.position, l.position LIMIT 50';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $lessons = array_map('normalizePresenterLesson', $stmt->fetchAll());
        jsonOk(['lessons' => $lessons]);
    } catch (PDOException $e) {
        jsonError('VowHumans lesson schema is unavailable. Import migration 018.', 503);
    }
}

if ($method === 'PUT') {
    if ($slug === '') jsonError('Lesson slug is required', 400);
    $body = getJsonBody();

    $enabled = presenterBoolean($body['vowhuman_enabled'] ?? false);
    $embedUrl = trim((string)($body['vowhuman_embed_url'] ?? ''));
    $presenterName = trim((string)($body['vowhuman_presenter_name'] ?? ''));
    $intro = trim((string)($body['vowhuman_intro'] ?? ''));
    $placement = trim((string)($body['vowhuman_placement'] ?? 'before-content'));
    $role = trim((string)($body['vowhuman_role'] ?? 'presenter'));
    $expertise = trim((string)($body['vowhuman_expertise'] ?? ''));
    $cameraEnabled = presenterBoolean($body['vowhuman_camera_enabled'] ?? false);
    $microphoneEnabled = presenterBoolean($body['vowhuman_microphone_enabled'] ?? false);

    $placements = ['after-introduction', 'before-content', 'after-content'];
    $roles = ['presenter', 'mentor', 'tutor', 'field-expert'];

    if ($embedUrl !== '' && !isAllowedVowHumansUrl($embedUrl)) {
        jsonError('Use an approved https://vowhumans.com/embed/{id}/{slug} URL', 400);
    }
    if ($enabled && $embedUrl === '') jsonError('Presenter embed URL is required', 400);
    if ($enabled && $presenterName === '') jsonError('Presenter name is required', 400);
    if ($enabled && $intro === '') jsonError('Presenter introduction is required', 400);
    if (!in_array($placement, $placements, true)) jsonError('Invalid presenter placement', 400);
    if (!in_array($role, $roles, true)) jsonError('Invalid presenter role', 400);
    if (strlen($presenterName) > 150) jsonError('Presenter name is too long', 400);
    if (strlen($intro) > 1000) jsonError('Presenter introduction is too long', 400);
    if (strlen($expertise) > 180) jsonError('Presenter expertise is too long', 400);

    try {
        $exists = fetchPresenterLesson($db, $slug);
        if (!$exists) jsonError('Lesson not found', 404);

        $stmt = $db->prepare(
            'UPDATE lessons SET
               vowhuman_enabled = ?, vowhuman_embed_url = ?,
               vowhuman_presenter_name = ?, vowhuman_intro = ?,
               vowhuman_placement = ?, vowhuman_role = ?,
               vowhuman_expertise = ?, vowhuman_camera_enabled = ?,
               vowhuman_microphone_enabled = ?
             WHERE slug = ?'
        );
        $stmt->execute([
            $enabled ? 1 : 0,
            $embedUrl !== '' ? $embedUrl : null,
            $presenterName !== '' ? $presenterName : null,
            $intro !== '' ? $intro : null,
            $placement,
            $role,
            $expertise !== '' ? $expertise : null,
            $cameraEnabled ? 1 : 0,
            $microphoneEnabled ? 1 : 0,
            $slug,
        ]);

        jsonOk(fetchPresenterLesson($db, $slug));
    } catch (PDOException $e) {
        jsonError('VowHumans lesson schema is unavailable. Import migration 018.', 503);
    }
}

jsonError('Method not allowed', 405);
