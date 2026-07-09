<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$db   = getDb();
$slug = $_GET['slug'] ?? '';

if ($slug !== '') {
    $stmt = $db->prepare('SELECT * FROM academies WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $academy = $stmt->fetch();
    if (!$academy) jsonError('Academy not found', 404);

    // Course count
    $cnt = $db->prepare('SELECT COUNT(*) FROM courses WHERE academy_id = ? AND status = "published"');
    $cnt->execute([$academy['id']]);
    $academy['courseCount'] = (int)$cnt->fetchColumn();

    jsonOk($academy);
}

// All academies with course count
$stmt = $db->prepare(
    'SELECT a.*, COUNT(c.id) AS course_count
     FROM academies a
     LEFT JOIN courses c ON c.academy_id = a.id AND c.status = "published"
     GROUP BY a.id ORDER BY a.name'
);
$stmt->execute();
jsonOk($stmt->fetchAll());
