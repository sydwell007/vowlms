<?php
/**
 * Lets a learner back out of a hybrid partial-VOWR reservation before
 * completing the matching cash payment (the checkout UI's "Remove VOWR" /
 * "change amount" action) — refunds the held VOWR immediately instead of
 * making them wait out the reservation TTL. Safe to call on an
 * already-committed/released/expired reservation (releaseVowrReservation()
 * is a no-op in that case) so a stale double-click can't double-refund or
 * error.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/vowr_config.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId = $payload['sub'];
$db = getDb();

$body = getJsonBody();
$reservationId = trim($body['reservationId'] ?? '');
if ($reservationId === '') jsonError('reservationId is required');

$ownerStmt = $db->prepare('SELECT id FROM course_unlock_vowr_reservations WHERE id = ? AND user_id = ? LIMIT 1');
$ownerStmt->execute([$reservationId, $userId]);
if (!$ownerStmt->fetch()) jsonError('Reservation not found', 404);

try {
    $db->beginTransaction();
    releaseVowrReservation($db, $reservationId, 'released');
    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('VOWR reservation cancel failed: ' . $error->getMessage());
    jsonError('Could not cancel this reservation right now', 500);
}

$balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$balStmt->execute([$userId]);

jsonOk(['status' => 'released', 'balance' => (int)$balStmt->fetchColumn()]);
