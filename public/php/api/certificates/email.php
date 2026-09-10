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
requireMethod('POST');
$payload = requireAuth();
$body = getJsonBody();
$certificateId = trim($body['certificateId'] ?? '');
if (!$certificateId) jsonError('certificateId is required');

$db = getDb();
$stmt = $db->prepare('SELECT cert.*, users.email FROM certificates cert JOIN users ON users.id = cert.user_id WHERE cert.user_id = ? AND cert.certificate_id = ? LIMIT 1');
$stmt->execute([$payload['sub'], $certificateId]);
$certificate = $stmt->fetch();
if (!$certificate) jsonError('Certificate not found', 404);

if (!$certificate['email'] || !sendMail($certificate['email'], 'Your VowLMS certificate copy', certificateEmail($certificate['learner_name'], $certificate['course_name'], $certificate['certificate_id']))) {
    jsonError('Certificate email could not be sent', 502);
}
jsonOk(['sent' => true]);
