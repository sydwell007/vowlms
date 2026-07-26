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

$payload = requireAuth();
$userId  = $payload['sub'];
$db      = getDb();

$stmt = $db->prepare(
    'SELECT goal_tile, role_selected, academy_routed,
            quiz_q1, quiz_q2, quiz_q3, quiz_q4, quiz_recommendation,
            created_at, updated_at
     FROM learner_goals WHERE user_id = ? LIMIT 1'
);
$stmt->execute([$userId]);
$profile = $stmt->fetch();

jsonOk($profile ?: null);
