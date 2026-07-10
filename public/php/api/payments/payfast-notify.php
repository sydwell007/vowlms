<?php
/**
 * PayFast ITN handler.
 *
 * Direct PayFast posts and Next.js relay posts are accepted. Both paths must
 * pass signature, merchant, amount, and PayFast server validation before a
 * paid enrolment is activated.
 */
ob_start();
require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/db.php';
ob_end_clean();

header('Content-Type: text/plain; charset=utf-8');

function finishText(string $message, int $status = 200): never {
    http_response_code($status);
    echo $message;
    exit;
}

function payfastParamString(array $data): string {
    $pairs = [];
    foreach ($data as $key => $value) {
        if ($key === 'signature' || $value === '' || $value === null) continue;
        $pairs[] = $key . '=' . urlencode(trim((string)$value));
    }
    return implode('&', $pairs);
}

function validPayfastSource(string $sourceIp): bool {
    $hosts = [
        'www.payfast.co.za',
        'w1w.payfast.co.za',
        'w2w.payfast.co.za',
        'sandbox.payfast.co.za',
    ];
    $validIps = [];
    foreach ($hosts as $host) {
        $resolved = gethostbynamel($host);
        if ($resolved !== false) $validIps = array_merge($validIps, $resolved);
    }
    return in_array($sourceIp, array_unique($validIps), true);
}

$sandbox = env('PAYFAST_SANDBOX', 'true') === 'true';
$passphrase = env('PAYFAST_PASSPHRASE', '');
$merchantId = env('PAYFAST_MERCHANT_ID', '');
$bridgeKey = env('BRIDGE_API_KEY', '');

if ($merchantId === '') finishText('payment-not-configured', 503);

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isProxy = str_contains($contentType, 'application/json');

if ($isProxy) {
    $provided = $_SERVER['HTTP_X_BRIDGE_KEY'] ?? $_SERVER['BRIDGE_KEY_HEADER'] ?? '';
    if ($bridgeKey === '' || !hash_equals($bridgeKey, $provided)) {
        finishText('forbidden', 403);
    }

    $json = json_decode(file_get_contents('php://input'), true);
    $itnRaw = is_array($json) ? ($json['itnRaw'] ?? '') : '';
    parse_str($itnRaw, $pfData);
} else {
    $sourceIp = $_SERVER['REMOTE_ADDR'] ?? '';
    if (!validPayfastSource($sourceIp)) finishText('invalid-source', 403);
    $pfData = $_POST;
}

if (empty($pfData)) finishText('empty-payload', 400);

$providedSignature = (string)($pfData['signature'] ?? '');
$parameterString = payfastParamString($pfData);
if ($passphrase !== '') $parameterString .= '&passphrase=' . urlencode($passphrase);
$expectedSignature = md5($parameterString);
if ($providedSignature === '' || !hash_equals($expectedSignature, $providedSignature)) {
    finishText('invalid-signature', 400);
}

if (!hash_equals($merchantId, (string)($pfData['merchant_id'] ?? ''))) {
    finishText('merchant-mismatch', 400);
}

$pfHost = $sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
$ch = curl_init("https://{$pfHost}/eng/query/validate");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($pfData),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$verifyResponse = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);
if ($verifyResponse === false || strtolower(trim((string)$verifyResponse)) !== 'valid') {
    error_log('PayFast validation failed: ' . ($curlError ?: 'invalid response'));
    finishText('payfast-verify-failed', 400);
}

$paymentId = trim((string)($pfData['m_payment_id'] ?? ''));
$pfPaymentId = trim((string)($pfData['pf_payment_id'] ?? ''));
$paymentStatus = strtoupper(trim((string)($pfData['payment_status'] ?? '')));
$amountGross = $pfData['amount_gross'] ?? null;

if ($paymentId === '' || $pfPaymentId === '' || $amountGross === null) {
    finishText('missing-payment-fields', 400);
}

$db = getDb();

try {
    $db->beginTransaction();

    $paymentStmt = $db->prepare('SELECT * FROM payments WHERE id = ? LIMIT 1 FOR UPDATE');
    $paymentStmt->execute([$paymentId]);
    $payment = $paymentStmt->fetch();
    if (!$payment) {
        $db->rollBack();
        finishText('payment-not-found', 404);
    }

    if (abs((float)$payment['amount'] - (float)$amountGross) > 0.01) {
        $db->rollBack();
        finishText('amount-mismatch', 400);
    }

    if ($payment['status'] === 'paid') {
        $sameProviderReference = hash_equals((string)$payment['payfast_payment_id'], $pfPaymentId);
        $db->commit();
        finishText($sameProviderReference ? 'OK' : 'payment-reference-conflict', $sameProviderReference ? 200 : 409);
    }

    $itnData = json_encode($pfData, JSON_UNESCAPED_SLASHES);

    if ($paymentStatus === 'COMPLETE') {
        $update = $db->prepare(
            'UPDATE payments
             SET status = "paid", payfast_payment_id = ?, itn_data = ?, updated_at = NOW()
             WHERE id = ? AND status = "pending"'
        );
        $update->execute([$pfPaymentId, $itnData, $paymentId]);
        if ($update->rowCount() !== 1) {
            $db->rollBack();
            finishText('invalid-payment-transition', 409);
        }

        $enrolmentId = generateId();
        $enrol = $db->prepare(
            'INSERT IGNORE INTO enrollments (id, user_id, course_id, status, progress)
             VALUES (?, ?, ?, "active", 0)'
        );
        $enrol->execute([$enrolmentId, $payment['user_id'], $payment['course_id']]);

        if ($enrol->rowCount() === 1) {
            $db->prepare(
                'INSERT INTO reward_events (id, user_id, event, points, metadata)
                 VALUES (?, ?, ?, ?, ?)'
            )->execute([
                generateId(),
                $payment['user_id'],
                'enroll',
                50,
                json_encode(['course_id' => $payment['course_id'], 'source' => 'payment']),
            ]);
        }
    } elseif ($paymentStatus === 'CANCELLED') {
        $db->prepare(
            'UPDATE payments SET status = "cancelled", payfast_payment_id = ?, itn_data = ?, updated_at = NOW()
             WHERE id = ? AND status = "pending"'
        )->execute([$pfPaymentId, $itnData, $paymentId]);
    } elseif ($paymentStatus === 'FAILED') {
        $db->prepare(
            'UPDATE payments SET status = "failed", payfast_payment_id = ?, itn_data = ?, updated_at = NOW()
             WHERE id = ? AND status = "pending"'
        )->execute([$pfPaymentId, $itnData, $paymentId]);
    } else {
        $db->rollBack();
        finishText('unhandled-status', 400);
    }

    $db->commit();
    finishText('OK');
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('PayFast ITN processing failed: ' . $error->getMessage());
    finishText('processing-failed', 500);
}
