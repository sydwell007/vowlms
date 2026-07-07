<?php
/**
 * Environment variable helper.
 * On Afrihost: set values in cPanel → PHP Config, or in a .env file.
 */
function env(string $key, string $default = ''): string {
    $val = getenv($key);
    if ($val !== false) return (string)$val;
    return $_ENV[$key] ?? $default;
}
