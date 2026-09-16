<?php
/**
 * Temporary diagnostic — confirms the "every individual rating counts
 * separately" combined query returns sane numbers before trusting it live.
 * Read-only. Delete once confirmed.
 */
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

$rows = $db->query(
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
     GROUP BY c.id, c.slug
     HAVING total_reviews > 0
     ORDER BY total_reviews DESC'
)->fetchAll();

$moduleSurveyDetail = $db->query(
    "SELECT c.slug, sr.rating, sr.user_id
     FROM module_survey_responses sr
     JOIN lessons l ON l.id = sr.lesson_id
     JOIN modules m ON m.id = l.module_id
     JOIN courses c ON c.id = m.course_id"
)->fetchAll();

jsonOk(['ratings' => $rows, 'moduleSurveyDetail' => $moduleSurveyDetail]);
