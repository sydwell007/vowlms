<?php
/**
 * Scheduled sweep: releases any hybrid-checkout VOWR reservation
 * (course_unlock_vowr_reservations, status = 'reserved') whose TTL has
 * passed without a matching cash payment ever clearing — refunds the held
 * VOWR back to the learner via releaseVowrReservation()'s compensating
 * reward_events row. Intended to run every few minutes via an Afrihost
 * cPanel cron job (CLI or curl'd URL with the cron secret), mirroring
 * get-exchange-rates.php's own convention exactly.
 *
 * Idempotent per row: releaseVowrReservation() only ever touches a row still
 * in 'reserved' status, so running this concurrently with a real payment
 * verification landing (which also releases-or-commits) can never double-act
 * on the same reservation.
 */
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/lib/vowr_config.php';

$isCli = php_sapi_name() === 'cli';
if (!$isCli) {
    $cronSecret = env('CRON_SECRET', '');
    if ($cronSecret === '' || !hash_equals($cronSecret, $_GET['token'] ?? '')) {
        http_response_code(403);
        echo 'Forbidden';
        exit;
    }
}

$db = getDb();

$stmt = $db->prepare(
    "SELECT id FROM course_unlock_vowr_reservations WHERE status = 'reserved' AND expires_at <= NOW()"
);
$stmt->execute();
$expiredIds = array_column($stmt->fetchAll(), 'id');

$released = 0;
foreach ($expiredIds as $reservationId) {
    try {
        $db->beginTransaction();
        if (releaseVowrReservation($db, $reservationId, 'expired')) $released++;
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        error_log("Failed to release expired VOWR reservation {$reservationId}: " . $error->getMessage());
    }
}

echo "Checked: " . count($expiredIds) . ", released: {$released}\n";
