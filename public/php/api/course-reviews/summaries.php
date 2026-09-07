<?php
// Bulk rating summary for every published course — mirrors
// course-enrollment-counts/index.php's shape exactly (one query, keyed by
// real course slug) so the Next.js layer can aggregate grouped Upskilling
// parents the same way it already does for enrollment counts.
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
    'SELECT c.slug,
            ROUND(AVG(ce.rating), 2) AS average_rating,
            COUNT(ce.id) AS total_reviews
     FROM courses c
     LEFT JOIN course_evaluations ce ON ce.course_id = c.id
     WHERE c.status = "published"
     GROUP BY c.id, c.slug'
);

$summaries = [];
foreach ($stmt->fetchAll() as $row) {
    $totalReviews = (int)$row['total_reviews'];
    $summaries[(string)$row['slug']] = [
        'averageRating' => $totalReviews > 0 ? (float)$row['average_rating'] : null,
        'totalReviews' => $totalReviews,
    ];
}

jsonOk($summaries);
