<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/response.php';

setCors();
requireBridgeKey();

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        'SELECT e.*, c.title AS course_title, c.slug AS course_slug,
                c.description, c.level, c.duration, c.price, c.is_free,
                a.name AS academy_name, a.slug AS academy_slug
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         JOIN academies a ON a.id = c.academy_id
         WHERE e.user_id = ?
         ORDER BY e.enrolled_at DESC'
    );
    $stmt->execute([$userId]);
    jsonOk($stmt->fetchAll());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = getJsonBody();
    $courseSlug = trim($body['courseSlug'] ?? '');
    if (!$courseSlug) jsonError('courseSlug is required');

    // Find course
    $cStmt = $db->prepare('SELECT id, title, price, is_free FROM courses WHERE slug = ? AND status = "published" LIMIT 1');
    $cStmt->execute([$courseSlug]);
    $course = $cStmt->fetch();
    if (!$course) jsonError('Course not found', 404);

    // Already enrolled?
    $existing = $db->prepare('SELECT id, status, progress FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1');
    $existing->execute([$userId, $course['id']]);
    $enr = $existing->fetch();
    if ($enr) jsonOk($enr); // Return existing enrollment

    // Paid course — check payment
    if (!$course['is_free'] && (float)$course['price'] > 0) {
        $paid = $db->prepare('SELECT id FROM payments WHERE user_id = ? AND course_id = ? AND status = "paid" LIMIT 1');
        $paid->execute([$userId, $course['id']]);
        if (!$paid->fetch()) jsonError('Payment required before enrolling in this course', 402);
    }

    $enrId = generateId();
    $db->prepare('INSERT INTO enrollments (id, user_id, course_id, status, progress) VALUES (?, ?, ?, "active", 0)')
       ->execute([$enrId, $userId, $course['id']]);

    // Reward +50 pts
    $db->prepare('INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)')
       ->execute([generateId(), $userId, 'enroll', 50, json_encode(['courseSlug' => $courseSlug])]);

    jsonCreated([
        'enrollmentId' => $enrId,
        'courseSlug'   => $courseSlug,
        'status'       => 'active',
        'progress'     => 0,
    ]);
}

jsonError('Method not allowed', 405);
