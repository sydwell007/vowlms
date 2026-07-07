<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../config/env.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('POST');

$payload  = requireAuth();
$userId   = $payload['sub'];
$body     = getJsonBody();
$courseId = trim($body['courseId'] ?? '');

if (!$courseId) jsonError('courseId is required');

$db = getDb();

// Fetch course
$cStmt = $db->prepare('SELECT id, title, price FROM courses WHERE id = ? AND status = "published" LIMIT 1');
$cStmt->execute([$courseId]);
$course = $cStmt->fetch();
if (!$course) jsonError('Course not found', 404);
if ((float)$course['price'] <= 0) jsonError('This course is free — enrol directly');

// Fetch user
$uStmt = $db->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
$uStmt->execute([$userId]);
$user = $uStmt->fetch();
if (!$user) jsonError('User not found', 404);

// Create pending payment record
$paymentId  = generateId();
$merchantId = env('PAYFAST_MERCHANT_ID', '');
$merchantKey = env('PAYFAST_MERCHANT_KEY', '');
$passphrase = env('PAYFAST_PASSPHRASE', '');
$sandbox    = env('PAYFAST_SANDBOX', 'true') === 'true';
$appUrl     = env('APP_URL', 'https://vowlms.vercel.app');

$db->prepare(
    'INSERT INTO payments (id, user_id, course_id, amount, status, pf_payment_id) VALUES (?, ?, ?, ?, "pending", ?)'
)->execute([$paymentId, $userId, $courseId, $course['price'], null]);

// Build PayFast form data
$pfHost = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';

$data = [
    'merchant_id'   => $merchantId,
    'merchant_key'  => $merchantKey,
    'return_url'    => "{$appUrl}/courses/{$courseId}?payment=success",
    'cancel_url'    => "{$appUrl}/courses/{$courseId}?payment=cancelled",
    'notify_url'    => "{$appUrl}/api/payments/payfast/notify",
    'm_payment_id'  => $paymentId,
    'amount'        => number_format((float)$course['price'], 2, '.', ''),
    'item_name'     => substr($course['title'], 0, 100),
    'name_first'    => explode(' ', $user['name'])[0],
    'name_last'     => implode(' ', array_slice(explode(' ', $user['name']), 1)) ?: '-',
    'email_address' => $user['email'],
];

// Signature
$sigStr = http_build_query($data);
if ($passphrase !== '') $sigStr .= '&passphrase=' . urlencode($passphrase);
$data['signature'] = md5($sigStr);

jsonOk([
    'paymentId'   => $paymentId,
    'pfHost'      => $pfHost,
    'formAction'  => "https://{$pfHost}/eng/process",
    'formFields'  => $data,
]);
