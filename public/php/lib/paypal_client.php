<?php
/**
 * Minimal PayPal REST (Orders v2) client — OAuth2 client-credentials token
 * fetch + a small request helper. Mirrors the PAYFAST_SANDBOX convention
 * with PAYPAL_SANDBOX so the same code path works against PayPal's sandbox
 * during testing and live once real credentials are configured.
 */
require_once __DIR__ . '/../config/env.php';

function paypalApiBase(): string {
    $sandbox = env('PAYPAL_SANDBOX', 'true') === 'true';
    return $sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

/** @throws RuntimeException if PayPal isn't configured or the token request fails. */
function getPaypalAccessToken(): string {
    $clientId = env('PAYPAL_CLIENT_ID', '');
    $clientSecret = env('PAYPAL_CLIENT_SECRET', '');
    if ($clientId === '' || $clientSecret === '') {
        throw new RuntimeException('PayPal is not configured');
    }

    $ch = curl_init(paypalApiBase() . '/v1/oauth2/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_USERPWD => "{$clientId}:{$clientSecret}",
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'Accept-Language: en_US'],
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode((string)$response, true);
    if ($response === false || $status !== 200 || empty($data['access_token'])) {
        throw new RuntimeException('Could not obtain a PayPal access token');
    }

    return $data['access_token'];
}

/**
 * @param array<string,mixed>|null $body
 * @return array{status: int, data: array}
 */
function paypalRequest(string $method, string $path, ?array $body = null, ?string $idempotencyKey = null): array {
    $token = getPaypalAccessToken();
    $headers = ['Authorization: Bearer ' . $token, 'Content-Type: application/json'];
    if ($idempotencyKey !== null) $headers[] = 'PayPal-Request-Id: ' . $idempotencyKey;

    $ch = curl_init(paypalApiBase() . $path);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
    ];
    if ($body !== null) $opts[CURLOPT_POSTFIELDS] = json_encode($body);
    curl_setopt_array($ch, $opts);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $status, 'data' => json_decode((string)$response, true) ?? []];
}
