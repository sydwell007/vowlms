<?php
require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

function requireBridgeKey(): void {
    $expected = env('BRIDGE_API_KEY');
    $provided = $_SERVER['HTTP_X_BRIDGE_KEY'] ?? '';
    if ($expected === '' || !hash_equals($expected, $provided)) {
        jsonError('Forbidden', 403);
    }
}

/** Returns decoded JWT payload or exits with 401 */
function requireAuth(): array {
    $auth  = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = '';

    if (str_starts_with($auth, 'Bearer ')) {
        $token = substr($auth, 7);
    }

    if ($token === '') {
        jsonError('Unauthorized — no token provided', 401);
    }

    $payload = JWT::decode($token);
    if ($payload === null) {
        jsonError('Unauthorized — invalid or expired token', 401);
    }

    return $payload;
}

/** Exit with 403 if the user's role is not in the allowed list */
function requireRole(array $payload, string ...$roles): void {
    if (!in_array($payload['role'] ?? '', $roles, true)) {
        jsonError('Forbidden — insufficient permissions', 403);
    }
}
