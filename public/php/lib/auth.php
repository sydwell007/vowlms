<?php
require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

function requireBridgeKey(): void {
    $expected = env('BRIDGE_API_KEY');

    // 1. mod_php — header arrives in $_SERVER directly
    $provided = $_SERVER['HTTP_X_BRIDGE_KEY'] ?? '';

    // 2. PHP-FPM / CGI — use getallheaders() (works in PHP 8+)
    if ($provided === '' && function_exists('getallheaders')) {
        $all = getallheaders();
        // Apache lowercases header names in FPM mode
        $provided = $all['X-Bridge-Key']
                 ?? $all['x-bridge-key']
                 ?? $all['X-BRIDGE-KEY']
                 ?? '';
    }

    // 3. apache_request_headers() fallback (alias of getallheaders())
    if ($provided === '' && function_exists('apache_request_headers')) {
        $hdrs = apache_request_headers();
        $provided = $hdrs['X-Bridge-Key']
                 ?? $hdrs['x-bridge-key']
                 ?? '';
    }

    // 4. .htaccess RewriteRule may inject it as a custom env var
    if ($provided === '') {
        $provided = $_SERVER['BRIDGE_KEY_HEADER'] ?? '';
    }

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

    // PHP-FPM fallback: getallheaders() sometimes surfaces the header when $_SERVER doesn't
    if ($token === '' && function_exists('getallheaders')) {
        $all  = getallheaders();
        $auth = $all['Authorization'] ?? $all['authorization'] ?? '';
        if (str_starts_with($auth, 'Bearer ')) {
            $token = substr($auth, 7);
        }
    }

    // Apache internal-redirect fallback: .htaccess [E=HTTP_AUTHORIZATION:...] survives
    // rewrites as REDIRECT_HTTP_AUTHORIZATION when Apache passes the request to PHP-FPM
    if ($token === '') {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($auth, 'Bearer ')) {
            $token = substr($auth, 7);
        }
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
