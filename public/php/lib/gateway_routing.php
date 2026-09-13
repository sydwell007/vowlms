<?php
/**
 * Country → payment gateway routing for international course-unlock
 * checkout. South Africa always routes to the existing PayFast integration
 * (unchanged); Paystack's African markets and everyone else fall back to
 * PayPal. Reads `gateway_config` so this can be retuned without a deploy —
 * see public/sql/023_gateway_config.sql for the seeded mapping and its
 * "confirm against Paystack's current docs" caveat.
 */

/**
 * @return array{gateway: string, currency: string, countryCode: string}
 */
function resolveGatewayForCountry(PDO $db, string $countryCode): array {
    $countryCode = strtoupper(trim($countryCode)) ?: 'DEFAULT';

    $stmt = $db->prepare('SELECT gateway, currency FROM gateway_config WHERE country_code = ? AND enabled = 1');
    $stmt->execute([$countryCode]);
    $row = $stmt->fetch();

    if (!$row) {
        $stmt->execute(['DEFAULT']);
        $row = $stmt->fetch();
    }

    // Even the DEFAULT row could theoretically be disabled or missing (e.g.
    // a fresh install before the seed migration ran) — never leave a learner
    // with no way to pay at all.
    if (!$row) {
        return ['gateway' => 'paypal', 'currency' => 'USD', 'countryCode' => $countryCode];
    }

    return ['gateway' => $row['gateway'], 'currency' => $row['currency'], 'countryCode' => $countryCode];
}

/**
 * Used when a learner explicitly picks "Other payment options" and asks for
 * a specific gateway rather than the one their country auto-routed to —
 * each gateway has exactly one currency it's ever configured for here
 * (PayFast is always ZAR; Paystack/PayPal use whatever `gateway_config`
 * seeds them with), so this never lets a learner see/pay a currency a
 * gateway doesn't actually support.
 *
 * @return array{gateway: string, currency: string, countryCode: string}|null null if that gateway has no configured currency at all.
 */
function resolveGatewayConfigByGateway(PDO $db, string $gateway): ?array {
    if ($gateway === 'payfast') {
        return ['gateway' => 'payfast', 'currency' => 'ZAR', 'countryCode' => 'ZA'];
    }

    $stmt = $db->prepare('SELECT country_code, currency FROM gateway_config WHERE gateway = ? AND enabled = 1 LIMIT 1');
    $stmt->execute([$gateway]);
    $row = $stmt->fetch();
    if (!$row) return null;

    return ['gateway' => $gateway, 'currency' => $row['currency'], 'countryCode' => $row['country_code']];
}
