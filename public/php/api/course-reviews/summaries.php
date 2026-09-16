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
// surveys/summary.php already use). A learner who leaves both a course
// review and several module surveys must not get counted (or weighted)
// several times over — the inner subquery first collapses every rating a
// single user left for a single course (their course review, plus every
// module survey rating for that course) into ONE combined per-user rating,
// and only THEN averages across users. total_reviews is therefore "how
// many learners rated this course", not "how many individual rating rows
// exist" — consistent with what a review count normally means to a reader.
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
            ROUND(AVG(ur.combined_rating), 2) AS average_rating,
            COUNT(ur.combined_rating) AS total_reviews
     FROM courses c
     LEFT JOIN (
         SELECT course_id, user_id, AVG(rating) AS combined_rating
         FROM (
             SELECT ce.course_id AS course_id, ce.user_id AS user_id, ce.rating AS rating
             FROM course_evaluations ce
             UNION ALL
             SELECT m.course_id AS course_id, sr.user_id AS user_id, sr.rating AS rating
             FROM module_survey_responses sr
             JOIN lessons l ON l.id = sr.lesson_id
             JOIN modules m ON m.id = l.module_id
         ) all_ratings
         GROUP BY course_id, user_id
     ) ur ON ur.course_id = c.id
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
