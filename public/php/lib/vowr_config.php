<?php
/**
 * Single source of truth for everything VOWR-valuation-related: the
 * VOWR↔ZAR exchange rate, the max % of a course price payable in VOWR, and
 * the reservation hold duration for the hybrid partial-redemption checkout.
 * Every endpoint that prices or charges VOWR (course_unlock_pricing.php's
 * all-VOWR path, the new reserve/commit/release hybrid-checkout endpoints,
 * and any future caller) must read these values from here — never
 * hardcode/duplicate them locally, and never trust a client-supplied rate,
 * percentage, or VOWR amount.
 *
 * Backed by `platform_settings` (matches the convention
 * course_unlock_pricing.php's getPlatformSettings() already established),
 * so the rate can be changed by an admin without a code deploy.
 *
 * Rate history: from launch through 2026-09-14, vowr_per_zar was 1.0
 * (≈1 VOWR = R1). It was rescaled to 100 (100 VOWR = R1) on 2026-09-14 by
 * public/sql/032_vowr_valuation_rescale.sql, which multiplied every existing
 * reward_events row by 100 in the same migration so real ZAR purchasing
 * power was preserved for learners who already held a balance. See
 * docs/audits/VOWLMS_VOWR_BASELINE_AUDIT.md §4 and
 * docs/vowrewards/VOWR_EARNING_AND_REDEMPTION_MODEL.md for the full context
 * — do not change vowr_per_zar again without the same explicit review.
 */

/** @return array{vowrPerZar: float, vowrDiscountPercent: float, bundleDiscountPercent: float, maxRedemptionPercent: float, reservationTtlMinutes: int} */
function getVowrConfig(PDO $db): array {
    $rows = $db->query('SELECT setting_key, setting_value FROM platform_settings')->fetchAll();
    $settings = [];
    foreach ($rows as $row) $settings[$row['setting_key']] = $row['setting_value'];

    return [
        'vowrPerZar' => (float)($settings['vowr_per_zar'] ?? '100'),
        'vowrDiscountPercent' => (float)($settings['vowr_discount_percent'] ?? '12'),
        'bundleDiscountPercent' => (float)($settings['bundle_discount_percent'] ?? '20'),
        'maxRedemptionPercent' => (float)($settings['vowr_max_redemption_percent'] ?? '12'),
        'reservationTtlMinutes' => (int)($settings['vowr_reservation_ttl_minutes'] ?? '30'),
    ];
}

/**
 * Bundle-size redemption tiers: the more courses in a single unlock, the
 * smaller the % of the (larger) total price a learner may cover with VOWR.
 * Scaffolded per spec even though no purchasable bundle preset currently
 * exists beyond the existing ad-hoc multi-slug unlock path — real bundle
 * products are a future phase; this tiering only takes effect the moment
 * `$itemCount` > 1, which the existing computeCourseUnlockPrice() bundle
 * path already supports.
 */
function getMaxRedemptionPercentForBundleSize(PDO $db, int $itemCount): float {
    $config = getVowrConfig($db);
    $tiers = [1 => $config['maxRedemptionPercent'], 2 => 10.0, 3 => 8.0, 4 => 5.0];
    if ($itemCount <= 0) return 0.0;
    return $tiers[$itemCount] ?? 3.0; // 5+ items
}

/**
 * Computes a validated, server-clamped partial VOWR redemption against a
 * real course price. The caller (reserve endpoint) still re-checks the
 * learner's actual balance with SELECT ... FOR UPDATE inside its own
 * transaction before debiting anything — this function only calculates the
 * ceiling and the resulting split, it never touches the ledger.
 *
 * @param float $totalZar Real server-computed course/bundle price (from
 *   computeCourseUnlockPrice()), never a client-supplied price.
 * @param int $itemCount Number of parent courses in this unlock (1 = single
 *   course) — drives the bundle redemption tier.
 * @param int $requestedVowr What the learner asked to redeem (client input —
 *   untrusted, clamped below, never charged directly).
 * @param int $availableBalance The learner's real current VOWR balance
 *   (already fetched by the caller under FOR UPDATE).
 * @return array{maxVowr: int, maxPercent: float, vowrPerZar: float, vowrAmount: int, vowrValueZar: float, cashAmountZar: float}
 */
