<?php
/**
 * Temporary diagnostic — reproduces course-unlock-payfast-create.php's full
 * pricing + signature-generation logic for a real user (by email, since
 * this is bridge-key-only and has no learner session) WITHOUT inserting a
 * payments row or making any other write — pure read + signature-string
 * construction, so it's safe to call repeatedly. Lets us see the exact
 * formAction/formFields/signature the real endpoint would produce right now,
 * to debug a live "stuck / never redirects" report without needing a real
 * browser session. Delete this file once PayFast checkout is confirmed
 * working end-to-end.
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
requireMethod('GET');

$email = trim($_GET['email'] ?? '');
$parentSlug = trim($_GET['parentSlug'] ?? 'business-ethics');
if ($email === '') jsonError('email query param is required');

$db = getDb();

$uStmt = $db->prepare('SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1');
$uStmt->execute([$email]);
$user = $uStmt->fetch();
if (!$user) jsonError('User not found for that email', 404);

$pricing = computeCourseUnlockPrice($db, [$parentSlug]);
if ($pricing === null) jsonError('No unlock pricing configured for that course', 404);
$totalZar = $pricing['totalZar'];

$merchantId  = env('PAYFAST_MERCHANT_ID', '');
$merchantKey = env('PAYFAST_MERCHANT_KEY', '');
$passphrase  = env('PAYFAST_PASSPHRASE', '');
$sandbox     = env('PAYFAST_SANDBOX', 'true') === 'true';
$appUrl      = env('APP_URL', 'https://vowlms.vercel.app');
$apiBase     = env('API_BASE_URL', '');

$pfHost = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
$notifyUrl = $apiBase !== ''
    ? rtrim($apiBase, '/') . '/payments/payfast-notify'
    : "{$appUrl}/api/payments/payfast/notify";

$data = [
    'merchant_id'   => $merchantId,
    'merchant_key'  => $merchantKey,
    'return_url'    => "{$appUrl}/courses/{$parentSlug}?payment=success",
    'cancel_url'    => "{$appUrl}/courses/{$parentSlug}?payment=cancelled",
    'notify_url'    => $notifyUrl,
    'name_first'    => explode(' ', $user['name'])[0],
    'name_last'     => implode(' ', array_slice(explode(' ', $user['name']), 1)) ?: '-',
    'email_address' => $user['email'],
    'm_payment_id'  => 'DIAGNOSTIC-' . generateId(),
    'amount'        => number_format($totalZar, 2, '.', ''),
    'item_name'     => substr('Unlock: ' . $parentSlug, 0, 100),
];

$sigStr = http_build_query($data);
if ($passphrase !== '') $sigStr .= '&passphrase=' . urlencode($passphrase);
$data['signature'] = md5($sigStr);

jsonOk([
    'userId' => $user['id'],
    'userRole' => $user['role'],
    'merchantIdConfigured' => $merchantId !== '',
    'merchantKeyConfigured' => $merchantKey !== '',
    'passphraseConfigured' => $passphrase !== '',
    'sandbox' => $sandbox,
    'pfHost' => $pfHost,
    'formAction' => "https://{$pfHost}/eng/process",
    'formFields' => $data,
    'signatureSourceString' => $sigStr,
    'totalZar' => $totalZar,
]);
