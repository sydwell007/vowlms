<?php
/**
 * GET   /admin/career-courses
 * PATCH /admin/career-courses/{slug} { "status": "draft|published|archived" }
 *
 * Admin-only release gate for the 37 SAVVA career courses. Publishing is
 * refused until a course has modules, lessons, an assessment, and complete
 * Thandi coverage for every text lesson.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/savva_career_pricing.php';
ob_end_clean();

setCors();
requireBridgeKey();
$auth = requireAuth();
requireRole($auth, 'admin');

function fetchCareerCourse(PDO $db, string $slug): ?array
{
    $stmt = $db->prepare(
        "SELECT c.slug,c.title,c.status,c.price,
          COUNT(DISTINCT m.id) AS module_count,
          COUNT(DISTINCT l.id) AS lesson_count,
          COUNT(DISTINCT ass.id) AS assessment_count,
          SUM(CASE WHEN l.type='text' THEN 1 ELSE 0 END) AS lecture_count,
          SUM(CASE WHEN l.type='text' AND l.vowhuman_enabled=1 AND l.vowhuman_presenter_name='Thandi' THEN 1 ELSE 0 END) AS thandi_count
         FROM courses c
         LEFT JOIN modules m ON m.course_id=c.id
         LEFT JOIN lessons l ON l.module_id=m.id
         LEFT JOIN assessments ass ON ass.course_id=c.id
         WHERE c.slug=? GROUP BY c.id LIMIT 1"
    );
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) return null;
    foreach (['module_count','lesson_count','assessment_count','lecture_count','thandi_count'] as $key) {
        $row[$key] = (int)$row[$key];
    }
    $row['launch_ready'] = $row['module_count'] > 1
        && $row['lesson_count'] > 1
        && $row['assessment_count'] > 0
        && $row['lecture_count'] === $row['thandi_count'];
    return $row;
}

$db = getDb();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$slug = trim((string)($_GET['slug'] ?? ''));

if ($method === 'GET') {
    $records = [];
    foreach (savvaCareerCourseSlugs() as $courseSlug) {
        $record = fetchCareerCourse($db, $courseSlug);
        if ($record) $records[] = $record;
    }
    jsonOk(['courses' => $records, 'expected' => count(savvaCareerCourseSlugs())]);
}

if ($method === 'PATCH') {
    if (!isSavvaCareerCourse($slug)) jsonError('Career course not found', 404);
    $body = getJsonBody();
    $status = trim((string)($body['status'] ?? ''));
    if (!in_array($status, ['draft','published','archived'], true)) jsonError('Invalid course status', 400);

    $course = fetchCareerCourse($db, $slug);
    if (!$course) jsonError('Career course not found', 404);
    if ($status === 'published' && !$course['launch_ready']) {
        jsonError('Course cannot be published until curriculum, assessment, and Thandi coverage checks pass', 409);
    }

    if ($status === 'published') {
        $stmt = $db->prepare('UPDATE courses SET status=?, price=?, is_free=0 WHERE slug=?');
        $stmt->execute([$status, SAVVA_CAREER_COURSE_PRICE_ZAR, $slug]);
    } else {
        $stmt = $db->prepare('UPDATE courses SET status=? WHERE slug=?');
        $stmt->execute([$status, $slug]);
    }
    jsonOk(fetchCareerCourse($db, $slug));
}

jsonError('Method not allowed', 405);
