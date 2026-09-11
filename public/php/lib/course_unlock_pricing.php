<?php
/**
 * Single source of truth for "what does unlocking the rest of these courses
 * cost right now" — used by the public price-display endpoint AND every
 * endpoint that actually charges someone, so the price a learner is shown
 * is always exactly the price they're charged. Never trust a client-supplied
 * price; always recompute here from `course_unlock_pricing` /
 * `course_unlock_founding_counter` / `platform_settings`.
 */

function getPlatformSettings(PDO $db): array {
    $rows = $db->query('SELECT setting_key, setting_value FROM platform_settings')->fetchAll();
    $settings = [];
    foreach ($rows as $row) $settings[$row['setting_key']] = $row['setting_value'];
    return [
        'vowrPerZar' => (float)($settings['vowr_per_zar'] ?? '1.0'),
        'vowrDiscountPercent' => (float)($settings['vowr_discount_percent'] ?? '12'),
        'bundleDiscountPercent' => (float)($settings['bundle_discount_percent'] ?? '20'),
    ];
}

/**
 * @param string[] $slugs Parent course slugs (1 = single course, 2+ = bundle,
 *   bundle discount applied automatically).
 * @return array{items: array, subtotalZar: float, isBundle: bool, bundleDiscountPercent: float, totalZar: float, vowrDiscountPercent: float, vowrPrice: int}|null
 *   null if none of the requested slugs have real pricing configured.
 */
function computeCourseUnlockPrice(PDO $db, array $slugs): ?array {
    $slugs = array_values(array_unique(array_filter(array_map('trim', $slugs))));
    if (count($slugs) === 0) return null;

    $settings = getPlatformSettings($db);
    $placeholders = implode(',', array_fill(0, count($slugs), '?'));

    $priceStmt = $db->prepare("SELECT parent_slug, price_zar, founding_price_zar, founding_cutoff FROM course_unlock_pricing WHERE parent_slug IN ($placeholders)");
    $priceStmt->execute($slugs);
    $priceRows = [];
    foreach ($priceStmt->fetchAll() as $row) $priceRows[$row['parent_slug']] = $row;

    $counterStmt = $db->prepare("SELECT parent_slug, redeemed_count FROM course_unlock_founding_counter WHERE parent_slug IN ($placeholders)");
    $counterStmt->execute($slugs);
    $counters = [];
    foreach ($counterStmt->fetchAll() as $row) $counters[$row['parent_slug']] = (int)$row['redeemed_count'];

    $items = [];
    $subtotalZar = 0.0;
    foreach ($slugs as $slug) {
        if (!isset($priceRows[$slug])) continue;
        $row = $priceRows[$slug];
        $redeemed = $counters[$slug] ?? 0;
        $foundingActive = $redeemed < (int)$row['founding_cutoff'];
        $priceZar = $foundingActive ? (float)$row['founding_price_zar'] : (float)$row['price_zar'];
        $items[] = [
            'parentSlug' => $slug,
            'standardPriceZar' => (float)$row['price_zar'],
            'priceZar' => $priceZar,
            'foundingActive' => $foundingActive,
            'foundingSlotsLeft' => max(0, (int)$row['founding_cutoff'] - $redeemed),
        ];
        $subtotalZar += $priceZar;
    }

    if (count($items) === 0) return null;

    $isBundle = count($items) > 1;
    $totalZar = $isBundle ? round($subtotalZar * (1 - $settings['bundleDiscountPercent'] / 100), 2) : round($subtotalZar, 2);
    $vowrPrice = (int)ceil($totalZar * (1 - $settings['vowrDiscountPercent'] / 100) * $settings['vowrPerZar']);

    return [
        'items' => $items,
        'subtotalZar' => round($subtotalZar, 2),
        'isBundle' => $isBundle,
        'bundleDiscountPercent' => $isBundle ? $settings['bundleDiscountPercent'] : 0,
        'totalZar' => $totalZar,
        'vowrDiscountPercent' => $settings['vowrDiscountPercent'],
        'vowrPrice' => $vowrPrice,
    ];
}

/** Real child `courses.id`s a set of parent-course unlocks actually grants. */
function getCourseUnlockChildIds(PDO $db, array $parentSlugs): array {
    $parentSlugs = array_values(array_unique(array_filter(array_map('trim', $parentSlugs))));
    if (count($parentSlugs) === 0) return [];
    $placeholders = implode(',', array_fill(0, count($parentSlugs), '?'));
    $stmt = $db->prepare("SELECT DISTINCT child_course_id FROM course_unlock_children WHERE parent_slug IN ($placeholders)");
    $stmt->execute($parentSlugs);
    return array_column($stmt->fetchAll(), 'child_course_id');
}
