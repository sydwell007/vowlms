<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $courseSlug = $_GET['courseSlug'] ?? '';
    if (!$courseSlug) jsonError('courseSlug is required');

    $stmt = $db->prepare(
        'SELECT cert.* FROM certificates cert
         JOIN courses c ON c.id = cert.course_id
         WHERE cert.user_id = ? AND c.slug = ? LIMIT 1'
    );
    $stmt->execute([$userId, $courseSlug]);
    $cert = $stmt->fetch();
    if (!$cert) jsonError('Certificate not found', 404);
    jsonOk($cert);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = getJsonBody();
    $courseSlug = trim($body['courseSlug'] ?? '');
    if (!$courseSlug) jsonError('courseSlug is required');

    // Find course
    $cStmt = $db->prepare('SELECT id, title FROM courses WHERE slug = ? LIMIT 1');
    $cStmt->execute([$courseSlug]);
    $course = $cStmt->fetch();
    if (!$course) jsonError('Course not found', 404);

    // Verify enrollment is complete
    $enr = $db->prepare('SELECT progress FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1');
    $enr->execute([$userId, $course['id']]);
    $enrollment = $enr->fetch();
    if (!$enrollment) jsonError('Not enrolled in this course', 403);
    if ((int)$enrollment['progress'] < 100) jsonError('Course not yet completed', 400);

    // Return existing certificate if already issued (idempotent)
    $existing = $db->prepare('SELECT * FROM certificates WHERE user_id = ? AND course_id = ? LIMIT 1');
    $existing->execute([$userId, $course['id']]);
    $cert = $existing->fetch();
    if ($cert) jsonOk($cert);

    // Get learner name
    $uStmt = $db->prepare('SELECT name FROM users WHERE id = ? LIMIT 1');
    $uStmt->execute([$userId]);
    $learnerName = $uStmt->fetchColumn() ?: 'GoalVow Learner';

    $certId  = 'VOWLMS-' . strtoupper(substr(preg_replace('/[^a-z0-9]/', '', $courseSlug), 0, 10)) . '-' . date('Y');
    $newId   = generateId();
    $issuedAt = date('Y-m-d H:i:s');

    $db->prepare(
        'INSERT INTO certificates (id, user_id, course_id, certificate_id, learner_name, course_name, issued_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    )->execute([$newId, $userId, $course['id'], $certId, $learnerName, $course['title'], $issuedAt]);

    // Award +200 pts
    $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
       ->execute([generateId(), $userId, 'certificate_issued', 200]);

    jsonCreated([
        'id'             => $newId,
        'certificateId'  => $certId,
        'learnerName'    => $learnerName,
        'courseName'     => $course['title'],
        'completionDate' => date('j F Y', strtotime($issuedAt)),
        'issuedAt'       => $issuedAt,
    ]);
}

jsonError('Method not allowed', 405);
