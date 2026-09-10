<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/mail.php';
ob_end_clean();

setCors();
requireBridgeKey();

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $courseSlug = $_GET['courseSlug'] ?? '';
    $anchorCourseSlug = $_GET['anchorCourseSlug'] ?? $courseSlug;
    if (!$courseSlug) jsonError('courseSlug is required');

    $stmt = $db->prepare(
        'SELECT cert.* FROM certificates cert
         JOIN courses c ON c.id = cert.course_id
         WHERE cert.user_id = ? AND c.slug = ? LIMIT 1'
    );
    $stmt->execute([$userId, $anchorCourseSlug]);
    $cert = $stmt->fetch();
    if (!$cert) jsonError('Certificate not found', 404);
    jsonOk($cert);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body            = getJsonBody();
    $courseSlug      = trim($body['courseSlug'] ?? '');
    $courseName      = trim($body['courseName'] ?? '');
    $anchorCourseSlug = trim($body['anchorCourseSlug'] ?? '');
    $courseSlugs     = $body['courseSlugs'] ?? [];
    if (!$courseSlug || !$courseName || !$anchorCourseSlug || !is_array($courseSlugs)) jsonError('Invalid certificate request');
    $courseSlugs = array_values(array_unique(array_filter($courseSlugs, fn($slug) => is_string($slug) && preg_match('/^[a-z0-9-]{2,120}$/', $slug))));
    if (count($courseSlugs) === 0 || count($courseSlugs) > 30 || !in_array($anchorCourseSlug, $courseSlugs, true)) jsonError('Invalid certificate course list');

    try {
        $db->beginTransaction();

        $placeholders = implode(',', array_fill(0, count($courseSlugs), '?'));
        $cStmt = $db->prepare("SELECT id, slug FROM courses WHERE slug IN ({$placeholders}) FOR UPDATE");
        $cStmt->execute($courseSlugs);
        $courses = $cStmt->fetchAll();
        if (count($courses) !== count($courseSlugs)) {
            $db->rollBack();
            jsonError('Course not found', 404);
        }

        $courseIds = array_column($courses, 'id');
        $courseBySlug = [];
        foreach ($courses as $course) $courseBySlug[$course['slug']] = $course;
        $anchorCourse = $courseBySlug[$anchorCourseSlug] ?? null;
        if (!$anchorCourse) {
            $db->rollBack();
            jsonError('Certificate course not found', 404);
        }

        $idPlaceholders = implode(',', array_fill(0, count($courseIds), '?'));
        $enr = $db->prepare("SELECT course_id, progress FROM enrollments WHERE user_id = ? AND course_id IN ({$idPlaceholders}) FOR UPDATE");
        $enr->execute(array_merge([$userId], $courseIds));
        $enrollments = $enr->fetchAll();
        if (count($enrollments) !== count($courseIds) || count(array_filter($enrollments, fn($row) => (int)$row['progress'] < 100)) > 0) {
            $db->rollBack();
            jsonError('Complete every course module before a certificate can be issued', 400);
        }

        $assessmentStmt = $db->prepare("SELECT id FROM assessments WHERE course_id IN ({$idPlaceholders})");
        $assessmentStmt->execute($courseIds);
        $assessmentIds = array_column($assessmentStmt->fetchAll(), 'id');
        if (count($assessmentIds) > 0) {
            $assessmentPlaceholders = implode(',', array_fill(0, count($assessmentIds), '?'));
            $passedStmt = $db->prepare("SELECT DISTINCT assessment_id FROM assessment_attempts WHERE user_id = ? AND passed = 1 AND assessment_id IN ({$assessmentPlaceholders})");
            $passedStmt->execute(array_merge([$userId], $assessmentIds));
            if (count($passedStmt->fetchAll()) !== count($assessmentIds)) {
                $db->rollBack();
                jsonError('Pass every required assessment before a certificate can be issued', 400);
            }
        }

        $existing = $db->prepare(
            'SELECT * FROM certificates WHERE user_id = ? AND course_id = ? LIMIT 1 FOR UPDATE'
        );
        $existing->execute([$userId, $anchorCourse['id']]);
        $cert = $existing->fetch();
        if ($cert) {
            $db->commit();
            jsonOk($cert);
        }

        $uStmt = $db->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
        $uStmt->execute([$userId]);
        $learner = $uStmt->fetch();
        $learnerName = $learner['name'] ?? 'GoalVow Learner';
        $learnerEmail = $learner['email'] ?? null;

        $courseCode = strtoupper(substr(preg_replace('/[^a-z0-9]/', '', strtolower($courseSlug)), 0, 10));
        $certId  = 'VOWLMS-' . $courseCode . '-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));
        $newId   = generateId();
        $issuedAt = date('Y-m-d H:i:s');

        $db->prepare(
            'INSERT INTO certificates (id, user_id, course_id, certificate_id, learner_name, course_name, issued_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([$newId, $userId, $anchorCourse['id'], $certId, $learnerName, $courseName, $issuedAt]);

        $db->prepare('INSERT INTO reward_events (id, user_id, event, points) VALUES (?, ?, ?, ?)')
           ->execute([generateId(), $userId, 'certificate_issued', 200]);

        $db->commit();

        if ($learnerEmail) {
            sendMail($learnerEmail, 'Your VowLMS certificate is ready', certificateEmail($learnerName, $courseName, $certId, $courseSlug));
        }

        jsonCreated([
            'id'             => $newId,
            'certificateId'  => $certId,
            'learnerName'    => $learnerName,
            'courseName'     => $courseName,
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
