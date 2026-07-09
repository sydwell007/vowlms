<?php
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload     = requireAuth();
$userId      = $payload['sub'];
$body        = getJsonBody();
$courseSlug  = trim($body['courseSlug'] ?? '');

if (!$courseSlug) jsonError('courseSlug is required');

$db = getDb();

// Fetch course by slug
$cStmt = $db->prepare(
    'SELECT id, title, price FROM courses WHERE slug = ? AND status = "published" LIMIT 1'
);
$cStmt->execute([$courseSlug]);
$course = $cStmt->fetch();
if (!$course) jsonError('Course not found', 404);
if ((float)$course['price'] <= 0) jsonError('This course is free — enrol directly');

// Fetch user
$uStmt = $db->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
$uStmt->execute([$userId]);
$user = $uStmt->fetch();
if (!$user) jsonError('User not found', 404);

// Configuration
$merchantId  = env('PAYFAST_MERCHANT_ID', '');
$merchantKey = env('PAYFAST_MERCHANT_KEY', '');
$passphrase  = env('PAYFAST_PASSPHRASE', '');
$sandbox     = env('PAYFAST_SANDBOX', 'true') === 'true';
$appUrl      = env('APP_URL', 'https://vowlms.vercel.app');
$apiBase     = env('API_BASE_URL', '');   // e.g. https://api.vowlms.co.za

// Create pending payment record
$paymentId = generateId();
$db->prepare(
    'INSERT INTO payments (id, user_id, course_id, amount, status, payfast_payment_id)
     VALUES (?, ?, ?, ?, "pending", NULL)'
)->execute([$paymentId, $userId, $course['id'], $course['price']]);

// PayFast form data
$pfHost = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';

// notify_url must be called directly by PayFast — use the PHP API endpoint, not the Vercel proxy.
// $apiBase should be set to e.g. https://api.vowlms.co.za in env.php
$notifyUrl = $apiBase !== ''
    ? rtrim($apiBase, '/') . '/payments/payfast-notify'
    : "{$appUrl}/api/payments/payfast/notify"; // fallback to Next.js proxy if $apiBase not configured

$data = [
    'merchant_id'   => $merchantId,
    'merchant_key'  => $merchantKey,
    'return_url'    => "{$appUrl}/courses/{$courseSlug}?payment=success",
    'cancel_url'    => "{$appUrl}/courses/{$courseSlug}?payment=cancelled",
    'notify_url'    => $notifyUrl,
    'm_payment_id'  => $paymentId,
    'amount'        => number_format((float)$course['price'], 2, '.', ''),
    'item_name'     => substr($course['title'], 0, 100),
    'name_first'    => explode(' ', $user['name'])[0],
    'name_last'     => implode(' ', array_slice(explode(' ', $user['name']), 1)) ?: '-',
    'email_address' => $user['email'],
];

// Build signature
$sigStr = http_build_query($data);
if ($passphrase !== '') $sigStr .= '&passphrase=' . urlencode($passphrase);
$data['signature'] = md5($sigStr);

jsonOk([
    'paymentId'  => $paymentId,
    'pfHost'     => $pfHost,
    'formAction' => "https://{$pfHost}/eng/process",
    'formFields' => $data,
]);
