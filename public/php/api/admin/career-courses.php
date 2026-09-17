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
ob_end_clean();

setCors();
requireBridgeKey();
$auth = requireAuth();
requireRole($auth, 'admin');

const CAREER_COURSE_SLUGS = [
    'adobe-after-effects','adobe-animate','adobe-illustrator','adobe-indesign','adobe-photoshop','adobe-premiere-pro',
    'space-travel-and-solar-system','agriscience-1','agriscience-2','agriscience-3',
    'architectural-design-1','architectural-design-2','architectural-design-3','augmented-and-virtual-reality',
    'drones-remote-pilot','entrepreneurship-and-small-business','startups-and-innovation',
    'early-childhood-education-1','early-childhood-education-2','education-and-teaching-advanced',
    'fundamentals-of-bitcoin-and-crypto','fundamentals-of-blockchain-and-crypto','introduction-to-ai','robotics','smart-cities',
    'teaching-as-a-profession','transportation-technologies','wearable-technology','swift-app-development','java-se-8-associate',
    'intuit-design-for-delight','career-exploration','digital-information-technology','meta-social-media-marketing',
    'social-media-marketing','building-maintenance-technology-1','building-maintenance-technology-2'
];

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
    foreach (CAREER_COURSE_SLUGS as $courseSlug) {
        $record = fetchCareerCourse($db, $courseSlug);
        if ($record) $records[] = $record;
    }
    jsonOk(['courses' => $records, 'expected' => count(CAREER_COURSE_SLUGS)]);
}

if ($method === 'PATCH') {
    if (!in_array($slug, CAREER_COURSE_SLUGS, true)) jsonError('Career course not found', 404);
    $body = getJsonBody();
    $status = trim((string)($body['status'] ?? ''));
    if (!in_array($status, ['draft','published','archived'], true)) jsonError('Invalid course status', 400);

    $course = fetchCareerCourse($db, $slug);
    if (!$course) jsonError('Career course not found', 404);
    if ($status === 'published' && !$course['launch_ready']) {
        jsonError('Course cannot be published until curriculum, assessment, and Thandi coverage checks pass', 409);
    }

    $stmt = $db->prepare('UPDATE courses SET status=? WHERE slug=?');
    $stmt->execute([$status, $slug]);
    jsonOk(fetchCareerCourse($db, $slug));
}

jsonError('Method not allowed', 405);
