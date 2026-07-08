<?php
/**
 * Environment variable helper.
 * Auto-loads config/env.local.php if present (set PHP-side secrets there).
 */

// Auto-load the local PHP env file (upload this to Afrihost: config/env.local.php)
$_envLocal = __DIR__ . '/env.local.php';
if (file_exists($_envLocal)) {
    require_once $_envLocal;
}
unset($_envLocal);

function env(string $key, string $default = ''): string {
    $val = getenv($key);
    if ($val !== false) return (string)$val;
    return $_ENV[$key] ?? $default;
}
