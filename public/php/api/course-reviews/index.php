<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();

$db = getDb();

// A VowLMS "course" the learner sees (e.g. "career-management") is often a
// virtual parent assembled from several real, individually Moodle-migrated
// child courses — the parent slug itself never has its own row in `courses`.
// The Next.js route already resolves this and sends every real child slug
// here, comma-separated, so reviews aggregate across all of them instead of
// 404ing on a slug that was never meant to exist in this table.
$courseSlugs = array_values(array_filter(array_map('trim', explode(',', $_GET['slug'] ?? ''))));
if (empty($courseSlugs)) jsonError('Course slug is required', 400);

$placeholders = implode(',', array_fill(0, count($courseSlugs), '?'));
$courseStmt = $db->prepare("SELECT id FROM courses WHERE slug IN ({$placeholders}) AND status = 'published'");
$courseStmt->execute($courseSlugs);
$courseIds = array_column($courseStmt->fetchAll(), 'id');
if (empty($courseIds)) jsonError('Course not found', 404);
// Reviews of a grouped course are attached to its first real child module —
// a stable, deterministic target so repeat submissions from the same learner
// update one row (see the ON DUPLICATE KEY UPDATE below) instead of piling up.
$primaryCourseId = $courseIds[0];

function getReviewSummary(PDO $db, array $courseIds): array {
    $idPlaceholders = implode(',', array_fill(0, count($courseIds), '?'));

    $summaryStmt = $db->prepare(
        "SELECT COUNT(*) AS total_reviews,
                ROUND(AVG(rating), 1) AS average_rating,
                SUM(CASE WHEN would_recommend = 1 THEN 1 ELSE 0 END) AS recommend_yes,
                SUM(CASE WHEN would_recommend IS NOT NULL THEN 1 ELSE 0 END) AS recommend_total
         FROM course_evaluations
         WHERE course_id IN ({$idPlaceholders})"
    );
    $summaryStmt->execute($courseIds);
    $row = $summaryStmt->fetch();

    $distributionStmt = $db->prepare(
        "SELECT rating, COUNT(*) AS rating_count
         FROM course_evaluations
         WHERE course_id IN ({$idPlaceholders})
         GROUP BY rating"
    );
    $distributionStmt->execute($courseIds);
    $distribution = ['1' => 0, '2' => 0, '3' => 0, '4' => 0, '5' => 0];
    foreach ($distributionStmt->fetchAll() as $ratingRow) {
        $distribution[(string)$ratingRow['rating']] = (int)$ratingRow['rating_count'];
    }

    $reviewsStmt = $db->prepare(
        "SELECT ce.id, ce.rating, ce.instructor_rating, ce.feedback_text,
                ce.would_recommend, ce.created_at, u.name
         FROM course_evaluations ce
         JOIN users u ON u.id = ce.user_id
         WHERE ce.course_id IN ({$idPlaceholders}) AND ce.feedback_text IS NOT NULL AND TRIM(ce.feedback_text) <> ''
         ORDER BY ce.created_at DESC
         LIMIT 20"
    );
    $reviewsStmt->execute($courseIds);
    $reviews = array_map(static function (array $review): array {
        $firstName = preg_split('/\s+/', trim((string)$review['name']))[0] ?: 'Learner';
        return [
            'id' => $review['id'],
            'learnerName' => $firstName,
            'rating' => (int)$review['rating'],
            'instructorRating' => $review['instructor_rating'] === null ? null : (int)$review['instructor_rating'],
            'feedback' => (string)$review['feedback_text'],
            'wouldRecommend' => $review['would_recommend'] === null ? null : (bool)$review['would_recommend'],
            'createdAt' => $review['created_at'],
        ];
    }, $reviewsStmt->fetchAll());

    $recommendTotal = (int)($row['recommend_total'] ?? 0);
    return [
        'averageRating' => $row['average_rating'] === null ? null : (float)$row['average_rating'],
        'totalReviews' => (int)($row['total_reviews'] ?? 0),
        'recommendationPercent' => $recommendTotal === 0
            ? null
            : (int)round(((int)$row['recommend_yes'] / $recommendTotal) * 100),
        'distribution' => $distribution,
        'reviews' => $reviews,
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    jsonOk(getReviewSummary($db, $courseIds));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = requireAuth();
    requireRole($payload, 'learner');
    $userId = $payload['sub'];
    $body = getJsonBody();

    $rating = filter_var($body['rating'] ?? null, FILTER_VALIDATE_INT);
    if ($rating === false || $rating < 1 || $rating > 5) jsonError('Choose a rating from 1 to 5', 400);

    $feedback = trim((string)($body['feedback'] ?? ''));
    if (mb_strlen($feedback) > 1500) jsonError('Feedback must be 1,500 characters or fewer', 400);
    $wouldRecommend = array_key_exists('wouldRecommend', $body) ? (int)(bool)$body['wouldRecommend'] : null;

    // Enrolled in ANY child module of this grouping is enough to review the
    // course as a whole — enrolling in a grouped parent creates one real
    // enrollment row per child course, not one per parent.
    $enrollIdPlaceholders = implode(',', array_fill(0, count($courseIds), '?'));
    $enrollmentStmt = $db->prepare(
        "SELECT id FROM enrollments
         WHERE user_id = ? AND course_id IN ({$enrollIdPlaceholders}) AND status IN ('active', 'completed')
         LIMIT 1"
    );
    $enrollmentStmt->execute([$userId, ...$courseIds]);
    if (!$enrollmentStmt->fetch()) jsonError('Only enrolled learners can review this course', 403);

    // If the learner already reviewed a different child module of this same
    // grouping (e.g. under an older single-course review), keep updating
    // that same row instead of creating a second review for one course.
    $existingStmt = $db->prepare(
        "SELECT course_id FROM course_evaluations
         WHERE user_id = ? AND course_id IN ({$enrollIdPlaceholders})
         LIMIT 1"
    );
    $existingStmt->execute([$userId, ...$courseIds]);
    $existing = $existingStmt->fetch();
    $targetCourseId = $existing['course_id'] ?? $primaryCourseId;

    $reviewStmt = $db->prepare(
        'INSERT INTO course_evaluations
            (id, user_id, course_id, rating, instructor_rating, feedback_text, would_recommend)
         VALUES (?, ?, ?, ?, NULL, ?, ?)
         ON DUPLICATE KEY UPDATE
            rating = VALUES(rating),
            feedback_text = VALUES(feedback_text),
            would_recommend = VALUES(would_recommend),
            created_at = CURRENT_TIMESTAMP'
    );
    $reviewStmt->execute([
        generateId(),
        $userId,
        $targetCourseId,
        $rating,
        $feedback === '' ? null : $feedback,
        $wouldRecommend,
    ]);

    jsonOk(['saved' => true]);
}

jsonError('Method not allowed', 405);
