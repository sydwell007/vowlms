<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('GET');

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

$courseSlug = $_GET['courseSlug'] ?? '';

if ($courseSlug !== '') {
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

// All certificates for user
$stmt = $db->prepare(
    'SELECT cert.*, c.slug AS course_slug FROM certificates cert
     JOIN courses c ON c.id = cert.course_id
     WHERE cert.user_id = ? ORDER BY cert.issued_at DESC'
);
$stmt->execute([$userId]);
jsonOk($stmt->fetchAll());
