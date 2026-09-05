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
$db      = getDb();

// Fixed, server-owned VOWR cost per catalogue item. The client never supplies
// a cost — it only picks a type. These items require real-world or admin
// fulfilment and are recorded as a pending request, not an instant transaction.
$requestCatalog = [
    'course_credit'            => 500,
    'data_bundle'              => 300,
    'electricity_token'        => 400,
    'mentorship_session'       => 250,
    'assessment_retake_waiver' => 50,
    'vr_practice_credit'       => 100,
];

$body = getJsonBody();
$type = trim($body['redemptionType'] ?? '');

if ($type === 'donate_to_learner') {
    $recipientEmail = trim($body['recipientEmail'] ?? '');
    $amount         = (int)($body['amount'] ?? 0);

    if ($recipientEmail === '') jsonError('recipientEmail is required');
    if ($amount < 10) jsonError('Minimum donation is 10 VOWR');

    $recipientStmt = $db->prepare(
        "SELECT id, name FROM users WHERE email = ? AND role = 'learner' LIMIT 1"
    );
    $recipientStmt->execute([$recipientEmail]);
    $recipient = $recipientStmt->fetch();
    if (!$recipient) jsonError('No learner account found for that email', 404);
    if ($recipient['id'] === $userId) jsonError('You cannot donate to yourself');

    try {
        $db->beginTransaction();

        $balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ? FOR UPDATE');
        $balStmt->execute([$userId]);
        $balance = (int)$balStmt->fetchColumn();
        if ($balance < $amount) {
            $db->rollBack();
            jsonError('Insufficient VOWR balance', 400);
        }

        $db->prepare(
            'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
        )->execute([
            generateId(), $userId, 'redemption_donate_sent', -$amount,
            json_encode(['recipientEmail' => $recipientEmail]),
        ]);

        $db->prepare(
            'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
        )->execute([
            generateId(), $recipient['id'], 'redemption_donate_received', $amount,
            json_encode(['fromUserId' => $userId]),
        ]);

        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        error_log('VOWR donation failed: ' . $error->getMessage());
        jsonError('Donation could not be completed', 500);
    }

    $newBalStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
    $newBalStmt->execute([$userId]);

    jsonCreated([
        'status'        => 'completed',
        'redemptionType' => 'donate_to_learner',
        'amount'        => $amount,
        'recipientName' => $recipient['name'],
        'balance'       => (int)$newBalStmt->fetchColumn(),
    ]);
}

if (!array_key_exists($type, $requestCatalog)) {
    jsonError('Unknown redemption type');
}

$cost = $requestCatalog[$type];

try {
    $db->beginTransaction();

    $balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ? FOR UPDATE');
    $balStmt->execute([$userId]);
    $balance = (int)$balStmt->fetchColumn();
    if ($balance < $cost) {
        $db->rollBack();
        jsonError('Insufficient VOWR balance', 400);
    }

    $requestId = generateId();
    $db->prepare(
        'INSERT INTO redemption_requests (id, user_id, redemption_type, vowr_amount, status, metadata)
         VALUES (?, ?, ?, ?, ?, ?)'
    )->execute([
        $requestId, $userId, $type, $cost, 'pending',
        $body['metadata'] ?? null ? json_encode($body['metadata']) : null,
    ]);

    $db->prepare(
        'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
    )->execute([
        generateId(), $userId, "redemption:{$type}", -$cost,
        json_encode(['redemptionRequestId' => $requestId]),
    ]);

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('VOWR redemption failed: ' . $error->getMessage());
    jsonError('Redemption request could not be submitted', 500);
}

$newBalStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$newBalStmt->execute([$userId]);

jsonCreated([
    'status'          => 'pending',
    'requestId'       => $requestId,
    'redemptionType'  => $type,
    'amount'          => $cost,
    'balance'         => (int)$newBalStmt->fetchColumn(),
    'message'         => 'Request submitted — reviewed within 24 hours.',
]);
