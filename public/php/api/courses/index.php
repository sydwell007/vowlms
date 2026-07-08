<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('GET');

$db   = getDb();
$slug = $_GET['slug'] ?? '';

if ($slug !== '') {
    // Single course with modules + lessons
    $stmt = $db->prepare(
        'SELECT c.*, a.slug AS academy_slug, a.name AS academy_name
         FROM courses c JOIN academies a ON a.id = c.academy_id
         WHERE c.slug = ? AND c.status = "published" LIMIT 1'
    );
    $stmt->execute([$slug]);
    $course = $stmt->fetch();
    if (!$course) jsonError('Course not found', 404);

    // Modules
    $mods = $db->prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY position');
    $mods->execute([$course['id']]);
    $modules = $mods->fetchAll();

    foreach ($modules as &$mod) {
        $les = $db->prepare('SELECT * FROM lessons WHERE module_id = ? ORDER BY position');
        $les->execute([$mod['id']]);
        $mod['lessons'] = $les->fetchAll();
    }
    unset($mod);

    $course['modules'] = $modules;
    jsonOk($course);
}

// List all (or filtered)
$academy = $_GET['academy'] ?? '';
$level   = $_GET['level'] ?? '';
$free    = $_GET['free'] ?? '';
$page    = max(1, (int)($_GET['page'] ?? 1));
$limit   = min(200, max(1, (int)($_GET['limit'] ?? 100)));
$offset  = ($page - 1) * $limit;

$where  = ['c.status = "published"'];
$params = [];

if ($academy !== '') { $where[] = 'a.slug = ?'; $params[] = $academy; }
if ($level !== '')   { $where[] = 'c.level = ?'; $params[] = $level; }
if ($free !== '')    { $where[] = 'c.is_free = ?'; $params[] = (int)($free === '1'); }

$whereClause = implode(' AND ', $where);

$total = $db->prepare("SELECT COUNT(*) FROM courses c JOIN academies a ON a.id = c.academy_id WHERE {$whereClause}");
$total->execute($params);
$totalCount = (int)$total->fetchColumn();

$stmt = $db->prepare(
    "SELECT c.id, c.slug, c.title, c.description, c.level, c.duration, c.price, c.is_free, c.status,
            a.slug AS academy_slug, a.name AS academy_name
     FROM courses c JOIN academies a ON a.id = c.academy_id
     WHERE {$whereClause}
     ORDER BY c.title ASC
     LIMIT {$limit} OFFSET {$offset}"
);
$stmt->execute($params);
$courses = $stmt->fetchAll();

jsonOk([
    'courses'    => $courses,
    'total'      => $totalCount,
    'page'       => $page,
    'limit'      => $limit,
    'totalPages' => (int)ceil($totalCount / $limit),
]);
