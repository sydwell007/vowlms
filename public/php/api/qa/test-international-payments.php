<?php
/**
 * Temporary diagnostic — pinpoints exactly where the international-payments
 * pricing endpoint is failing in production (missing table, bad require,
 * gateway_config lookup, exchange-rate cache, etc.) without exposing
 * anything sensitive. Bridge-key only, no user auth, no secrets in the
 * response. Delete this file once the real issue is found and fixed.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$report = [
    'phpVersion' => PHP_VERSION,
    'steps' => [],
];

function step(array &$report, string $name, callable $fn): void {
    try {
        $report['steps'][$name] = ['ok' => true, 'result' => $fn()];
    } catch (Throwable $e) {
        $report['steps'][$name] = [
            'ok' => false,
            'error' => $e->getMessage(),
            'type' => get_class($e),
            'file' => basename($e->getFile()),
            'line' => $e->getLine(),
        ];
    }
}

step($report, 'db_connect', function () {
    $db = getDb();
    return 'connected';
});

$db = getDb();

step($report, 'require_course_unlock_pricing', function () {
    require_once __DIR__ . '/../../lib/course_unlock_pricing.php';
    return 'loaded';
});

step($report, 'require_gateway_routing', function () {
    require_once __DIR__ . '/../../lib/gateway_routing.php';
    return 'loaded';
});

step($report, 'require_exchange_rates', function () {
    require_once __DIR__ . '/../../lib/exchange_rates.php';
    return 'loaded';
});

step($report, 'require_international_pricing', function () {
    require_once __DIR__ . '/../../lib/international_pricing.php';
    return 'loaded';
});

step($report, 'table_gateway_config', function () use ($db) {
    $stmt = $db->query('SELECT COUNT(*) AS c FROM gateway_config');
    return (int)$stmt->fetch()['c'] . ' rows';
});

step($report, 'table_exchange_rates', function () use ($db) {
    $stmt = $db->query('SELECT COUNT(*) AS c FROM exchange_rates');
    return (int)$stmt->fetch()['c'] . ' rows';
});

step($report, 'table_international_payments', function () use ($db) {
    $stmt = $db->query('SELECT COUNT(*) AS c FROM international_payments');
    return (int)$stmt->fetch()['c'] . ' rows';
});

step($report, 'gateway_config_country_code_column', function () use ($db) {
    $stmt = $db->query("SHOW COLUMNS FROM gateway_config LIKE 'country_code'");
    $col = $stmt->fetch();
    return $col ? $col['Type'] : 'column not found';
});

step($report, 'gateway_config_de_fr_gb_row', function () use ($db) {
    $stmt = $db->query("SELECT country_code, gateway, currency, enabled, HEX(country_code) AS hex_code FROM gateway_config WHERE country_code IN ('DE','FR','GB','DEFAULT')");
    return json_encode($stmt->fetchAll());
});

step($report, 'gateway_config_all_rows', function () use ($db) {
    $stmt = $db->query("SELECT country_code, gateway FROM gateway_config ORDER BY country_code");
    return json_encode($stmt->fetchAll());
});

step($report, 'resolve_gateway_ZA', function () use ($db) {
    return function_exists('resolveGatewayForCountry') ? json_encode(resolveGatewayForCountry($db, 'ZA')) : 'function missing';
});

step($report, 'resolve_gateway_DEFAULT', function () use ($db) {
    return function_exists('resolveGatewayForCountry') ? json_encode(resolveGatewayForCountry($db, 'XX')) : 'function missing';
});

step($report, 'compute_course_unlock_price', function () use ($db) {
    return function_exists('computeCourseUnlockPrice')
        ? json_encode(computeCourseUnlockPrice($db, ['business-ethics']))
        : 'function missing';
});

step($report, 'compute_international_unlock_price_ZA', function () use ($db) {
    return function_exists('computeInternationalUnlockPrice')
        ? json_encode(computeInternationalUnlockPrice($db, ['business-ethics'], 'ZA'))
        : 'function missing';
});

jsonOk($report);
