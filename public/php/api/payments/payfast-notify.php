<?php
/*
 * PayFast ITN (Instant Transaction Notification) handler.
 *
 * TWO CALL MODES:
 *  A) Direct — PayFast POSTs application/x-www-form-urlencoded to this URL.
 *     No Bridge-Key check (PayFast cannot send it). IP + signature validated instead.
 *  B) Proxy — Next.js /api/payments/payfast/notify forwards a JSON body
 *     { "itnRaw": "m_payment_id=...&..." } when API_BASE_URL is not configured.
 *     In this mode the Bridge-Key header is present; we validate it and parse itnRaw.
 */
require_once __DIR__ . '/../../../config/env.php';
require_once __DIR__ . '/../../../config/db.php';
require_once __DIR__ . '/../../../lib/response.php';

header('Content-Type: text/plain');

$sandbox     = env('PAYFAST_SANDBOX', 'true') === 'true';
$passphrase  = env('PAYFAST_PASSPHRASE', '');
$merchantId  = env('PAYFAST_MERCHANT_ID', '');
$bridgeKey   = env('BRIDGE_API_KEY', '');

// Detect call mode
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isProxy     = str_contains($contentType, 'application/json');

if ($isProxy) {
    // Mode B: proxied through Next.js bridge
    $provided = $_SERVER['HTTP_X_BRIDGE_KEY'] ?? '';
    if ($bridgeKey === '' || !hash_equals($bridgeKey, $provided)) {
        http_response_code(403);
        echo 'forbidden';
        exit;
    }
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    $itnRaw = $json['itnRaw'] ?? '';
    parse_str($itnRaw, $pfData);
} else {
    // Mode A: direct PayFast POST
    // Validate source IP
    $pfValidIps = $sandbox
        ? ['197.97.145.144', '197.97.145.145', '197.97.145.146', '197.97.145.147']
        : ['41.74.179.194', '41.74.179.195', '41.74.179.196', '41.74.179.197',
           '41.74.179.198', '41.74.179.199', '41.74.179.200', '41.74.179.201',
           '41.74.179.202', '41.74.179.203'];

    $sourceIp = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '')[0]);
    if (!$sandbox && !in_array($sourceIp, $pfValidIps, true)) {
        http_response_code(403);
        echo 'invalid-source';
        exit;
    }
    $pfData = $_POST;
}

if (empty($pfData)) {
    http_response_code(400);
    echo 'empty-payload';
    exit;
}

// Validate signature
$pfSig = $pfData['signature'] ?? '';
$sigData = $pfData;
unset($sigData['signature']);
ksort($sigData);
$sigStr = http_build_query($sigData);
if ($passphrase !== '') $sigStr .= '&passphrase=' . urlencode($passphrase);
if (!hash_equals(md5($sigStr), $pfSig)) {
    http_response_code(400);
    echo 'invalid-signature';
    exit;
}

// Verify with PayFast (only in direct mode — can't do this through proxy)
if (!$isProxy) {
    $pfHost   = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
    $postStr  = http_build_query($pfData);
    $ch = curl_init("https://{$pfHost}/eng/query/validate");
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
}

// Check merchant ID
if (($pfData['merchant_id'] ?? '') !== $merchantId) {
    http_response_code(400);
    echo 'merchant-mismatch';
    exit;
}

$paymentStatus = $pfData['payment_status'] ?? '';
$paymentId     = $pfData['m_payment_id']   ?? '';
$pfPaymentId   = $pfData['pf_payment_id']  ?? '';

$db = getDb();

$pStmt = $db->prepare('SELECT * FROM payments WHERE id = ? LIMIT 1');
$pStmt->execute([$paymentId]);
$payment = $pStmt->fetch();

if (!$payment) {
    http_response_code(404);
    echo 'payment-not-found';
    exit;
}

function generateId(): string {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

if (strtoupper($paymentStatus) === 'COMPLETE') {
    $db->prepare(
        'UPDATE payments SET status = "paid", payfast_payment_id = ?, updated_at = NOW() WHERE id = ?'
    )->execute([$pfPaymentId, $paymentId]);

    $userId   = $payment['user_id'];
    $courseId = $payment['course_id'];

    $enrCheck = $db->prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1');
    $enrCheck->execute([$userId, $courseId]);
    if (!$enrCheck->fetchColumn()) {
        $enrId = generateId();
        $db->prepare(
            'INSERT INTO enrollments (id, user_id, course_id, status, progress) VALUES (?, ?, ?, "active", 0)'
        )->execute([$enrId, $userId, $courseId]);

        $rewId = generateId();
        $db->prepare(
            'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
        )->execute([$rewId, $userId, 'enroll', 50, json_encode(['course_id' => $courseId, 'source' => 'payment'])]);
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
