<?php
/**
 * Composes the existing computeCourseUnlockPrice() (the one and only
 * canonical ZAR price) with gateway_routing.php + exchange_rates.php to
 * produce what a specific learner (identified by their detected country)
 * should see and be charged. Never a second source of truth for price —
 * this file only ever converts/displays the real ZAR figure.
 */
require_once __DIR__ . '/course_unlock_pricing.php';
require_once __DIR__ . '/gateway_routing.php';
require_once __DIR__ . '/exchange_rates.php';

/**
 * @param string|null $gatewayOverride When a learner explicitly picks a
 *   gateway via "Other payment options" rather than their auto-detected
 *   one — always resolves that gateway's own real configured currency
 *   (e.g. PayFast is always ZAR), never mixes a gateway with the wrong
 *   currency.
 * @return array{
 *   zar: array, gateway: string, currency: string, countryCode: string,
 *   amountCharged: float|null, exchangeRate: float|null, conversionAvailable: bool
 * }|null null when computeCourseUnlockPrice() returns null (unknown course
 *   slugs) or when $gatewayOverride names a gateway with no configured
 *   currency at all — a missing exchange rate is NOT a null return, it's
 *   `conversionAvailable: false` on an otherwise-complete response, so the
 *   ZAR/PayFast/VOWR paths keep working even if FX data is stale.
 */
function computeInternationalUnlockPrice(PDO $db, array $slugs, string $countryCode, ?string $gatewayOverride = null): ?array {
    $zar = computeCourseUnlockPrice($db, $slugs);
    if ($zar === null) return null;

    if ($gatewayOverride !== null) {
        $route = resolveGatewayConfigByGateway($db, $gatewayOverride);
        if ($route === null) return null;
    } else {
        $route = resolveGatewayForCountry($db, $countryCode);
    }

    if ($route['gateway'] === 'payfast') {
        return [
            'zar' => $zar,
            'gateway' => 'payfast',
            'currency' => 'ZAR',
            'countryCode' => $route['countryCode'],
            'amountCharged' => $zar['totalZar'],
            'exchangeRate' => 1.0,
            'conversionAvailable' => true,
        ];
    }

    $converted = convertZarAmount($db, (float)$zar['totalZar'], $route['currency']);

    return [
        'zar' => $zar,
        'gateway' => $route['gateway'],
        'currency' => $route['currency'],
        'countryCode' => $route['countryCode'],
        'amountCharged' => $converted['amount'] ?? null,
        'exchangeRate' => $converted['rate'] ?? null,
        'conversionAvailable' => $converted !== null,
    ];
}

/** True when the user already owns every real course this purchase would unlock — used by every
 *  paid-unlock endpoint (VOWR, PayFast, Paystack, PayPal) to refuse a redundant repeat charge. */
function alreadyOwnsAllCourses(PDO $db, string $userId, array $childCourseIds): bool {
    if (count($childCourseIds) === 0) return false;
    $placeholders = implode(',', array_fill(0, count($childCourseIds), '?'));
    $stmt = $db->prepare(
        "SELECT COUNT(*) FROM enrollments WHERE user_id = ? AND course_id IN ($placeholders) AND status IN ('active','completed')"
    );
    $stmt->execute([$userId, ...$childCourseIds]);
    return (int)$stmt->fetchColumn() >= count($childCourseIds);
}

/**
 * Shared "grant access after a verified international payment" step —
 * enrolls every real child course and, for a single-course (non-bundle)
 * purchase, advances the founding-learner counter, exactly matching the
 * PayFast/VOWR unlock behavior. Called only after the caller has already
 * verified the payment is real and paid in full.
 *
 * @return int number of real child courses newly enrolled (0 is valid —
 *   means every course was already owned, e.g. a retried webhook).
 */
function grantInternationalCourseUnlock(PDO $db, string $userId, array $realParentSlugs, array $childCourseIds, bool $isBundle): int {
    $enrolledCount = 0;
    $enrollStmt = $db->prepare('INSERT IGNORE INTO enrollments (id, user_id, course_id, status, progress) VALUES (?, ?, ?, "active", 0)');
    foreach ($childCourseIds as $courseId) {
        $enrollStmt->execute([generateId(), $userId, $courseId]);
        if ($enrollStmt->rowCount() === 1) $enrolledCount++;
    }

    if (!$isBundle && count($realParentSlugs) === 1) {
        $db->prepare('UPDATE course_unlock_founding_counter SET redeemed_count = redeemed_count + 1 WHERE parent_slug = ?')
            ->execute([$realParentSlugs[0]]);
    }

    return $enrolledCount;
}
