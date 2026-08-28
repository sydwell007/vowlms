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

$db = getDb();
$stmt = $db->query(
    'SELECT c.slug, COUNT(e.id) AS enrollment_count
     FROM courses c
     LEFT JOIN enrollments e
       ON e.course_id = c.id
      AND e.status IN ("active", "completed")
     WHERE c.status = "published"
     GROUP BY c.id, c.slug'
);

$counts = [];
foreach ($stmt->fetchAll() as $row) {
    $counts[(string)$row['slug']] = (int)$row['enrollment_count'];
}

jsonOk($counts);
