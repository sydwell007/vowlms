<?php
/**
 * Step 1 of the hybrid partial-VOWR + cash checkout: reserve a chunk of the
 * learner's real VOWR balance against a course/bundle price, and hand back
 * the exact remaining cash amount to charge. Does NOT create a payment or
 * grant access — the caller passes the returned reservationId into whichever
 * gateway-create endpoint they use next (course-unlock-payfast-create.php
 * today; Paystack/PayPal/Lemon Squeezy follow the same pattern), and that
 * gateway's own verify/webhook endpoint commits or releases this reservation
 * once the real cash payment resolves.
 *
 * The VOWR portion is debited from reward_events immediately (same
 * "debit now, reconcile via status" convention as redeem.php's pending
 * catalogue items) so it can never be spent twice while a cash payment is
 * in flight. If the cash leg fails, is cancelled, or the reservation simply
 * expires unused, the debit is reversed by a matching positive reward_events
 * row (see release-expired-vowr-reservations.php and the release path wired
 * into each gateway's verify/webhook endpoint).
 *
 * Every number here is recomputed server-side from real pricing/balance
 * data — the client only ever supplies a *requested* VOWR amount, which is
 * clamped (never trusted) by computePartialVowrRedemption().
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/course_unlock_pricing.php';
require_once __DIR__ . '/../../lib/vowr_config.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId = $payload['sub'];
$db = getDb();

$body = getJsonBody();
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];
$requestedVowr = (int)($body['vowrAmount'] ?? 0);
$gateway = trim($body['gateway'] ?? '');

if (count($parentSlugs) === 0) jsonError('parentSlugs is required');
if (!in_array($gateway, ['payfast', 'paystack', 'paypal', 'lemonsqueezy'], true)) {
    jsonError('A valid gateway is required');
}
if ($requestedVowr <= 0) jsonError('vowrAmount must be greater than zero — use the full-price cash or full-VOWR endpoints for a zero-VOWR or all-VOWR purchase');

$pricing = computeCourseUnlockPrice($db, $parentSlugs);
if ($pricing === null) jsonError('None of the requested courses have unlock pricing configured', 404);
$realSlugs = array_column($pricing['items'], 'parentSlug');
$totalZar = $pricing['totalZar'];

$childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
if (count($childCourseIds) === 0) jsonError('No unlockable modules found for these courses', 404);

$ownedPlaceholders = implode(',', array_fill(0, count($childCourseIds), '?'));
$ownedStmt = $db->prepare(
    "SELECT COUNT(*) FROM enrollments WHERE user_id = ? AND course_id IN ($ownedPlaceholders) AND status IN ('active','completed')"
);
$ownedStmt->execute([$userId, ...$childCourseIds]);
if ((int)$ownedStmt->fetchColumn() >= count($childCourseIds)) {
    jsonError('You already have full access to this course', 409);
}

try {
    $db->beginTransaction();

    $balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ? FOR UPDATE');
    $balStmt->execute([$userId]);
    $balance = (int)$balStmt->fetchColumn();

    $redemption = computePartialVowrRedemption($db, $totalZar, count($realSlugs), $requestedVowr, $balance);

    if ($redemption['vowrAmount'] <= 0) {
        $db->rollBack();
        jsonError('Insufficient VOWR balance to reserve anything toward this purchase', 400);
    }

    $config = getVowrConfig($db);
    $reservationId = generateId();
    $rewardEventId = generateId();

    $db->prepare(
        'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
    )->execute([
        $rewardEventId, $userId, 'vowr_reserve:' . $reservationId, -$redemption['vowrAmount'],
        json_encode(['reservationId' => $reservationId, 'parentSlugs' => $realSlugs]),
    ]);

    $db->prepare(
        'INSERT INTO course_unlock_vowr_reservations
         (id, user_id, parent_slugs, vowr_amount, vowr_value_zar, cash_amount_zar, gateway, status, reward_event_id, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, "reserved", ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))'
    )->execute([
        $reservationId, $userId, json_encode($realSlugs), $redemption['vowrAmount'],
        $redemption['vowrValueZar'], $redemption['cashAmountZar'], $gateway, $rewardEventId,
        $config['reservationTtlMinutes'],
    ]);

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('VOWR reservation failed: ' . $error->getMessage());
    jsonError('Could not reserve VOWR right now', 500);
}

$newBalStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$newBalStmt->execute([$userId]);

jsonCreated([
    'reservationId' => $reservationId,
    'parentSlugs' => $realSlugs,
    'totalZar' => $totalZar,
    'vowrAmount' => $redemption['vowrAmount'],
    'vowrValueZar' => $redemption['vowrValueZar'],
    'cashAmountZar' => $redemption['cashAmountZar'],
    'maxVowr' => $redemption['maxVowr'],
    'maxPercent' => $redemption['maxPercent'],
    'expiresInMinutes' => $config['reservationTtlMinutes'],
    'balance' => (int)$newBalStmt->fetchColumn(),
]);
