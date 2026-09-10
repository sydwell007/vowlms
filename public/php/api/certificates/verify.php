<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$certificateId = trim($_GET['certificateId'] ?? '');
if (!preg_match('/^VOWLMS-[A-Z0-9-]{8,100}$/', $certificateId)) jsonError('Enter a valid certificate authentication number');

$stmt = getDb()->prepare('SELECT certificate_id, learner_name, course_name, issued_at FROM certificates WHERE certificate_id = ? LIMIT 1');
$stmt->execute([$certificateId]);
$certificate = $stmt->fetch();
if (!$certificate) jsonOk(['valid' => false, 'certificateId' => $certificateId]);

jsonOk([
    'valid' => true,
    'certificateId' => $certificate['certificate_id'],
    'learnerName' => $certificate['learner_name'],
    'courseName' => $certificate['course_name'],
    'issuedAt' => $certificate['issued_at'],
    'academyName' => 'GoalVow Academy',
]);