function computePartialVowrRedemption(PDO $db, float $totalZar, int $itemCount, int $requestedVowr, int $availableBalance): array {
    $config = getVowrConfig($db);
    $maxPercent = getMaxRedemptionPercentForBundleSize($db, $itemCount);

    $maxRedeemableZar = round($totalZar * ($maxPercent / 100), 2);
    $maxVowr = (int)floor($maxRedeemableZar * $config['vowrPerZar']);

    $vowrAmount = max(0, min($requestedVowr, $maxVowr, $availableBalance));
    $vowrValueZar = round($vowrAmount / $config['vowrPerZar'], 2);
    $cashAmountZar = round($totalZar - $vowrValueZar, 2);

    return [
        'maxVowr' => $maxVowr,
        'maxPercent' => $maxPercent,
        'vowrPerZar' => $config['vowrPerZar'],
        'vowrAmount' => $vowrAmount,
        'vowrValueZar' => $vowrValueZar,
        'cashAmountZar' => $cashAmountZar,
    ];
}

/**
 * Commits a `reserved` VOWR reservation once its matching cash payment has
 * been verified for real (never call this from a client-reported "success"
 * alone). No ledger effect — the debit already happened at reservation time
 * in unlock-reserve-vowr.php; this only flips the reservation's status so it
 * can never be released/double-spent later, and records which real payment
 * it belongs to. Caller must run this inside its own transaction alongside
 * the enrollment grant. Idempotent: a reservation not in `reserved` status
 * is left untouched and `false` is returned (so an already-committed
 * reservation being hit twice — e.g. webhook + verify both firing — is safe).
 */
function commitVowrReservation(PDO $db, string $reservationId, string $userId, string $externalReference): bool {
    $stmt = $db->prepare(
        'UPDATE course_unlock_vowr_reservations
         SET status = "committed", external_reference = ?, committed_at = NOW()
         WHERE id = ? AND user_id = ? AND status = "reserved"'
    );
    $stmt->execute([$externalReference, $reservationId, $userId]);
    return $stmt->rowCount() === 1;
}

/**
 * Releases a `reserved` VOWR reservation that will never be paid for (cash
 * leg failed/cancelled, or it simply expired unused) — refunds the VOWR via
 * a compensating positive reward_events row so the learner's balance is
 * exactly as if the reservation had never been made. Idempotent: only a row
 * still in `reserved` status is touched; already-committed/released/expired
 * rows are left alone.
 */
function releaseVowrReservation(PDO $db, string $reservationId, string $reason = 'released'): bool {
    $stmt = $db->prepare('SELECT * FROM course_unlock_vowr_reservations WHERE id = ? FOR UPDATE');
    $stmt->execute([$reservationId]);
    $reservation = $stmt->fetch();
    if (!$reservation || $reservation['status'] !== 'reserved') return false;

    $newStatus = $reason === 'expired' ? 'expired' : 'released';
    $releaseEventId = generateId();

    $db->prepare(
        'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
    )->execute([
        $releaseEventId, $reservation['user_id'], 'vowr_release:' . $reservationId, (int)$reservation['vowr_amount'],
        json_encode(['reservationId' => $reservationId, 'reason' => $newStatus]),
    ]);

    $db->prepare(
        "UPDATE course_unlock_vowr_reservations
         SET status = ?, release_reward_event_id = ?, released_at = NOW()
         WHERE id = ? AND status = 'reserved'"
    )->execute([$newStatus, $releaseEventId, $reservationId]);

    return true;
}
