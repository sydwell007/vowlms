<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId  = $payload['sub'];

$body            = getJsonBody();
$goalTile        = trim($body['goalTileId'] ?? '');
$roleSelected    = trim($body['roleId'] ?? '');
$academyRouted   = trim($body['academyCategory'] ?? '');
$quiz            = $body['quizAnswers'] ?? null;

if (!$goalTile || !$academyRouted) jsonError('goalTileId and academyCategory are required');

$db = getDb();
$id = generateId();

$db->prepare(
    'INSERT INTO learner_goals
        (id, user_id, goal_tile, role_selected, academy_routed, quiz_q1, quiz_q2, quiz_q3, quiz_q4, quiz_recommendation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        goal_tile = VALUES(goal_tile),
        role_selected = VALUES(role_selected),
        academy_routed = VALUES(academy_routed),
        quiz_q1 = VALUES(quiz_q1),
        quiz_q2 = VALUES(quiz_q2),
        quiz_q3 = VALUES(quiz_q3),
        quiz_q4 = VALUES(quiz_q4),
        quiz_recommendation = VALUES(quiz_recommendation)'
)->execute([
    $id,
    $userId,
    $goalTile,
    $roleSelected ?: null,
    $academyRouted,
    $quiz['q1'] ?? null,
    $quiz['q2'] ?? null,
    $quiz['q3'] ?? null,
    $quiz['q4'] ?? null,
    $quiz ? $academyRouted : null,
]);

$readStmt = $db->prepare('SELECT id FROM learner_goals WHERE user_id = ? LIMIT 1');
$readStmt->execute([$userId]);
$profileId = $readStmt->fetchColumn() ?: $id;

jsonCreated([
    'profileId'     => $profileId,
    'goalTile'      => $goalTile,
    'roleSelected'  => $roleSelected ?: null,
    'academyRouted' => $academyRouted,
]);
