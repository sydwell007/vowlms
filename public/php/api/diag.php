<?php
/**
 * VowLMS Diagnostic Tool — v2 (correct paths)
 * config/ is at: /home/goalvxiw/api.goalvow.com/config/
 * This file is at: /home/goalvxiw/api.goalvow.com/api/diag.php
 * So config is ONE level up: __DIR__ . '/../config/'
 *
 * DELETE THIS FILE once everything is confirmed working.
 */
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$r = [
    'ok'      => false,
    'time'    => date('c'),
    'php'     => PHP_VERSION,
    'config_path' => __DIR__ . '/../config',
    'env'     => [],
    'db'      => [],
    'tables'  => [],
    'counts'  => [],
    'sample'  => [],
    'errors'  => [],
];

// ── Load env.local.php ────────────────────────────────────────────────────────
$envLocal = __DIR__ . '/../config/env.local.php';
if (file_exists($envLocal)) {
    require_once $envLocal;
    $r['env']['env_local_php'] = '✓ loaded';
} else {
    $r['env']['env_local_php'] = '✗ MISSING at ' . $envLocal;
    $r['errors'][] = 'config/env.local.php not found';
}

// ── Check env vars ────────────────────────────────────────────────────────────
function diagEnv(string $k): ?string {
    $v = getenv($k); if ($v !== false) return (string)$v;
    return $_ENV[$k] ?? null;
}
foreach (['DB_HOST','DB_NAME','DB_USER','DB_PASS','BRIDGE_API_KEY','JWT_SECRET'] as $k) {
    $v = diagEnv($k);
    $r['env'][$k] = ($v !== null && $v !== '') ? '✓ set' : '✗ MISSING';
}
$r['env']['DB_HOST_VAL'] = diagEnv('DB_HOST') ?? '(not set)';
$r['env']['DB_NAME_VAL'] = diagEnv('DB_NAME') ?? '(not set)';
$r['env']['BRIDGE_KEY_LEN'] = strlen(diagEnv('BRIDGE_API_KEY') ?? '') . ' chars';

// ── Bridge key header diagnostics ─────────────────────────────────────────────
$r['bridge_key_debug'] = [
    '_SERVER_HTTP_X_BRIDGE_KEY'  => isset($_SERVER['HTTP_X_BRIDGE_KEY'])  ? 'present ('.strlen($_SERVER['HTTP_X_BRIDGE_KEY']).' chars)' : 'ABSENT',
    '_SERVER_BRIDGE_KEY_HEADER'  => isset($_SERVER['BRIDGE_KEY_HEADER'])  ? 'present ('.strlen($_SERVER['BRIDGE_KEY_HEADER']).' chars)' : 'ABSENT',
    '_GET__bk'                   => isset($_GET['_bk'])                    ? 'present ('.strlen($_GET['_bk']).' chars)'                 : 'ABSENT',
    'getallheaders_available'    => function_exists('getallheaders') ? 'yes' : 'no',
];
if (function_exists('getallheaders')) {
    $all = getallheaders();
    $r['bridge_key_debug']['getallheaders_X_Bridge_Key'] = isset($all['X-Bridge-Key']) ? 'present ('.strlen($all['X-Bridge-Key']).' chars)' : 'ABSENT';
    $r['bridge_key_debug']['getallheaders_x_bridge_key'] = isset($all['x-bridge-key']) ? 'present' : 'absent';
}

// ── DB connection ─────────────────────────────────────────────────────────────
$dbHost = diagEnv('DB_HOST');
$dbName = diagEnv('DB_NAME');
$dbUser = diagEnv('DB_USER');
$dbPass = diagEnv('DB_PASS') ?? '';

if (!$dbHost || !$dbName || !$dbUser) {
    $r['db']['connection'] = '✗ SKIPPED — DB env vars missing';
    echo json_encode($r, JSON_PRETTY_PRINT);
    exit;
}

try {
    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $r['db']['connection'] = '✓ connected';
    $r['ok'] = true;
} catch (Throwable $e) {
    $r['db']['connection'] = '✗ FAILED: ' . $e->getMessage();
    $r['errors'][] = $e->getMessage();
    echo json_encode($r, JSON_PRETTY_PRINT);
    exit;
}

// ── Table checks ──────────────────────────────────────────────────────────────
foreach (['academies','courses','modules','lessons','lesson_resources','users','enrollments','progress'] as $t) {
    try { $pdo->query("SELECT 1 FROM `{$t}` LIMIT 1"); $r['tables'][$t] = '✓'; }
    catch (Throwable $e) { $r['tables'][$t] = '✗ MISSING'; }
}

