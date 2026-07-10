<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

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

    try {
        $db->beginTransaction();

        $cStmt = $db->prepare('SELECT id, title FROM courses WHERE slug = ? LIMIT 1');
        $cStmt->execute([$courseSlug]);
        $course = $cStmt->fetch();
        if (!$course) {
            $db->rollBack();
            jsonError('Course not found', 404);
        }

        $enr = $db->prepare(
            'SELECT progress FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1 FOR UPDATE'
        );
        $enr->execute([$userId, $course['id']]);
        $enrollment = $enr->fetch();
        if (!$enrollment) {
            $db->rollBack();
            jsonError('Not enrolled in this course', 403);
        }
        if ((int)$enrollment['progress'] < 100) {
            $db->rollBack();
            jsonError('Course not yet completed', 400);
        }

        $existing = $db->prepare(
            'SELECT * FROM certificates WHERE user_id = ? AND course_id = ? LIMIT 1 FOR UPDATE'
        );
        $existing->execute([$userId, $course['id']]);
        $cert = $existing->fetch();
        if ($cert) {
            $db->commit();
            jsonOk($cert);
        }

        $uStmt = $db->prepare('SELECT name FROM users WHERE id = ? LIMIT 1');
        $uStmt->execute([$userId]);
        $learnerName = $uStmt->fetchColumn() ?: 'GoalVow Learner';

        $courseCode = strtoupper(substr(preg_replace('/[^a-z0-9]/', '', strtolower($courseSlug)), 0, 10));
        $certId  = 'VOWLMS-' . $courseCode . '-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));
        $newId   = generateId();
        $issuedAt = date('Y-m-d H:i:s');

        $db->prepare(
            'INSERT INTO certificates (id, user_id, course_id, certificate_id, learner_name, course_name, issued_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([$newId, $userId, $course['id'], $certId, $learnerName, $course['title'], $issuedAt]);

        $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
           ->execute([generateId(), $userId, 'certificate_issued', 200]);

        $db->commit();
        jsonCreated([
            'id'             => $newId,
            'certificateId'  => $certId,
            'learnerName'    => $learnerName,
            'courseName'     => $course['title'],
            'completionDate' => date('j F Y', strtotime($issuedAt)),
            'issuedAt'       => $issuedAt,
        ]);
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        error_log('Certificate generation failed: ' . $error->getMessage());
        jsonError('Certificate could not be issued', 500);
    }
}

jsonError('Method not allowed', 405);
