<?php
/*
 * PayFast ITN (Instant Transaction Notification) handler.
 * PayFast POSTs directly to this URL — no Bridge-Key required.
 * This endpoint is called by PayFast, not by the Next.js frontend.
 */
require_once __DIR__ . '/../../../config/env.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/response.php';

header('Content-Type: text/plain');

$sandbox    = env('PAYFAST_SANDBOX', 'true') === 'true';
$passphrase = env('PAYFAST_PASSPHRASE', '');
$merchantId = env('PAYFAST_MERCHANT_ID', '');

// 1. Validate source IP
$pfValidIps = $sandbox
    ? ['197.97.145.144', '197.97.145.145', '197.97.145.146', '197.97.145.147']
    : ['41.74.179.194', '41.74.179.195', '41.74.179.196', '41.74.179.197', '41.74.179.198',
       '41.74.179.199', '41.74.179.200', '41.74.179.201', '41.74.179.202', '41.74.179.203'];

$sourceIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$sourceIp = trim(explode(',', $sourceIp)[0]);
if (!in_array($sourceIp, $pfValidIps, true) && !$sandbox) {
    http_response_code(403);
    echo 'invalid-source';
    exit;
}

// 2. Build verification signature (exclude 'signature' field)
$pfData    = $_POST;
$pfSig     = $pfData['signature'] ?? '';
unset($pfData['signature']);
ksort($pfData); // PayFast expects alphabetical order

$sigStr = http_build_query($pfData);
if ($passphrase !== '') $sigStr .= '&passphrase=' . urlencode($passphrase);
$expectedSig = md5($sigStr);

if (!hash_equals($expectedSig, $pfSig)) {
    http_response_code(400);
    echo 'invalid-signature';
    exit;
}

// 3. Verify with PayFast server
$pfHost   = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
$verifyUrl = "https://{$pfHost}/eng/query/validate";
$postStr   = http_build_query($pfData + ['signature' => $pfSig]);

$ch = curl_init($verifyUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $postStr,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$verifyResponse = curl_exec($ch);
curl_close($ch);

if (strtolower(trim($verifyResponse)) !== 'valid') {
    http_response_code(400);
    echo 'payfast-verify-failed';
    exit;
}

// 4. Process the notification
$paymentStatus = $_POST['payment_status'] ?? '';
$paymentId     = $_POST['m_payment_id']   ?? '';
$pfPaymentId   = $_POST['pf_payment_id']  ?? '';
$amount        = (float)($_POST['amount_gross'] ?? 0);
$pfMerchantId  = $_POST['merchant_id']    ?? '';

if ($pfMerchantId !== $merchantId) {
    http_response_code(400);
    echo 'merchant-mismatch';
    exit;
}

$db = getDb();

// Fetch the pending payment
$pStmt = $db->prepare('SELECT * FROM payments WHERE id = ? LIMIT 1');
$pStmt->execute([$paymentId]);
$payment = $pStmt->fetch();

if (!$payment) {
    http_response_code(404);
    echo 'payment-not-found';
    exit;
}

if (strtoupper($paymentStatus) === 'COMPLETE') {
    // Mark payment as paid
    $db->prepare(
        'UPDATE payments SET status = "paid", pf_payment_id = ?, updated_at = NOW() WHERE id = ?'
    )->execute([$pfPaymentId, $paymentId]);

    $userId   = $payment['user_id'];
    $courseId = $payment['course_id'];

    // Auto-enrol if not already enrolled
    $enrCheck = $db->prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1');
    $enrCheck->execute([$userId, $courseId]);
    if (!$enrCheck->fetchColumn()) {
        $enrId = generateId();
        $db->prepare(
            'INSERT INTO enrollments (id, user_id, course_id, status, progress) VALUES (?, ?, ?, "active", 0)'
        )->execute([$enrId, $userId, $courseId]);

        // Award enrolment reward points (50 pts)
        $rewId = generateId();
        $db->prepare(
            'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
        )->execute([$rewId, $userId, 'enroll', 50, json_encode(['course_id' => $courseId])]);
    }

    echo 'OK';
} elseif (strtoupper($paymentStatus) === 'CANCELLED') {
    $db->prepare('UPDATE payments SET status = "cancelled" WHERE id = ?')->execute([$paymentId]);
    echo 'OK';
} elseif (strtoupper($paymentStatus) === 'FAILED') {
    $db->prepare('UPDATE payments SET status = "failed" WHERE id = ?')->execute([$paymentId]);
    echo 'OK';
} else {
    echo 'unhandled-status';
}
