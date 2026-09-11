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
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

$db = getDb();

$pricing = computeCourseUnlockPrice($db, $parentSlugs);
if ($pricing === null) jsonError('None of the requested courses have unlock pricing configured', 404);
$realSlugs = array_column($pricing['items'], 'parentSlug');
$totalZar = $pricing['totalZar'];

$childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
if (count($childCourseIds) === 0) jsonError('No unlockable modules found for these courses', 404);
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
    'INSERT INTO payments (id, user_id, course_id, unlock_parent_slugs, amount, status, payfast_payment_id)
     VALUES (?, ?, ?, ?, ?, "pending", NULL)'
)->execute([$paymentId, $userId, $anchorCourseId, json_encode($realSlugs), $totalZar]);

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

jsonOk([
    'paymentId'  => $paymentId,
    'pfHost'     => $pfHost,
    'formAction' => "https://{$pfHost}/eng/process",
    'formFields' => $data,
]);