// ── Row counts ────────────────────────────────────────────────────────────────
foreach (['academies','courses','modules','lessons','lesson_resources'] as $t) {
    try { $r['counts'][$t] = (int) $pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn(); }
    catch (Throwable $e) { $r['counts'][$t] = 'error'; }
}

// ── Sample lesson content ─────────────────────────────────────────────────────
try {
    $row = $pdo->query("SELECT slug, title, CHAR_LENGTH(COALESCE(content,'')) AS content_len, LEFT(COALESCE(content,'(null)'),100) AS preview FROM lessons LIMIT 1")->fetch();
    $r['sample']['first_lesson'] = $row ?: 'no lessons';
} catch (Throwable $e) { $r['sample']['first_lesson'] = 'error'; }

// ── Sample resource ───────────────────────────────────────────────────────────
try {
    $row = $pdo->query("SELECT id, type, filename, LEFT(COALESCE(file_url,'(null)'),80) AS url FROM lesson_resources LIMIT 1")->fetch();
    $r['sample']['first_resource'] = $row ?: 'table OK but empty — import 010_resources_data.sql';
} catch (Throwable $e) { $r['sample']['first_resource'] = '✗ table missing — import 009_lesson_resources.sql'; }

// ── Academy / course JOIN diagnostic ─────────────────────────────────────────
try {
    $academies = $pdo->query("SELECT id, slug, name FROM academies ORDER BY slug")->fetchAll();
    $r['academy_ids'] = array_map(fn($a) => $a['id'] . ' (' . $a['slug'] . ')', $academies);
} catch (Throwable $e) { $r['academy_ids'] = 'error: ' . $e->getMessage(); }

try {
    $row = $pdo->query("SELECT id, slug, academy_id FROM courses LIMIT 1")->fetch();
    $r['sample']['first_course_academy_id'] = $row ? $row['academy_id'] : 'no courses';
} catch (Throwable $e) { $r['sample']['first_course_academy_id'] = 'error'; }

try {
    $row = $pdo->query(
        "SELECT c.id AS course_id, c.academy_id, a.id AS matched_academy
         FROM courses c LEFT JOIN academies a ON a.id = c.academy_id
         LIMIT 1"
    )->fetch();
    $r['sample']['course_academy_join'] = $row
        ? ['course_academy_id' => $row['course_academy_id'] ?? $row['academy_id'], 'matched_academy' => $row['matched_academy'] ?? 'NULL — JOIN BROKEN']
        : 'no courses';
} catch (Throwable $e) { $r['sample']['course_academy_join'] = 'error'; }

// ── Count lessons with empty/null slug ───────────────────────────────────────
try {
    $r['counts']['lessons_empty_slug']  = (int) $pdo->query("SELECT COUNT(*) FROM lessons WHERE slug = '' OR slug IS NULL")->fetchColumn();
    $r['counts']['lessons_with_slug']   = (int) $pdo->query("SELECT COUNT(*) FROM lessons WHERE slug != '' AND slug IS NOT NULL")->fetchColumn();
    $row = $pdo->query("SELECT slug FROM lessons WHERE slug != '' AND slug IS NOT NULL LIMIT 5")->fetchAll(PDO::FETCH_COLUMN);
    $r['sample']['lesson_slugs_sample'] = $row;
} catch (Throwable $e) { $r['counts']['lessons_empty_slug'] = 'error'; }

// ── lesson_resources linkage diagnostic ──────────────────────────────────────
try {
    // How many resources have a lesson_id that actually exists in lessons?
    $r['counts']['resources_linked'] = (int) $pdo->query(
        "SELECT COUNT(*) FROM lesson_resources lr JOIN lessons l ON l.id = lr.lesson_id"
    )->fetchColumn();
    $r['counts']['resources_orphaned'] = (int) $pdo->query(
        "SELECT COUNT(*) FROM lesson_resources lr LEFT JOIN lessons l ON l.id = lr.lesson_id WHERE l.id IS NULL"
    )->fetchColumn();

    // Show the lesson_id values actually stored in resources
    $rows = $pdo->query("SELECT lesson_id, COUNT(*) AS cnt FROM lesson_resources GROUP BY lesson_id LIMIT 5")->fetchAll();
    $r['sample']['resource_lesson_ids'] = $rows;
} catch (Throwable $e) { $r['counts']['resources_linked'] = 'error: ' . $e->getMessage(); }

echo json_encode($r, JSON_PRETTY_PRINT);
