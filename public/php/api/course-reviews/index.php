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
$courseSlug = trim($_GET['slug'] ?? '');
if ($courseSlug === '') jsonError('Course slug is required', 400);

$courseStmt = $db->prepare('SELECT id FROM courses WHERE slug = ? AND status = "published" LIMIT 1');
$courseStmt->execute([$courseSlug]);
$course = $courseStmt->fetch();
if (!$course) jsonError('Course not found', 404);
$courseId = $course['id'];

function getReviewSummary(PDO $db, string $courseId): array {
    $summaryStmt = $db->prepare(
        'SELECT COUNT(*) AS total_reviews,
                ROUND(AVG(rating), 1) AS average_rating,
                SUM(CASE WHEN would_recommend = 1 THEN 1 ELSE 0 END) AS recommend_yes,
                SUM(CASE WHEN would_recommend IS NOT NULL THEN 1 ELSE 0 END) AS recommend_total
         FROM course_evaluations
         WHERE course_id = ?'
    );
    $summaryStmt->execute([$courseId]);
    $row = $summaryStmt->fetch();

    $distributionStmt = $db->prepare(
        'SELECT rating, COUNT(*) AS rating_count
         FROM course_evaluations
         WHERE course_id = ?
         GROUP BY rating'
    );
    $distributionStmt->execute([$courseId]);
    $distribution = ['1' => 0, '2' => 0, '3' => 0, '4' => 0, '5' => 0];
    foreach ($distributionStmt->fetchAll() as $ratingRow) {
        $distribution[(string)$ratingRow['rating']] = (int)$ratingRow['rating_count'];
    }

    $reviewsStmt = $db->prepare(
        'SELECT ce.id, ce.rating, ce.instructor_rating, ce.feedback_text,
                ce.would_recommend, ce.created_at, u.name
         FROM course_evaluations ce
         JOIN users u ON u.id = ce.user_id
         WHERE ce.course_id = ? AND ce.feedback_text IS NOT NULL AND TRIM(ce.feedback_text) <> ""
         ORDER BY ce.created_at DESC
         LIMIT 20'
    );
    $reviewsStmt->execute([$courseId]);
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
    jsonOk(getReviewSummary($db, $courseId));
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

    $enrollmentStmt = $db->prepare(
        'SELECT id FROM enrollments
         WHERE user_id = ? AND course_id = ? AND status IN ("active", "completed")
         LIMIT 1'
    );
    $enrollmentStmt->execute([$userId, $courseId]);
    if (!$enrollmentStmt->fetch()) jsonError('Only enrolled learners can review this course', 403);

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
        $courseId,
        $rating,
        $feedback === '' ? null : $feedback,
        $wouldRecommend,
    ]);

    jsonOk(['saved' => true]);
}

jsonError('Method not allowed', 405);
