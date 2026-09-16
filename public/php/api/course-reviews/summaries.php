<?php
// Bulk rating summary for every published course — mirrors
// course-enrollment-counts/index.php's shape exactly (one query, keyed by
// real course slug) so the Next.js layer can aggregate grouped Upskilling
// parents the same way it already does for enrollment counts.
//
// Combines BOTH real rating sources a learner can leave: the course-level
// "Rate this course" review (course_evaluations) AND the per-module
// "Rate this Module" survey (module_survey_responses, joined up via
// lessons -> modules.course_id — the same join surveys/submit.php and
// surveys/summary.php already use). Per explicit user decision
// 2026-09-16: each individual module rating counts exactly the same as a
// course rating — a learner who rates 3 modules at 4 stars each and never
// leaves a separate course review contributes three real 4-star ratings to
// the course's average, not one averaged-down vote. total_reviews is
// therefore "how many individual ratings exist" (course reviews + module
// survey ratings combined), matching the "(N)" shown next to the star
// score.
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
            ROUND(AVG(all_ratings.rating), 2) AS average_rating,
            COUNT(all_ratings.rating) AS total_reviews
     FROM courses c
     LEFT JOIN (
         SELECT ce.course_id AS course_id, ce.rating AS rating
         FROM course_evaluations ce
         UNION ALL
         SELECT m.course_id AS course_id, sr.rating AS rating
         FROM module_survey_responses sr
         JOIN lessons l ON l.id = sr.lesson_id
         JOIN modules m ON m.id = l.module_id
     ) all_ratings ON all_ratings.course_id = c.id
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
