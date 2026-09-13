<?php
/**
 * Admin-only aggregate view of every module's survey responses — surfaces
 * what actually needs attention (low average rating, or few responses so
 * far) rather than making an admin scroll through raw rows one at a time.
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

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$db = getDb();

// One row per "Rate this Module" lesson, aggregated across all responses.
$rows = $db->query(
    "SELECT
        l.id AS lesson_id,
        l.slug AS lesson_slug,
        c.slug AS course_slug,
        c.title AS course_title,
        m.title AS module_title,
        COUNT(sr.id) AS response_count,
        ROUND(AVG(sr.rating), 2) AS average_rating,
        SUM(CASE WHEN sr.rating <= 2 THEN 1 ELSE 0 END) AS low_rating_count
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     JOIN courses c ON c.id = m.course_id
     LEFT JOIN module_survey_responses sr ON sr.lesson_id = l.id
     WHERE l.slug LIKE '%-rate-this-module'
     GROUP BY l.id, l.slug, c.slug, c.title, m.title
     ORDER BY average_rating IS NULL, average_rating ASC, response_count DESC"
)->fetchAll();

$flagged = [];
$recentFeedback = [];

foreach ($rows as $row) {
    $avg = $row['average_rating'] !== null ? (float)$row['average_rating'] : null;
    $needsAttention = ($avg !== null && $avg < 3.5) || (int)$row['low_rating_count'] > 0;
    if ($needsAttention) {
        $flagged[] = [
            'courseTitle' => $row['course_title'],
            'moduleTitle' => $row['module_title'],
            'averageRating' => $avg,
            'responseCount' => (int)$row['response_count'],
            'lowRatingCount' => (int)$row['low_rating_count'],
        ];
    }
}

// A handful of the most recent low-rating (<=3) written comments across
// every module — the fastest way for an admin to read what learners are
// actually unhappy about, not just see a number.
$commentsStmt = $db->query(
    "SELECT c.title AS course_title, m.title AS module_title, sr.rating, sr.liked, sr.improve, sr.updated_at
     FROM module_survey_responses sr
     JOIN lessons l ON l.id = sr.lesson_id
     JOIN modules m ON m.id = l.module_id
     JOIN courses c ON c.id = m.course_id
     WHERE sr.rating <= 3 AND (sr.improve IS NOT NULL OR sr.liked IS NOT NULL)
     ORDER BY sr.updated_at DESC
     LIMIT 20"
);
$recentFeedback = $commentsStmt->fetchAll();

jsonOk([
    'modules' => $rows,
    'flagged' => $flagged,
    'recentLowRatingFeedback' => $recentFeedback,
]);
