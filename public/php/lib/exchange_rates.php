<?php
/**
 * Cached ZAR → foreign-currency conversion. The external FX API is called
 * ONLY by the scheduled refresh script (get-exchange-rates.php, run via
 * Afrihost cron) — every other caller reads the cache here. This keeps
 * page loads and checkout requests fast and independent of a third-party
 * API's uptime, and matches the "never call the FX API on every page load"
 * requirement.
 */

const EXCHANGE_RATE_MAX_AGE_HOURS = 36; // one missed daily cron run is still tolerated

/**
 * @return array{rate: float, fetchedAt: string}|null null if no cached rate
 *   exists yet, or the cached rate is stale beyond EXCHANGE_RATE_MAX_AGE_HOURS
 *   — callers must treat both as "conversion unavailable right now", never
 *   fall back to a guessed/hardcoded rate.
 */
function getCachedExchangeRate(PDO $db, string $quoteCurrency, string $baseCurrency = 'ZAR'): ?array {
    if ($quoteCurrency === $baseCurrency) {
        return ['rate' => 1.0, 'fetchedAt' => date('c')];
    }

    $stmt = $db->prepare(
        'SELECT rate, fetched_at FROM exchange_rates WHERE base_currency = ? AND quote_currency = ?'
    );
    $stmt->execute([$baseCurrency, $quoteCurrency]);
    $row = $stmt->fetch();
    if (!$row) return null;

    $ageHours = (time() - strtotime($row['fetched_at'])) / 3600;
    if ($ageHours > EXCHANGE_RATE_MAX_AGE_HOURS) return null;

    return ['rate' => (float)$row['rate'], 'fetchedAt' => $row['fetched_at']];
}

/**
 * Server-side-only conversion of a real ZAR amount into the learner's
 * display/charge currency. Returns null (never a fabricated number) when no
 * fresh cached rate exists — callers must surface "unavailable", exactly
 * like the existing computeCourseUnlockPrice() -> null convention.
 *
 * @return array{amount: float, rate: float}|null
 */
function convertZarAmount(PDO $db, float $amountZar, string $quoteCurrency): ?array {
    $cached = getCachedExchangeRate($db, $quoteCurrency);
    if ($cached === null) return null;

    return [
        'amount' => round($amountZar * $cached['rate'], 2),
        'rate' => $cached['rate'],
    ];
}
