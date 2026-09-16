<?php
/**
 * PayFast checkout for unlocking the rest of one or more Upskilling courses
 * (single course or Career Path bundle) with cash — mirrors payfast-create.php
 * exactly (same signing, same sandbox/live host selection, same `payments`
 * row + ITN pattern), the only difference is the price and the eventual
 * enrollment fan-out come from course_unlock_pricing/course_unlock_children
 * instead of a single `courses.price` row.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/course_unlock_pricing.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId  = $payload['sub'];
$body    = getJsonBody();
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];
// Optional: set by the hybrid partial-VOWR checkout after a successful call
// to unlock-reserve-vowr.php — when present, this is a "pay the remainder"
// checkout, not a full-price one, and the amount charged is the
// reservation's own server-computed cash_amount_zar, never totalZar.
$reservationId = trim($body['reservationId'] ?? '');
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

$db = getDb();

$pricing = computeCourseUnlockPrice($db, $parentSlugs);
if ($pricing === null) jsonError('None of the requested courses have unlock pricing configured', 404);
$realSlugs = array_column($pricing['items'], 'parentSlug');
$totalZar = $pricing['totalZar'];

if ($reservationId !== '') {
    $reservationStmt = $db->prepare(
        "SELECT * FROM course_unlock_vowr_reservations
         WHERE id = ? AND user_id = ? AND status = 'reserved' AND expires_at > NOW() LIMIT 1"
    );
    $reservationStmt->execute([$reservationId, $userId]);
    $reservation = $reservationStmt->fetch();
    if (!$reservation) jsonError('This VOWR reservation has expired or is no longer valid — please redo your redemption selection', 410);
    $totalZar = (float)$reservation['cash_amount_zar'];
}

$childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
if (count($childCourseIds) === 0) jsonError('No unlockable modules found for these courses', 404);

// Reject starting a new paid checkout for something the learner already
// fully owns — guards against a stale client UI (e.g. a second unlock card
// that hasn't refreshed yet) sending them to PayFast to pay for it again.
$ownedPlaceholders = implode(',', array_fill(0, count($childCourseIds), '?'));
$ownedStmt = $db->prepare(
    "SELECT COUNT(*) FROM enrollments WHERE user_id = ? AND course_id IN ($ownedPlaceholders) AND status IN ('active','completed')"
);
$ownedStmt->execute([$userId, ...$childCourseIds]);
if ((int)$ownedStmt->fetchColumn() >= count($childCourseIds)) {
    jsonError('You already have full access to this course', 409);
}

// A representative child course to satisfy payments.course_id's NOT NULL FK —
// the real fan-out on success uses unlock_parent_slugs (all real children of
// every requested slug), not just this one row.
$anchorCourseId = $childCourseIds[0];

$uStmt = $db->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
$uStmt->execute([$userId]);
$user = $uStmt->fetch();
if (!$user) jsonError('User not found', 404);

$merchantId  = env('PAYFAST_MERCHANT_ID', '');
$merchantKey = env('PAYFAST_MERCHANT_KEY', '');
$passphrase  = env('PAYFAST_PASSPHRASE', '');
$sandbox     = env('PAYFAST_SANDBOX', 'true') === 'true';
$appUrl      = env('APP_URL', 'https://vowlms.vercel.app');
$apiBase     = env('API_BASE_URL', '');

if ($merchantId === '' || $merchantKey === '') {
    jsonError('Payment service is not configured', 503);
}

$paymentId = generateId();
$db->prepare(
    'INSERT INTO payments (id, user_id, course_id, unlock_parent_slugs, vowr_reservation_id, amount, status, payfast_payment_id)
     VALUES (?, ?, ?, ?, ?, ?, "pending", NULL)'
)->execute([$paymentId, $userId, $anchorCourseId, json_encode($realSlugs), $reservationId !== '' ? $reservationId : null, $totalZar]);

$pfHost = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
$notifyUrl = $apiBase !== ''
    ? rtrim($apiBase, '/') . '/payments/payfast-notify'
    : "{$appUrl}/api/payments/payfast/notify";

$returnCourseSlug = $realSlugs[0];
$itemName = count($realSlugs) > 1
    ? 'GoalVow Career Path (' . count($realSlugs) . ' courses)'
    : ('Unlock: ' . $realSlugs[0]);

$data = [
    'merchant_id'   => $merchantId,
    'merchant_key'  => $merchantKey,
    'return_url'    => "{$appUrl}/courses/{$returnCourseSlug}?payment=success",
    'cancel_url'    => "{$appUrl}/courses/{$returnCourseSlug}?payment=cancelled",
    'notify_url'    => $notifyUrl,
    'name_first'    => explode(' ', $user['name'])[0],
    'name_last'     => implode(' ', array_slice(explode(' ', $user['name']), 1)) ?: '-',
    'email_address' => $user['email'],
    'm_payment_id'  => $paymentId,
    'amount'        => number_format($totalZar, 2, '.', ''),
    'item_name'     => substr($itemName, 0, 100),
];

$sigStr = http_build_query($data);
if ($passphrase !== '') $sigStr .= '&passphrase=' . urlencode($passphrase);
$data['signature'] = md5($sigStr);

// A GET redirect rather than a POST-form submission — PayFast's own
// /eng/process endpoint accepts either (confirmed directly: a GET with
// these exact params returns a real 302 to a genuine
// payment.payfast.io/.../payment/{id} session, not an error). A plain
// navigation isn't governed by CSP's form-action directive at all, which a
// dynamically-submitted POST form was hitting inconsistently in production
// regardless of how the form was constructed — this sidesteps that
// entirely instead of continuing to chase it.
jsonOk([
    'paymentId'   => $paymentId,
    'pfHost'      => $pfHost,
    'redirectUrl' => "https://{$pfHost}/eng/process?" . http_build_query($data),
]);
