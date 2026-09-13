<?php
/**
 * Minimal Lemon Squeezy REST client — a single Bearer API key (no OAuth
 * dance, unlike PayPal), mirroring paypal_client.php's request-helper shape.
 * Lemon Squeezy is a merchant-of-record reseller: it calculates, collects,
 * and remits VAT for EU/UK buyers itself, so this integration exists only to
 * route those buyers there — never to build our own VAT logic.
 */
require_once __DIR__ . '/../config/env.php';

const LEMONSQUEEZY_API_BASE = 'https://api.lemonsqueezy.com/v1';

/**
 * @param array<string,mixed>|null $body
 * @return array{status: int, data: array}
 * @throws RuntimeException if LEMONSQUEEZY_API_KEY isn't configured.
 */
function lemonSqueezyRequest(string $method, string $path, ?array $body = null): array {
    $apiKey = env('LEMONSQUEEZY_API_KEY', '');
    if ($apiKey === '') throw new RuntimeException('Lemon Squeezy is not configured');

    $ch = curl_init(LEMONSQUEEZY_API_BASE . $path);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Accept: application/vnd.api+json',
            'Content-Type: application/vnd.api+json',
        ],
    ];
    if ($body !== null) $opts[CURLOPT_POSTFIELDS] = json_encode($body);
    curl_setopt_array($ch, $opts);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $status, 'data' => json_decode((string)$response, true) ?? []];
}
