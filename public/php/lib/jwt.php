<?php
require_once __DIR__ . '/../config/env.php';

class JWT {
    private static function b64e(array $data): string {
        return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '=');
    }

    private static function b64d(string $data): string {
        $padded = $data . str_repeat('=', (4 - strlen($data) % 4) % 4);
        return base64_decode(strtr($padded, '-_', '+/'));
    }

    private static function sign(string $input, string $secret): string {
        return rtrim(strtr(base64_encode(hash_hmac('sha256', $input, $secret, true)), '+/', '-_'), '=');
    }

    public static function encode(array $payload, int $ttl = 2592000): string {
        $secret = env('JWT_SECRET');
        $header = self::b64e(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttl;
        $body = self::b64e($payload);
        $sig  = self::sign("{$header}.{$body}", $secret);
        return "{$header}.{$body}.{$sig}";
    }

    public static function decode(string $token): ?array {
        $secret = env('JWT_SECRET');
        $parts  = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $body, $sig] = $parts;

        if (!hash_equals(self::sign("{$header}.{$body}", $secret), $sig)) return null;

        $payload = json_decode(self::b64d($body), true);
        if (!is_array($payload)) return null;
        if (isset($payload['exp']) && $payload['exp'] < time()) return null;

        return $payload;
    }
}
