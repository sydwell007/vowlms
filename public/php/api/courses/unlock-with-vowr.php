<?php
/**
 * Spend VOWR to unlock the rest of one or more Upskilling courses (a single
 * course, or a Career Path bundle of several). Instant — the same real
 * reward_events ledger every other VOWR spend already uses, not a
 * pending/admin-reviewed request; a learner should see access unlock the
 * moment payment clears, exactly like the cash path does.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/course_unlock_pricing.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
$userId = $payload['sub'];
$db = getDb();

$body = getJsonBody();
$parentSlugs = is_array($body['parentSlugs'] ?? null) ? $body['parentSlugs'] : [];
if (count($parentSlugs) === 0) jsonError('parentSlugs is required');

$pricing = computeCourseUnlockPrice($db, $parentSlugs);
if ($pricing === null) jsonError('None of the requested courses have unlock pricing configured', 404);
$vowrPrice = $pricing['vowrPrice'];
$realSlugs = array_column($pricing['items'], 'parentSlug');

$childCourseIds = getCourseUnlockChildIds($db, $realSlugs);
if (count($childCourseIds) === 0) jsonError('No unlockable modules found for these courses', 404);

try {
    $db->beginTransaction();

    $balStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ? FOR UPDATE');
    $balStmt->execute([$userId]);
    $balance = (int)$balStmt->fetchColumn();
    if ($balance < $vowrPrice) {
        $db->rollBack();
        jsonError('Insufficient VOWR balance', 400);
    }

    // Re-check + re-lock the founding counter for a single-course purchase
    // inside this same transaction, so two concurrent buyers can never both
    // land under the cutoff for the last slot. Bundles don't carry a
    // founding discount of their own (see computeCourseUnlockPrice) so the
    // counter is only relevant for a single-course purchase.
    if (!$pricing['isBundle']) {
        $slug = $realSlugs[0];
        $lockStmt = $db->prepare('SELECT redeemed_count FROM course_unlock_founding_counter WHERE parent_slug = ? FOR UPDATE');
        $lockStmt->execute([$slug]);
        $lockStmt->fetch();
        $db->prepare('UPDATE course_unlock_founding_counter SET redeemed_count = redeemed_count + 1 WHERE parent_slug = ?')
            ->execute([$slug]);
    }

    $eventId = generateId();
    $db->prepare(
        'INSERT INTO reward_events (id, user_id, event, points, metadata) VALUES (?, ?, ?, ?, ?)'
    )->execute([
        $eventId, $userId, 'course_unlock:' . implode(',', $realSlugs), -$vowrPrice,
        json_encode(['parentSlugs' => $realSlugs, 'vowrPrice' => $vowrPrice, 'isBundle' => $pricing['isBundle']]),
    ]);

    $enrolledCount = 0;
    $enrollStmt = $db->prepare('INSERT IGNORE INTO enrollments (id, user_id, course_id, status, progress) VALUES (?, ?, ?, "active", 0)');
    foreach ($childCourseIds as $courseId) {
        $enrollStmt->execute([generateId(), $userId, $courseId]);
        if ($enrollStmt->rowCount() === 1) $enrolledCount++;
    }

    $redemptionId = generateId();
    $db->prepare(
        'INSERT INTO redemption_requests (id, user_id, redemption_type, vowr_amount, status, metadata, fulfilled_at)
         VALUES (?, ?, ?, ?, "fulfilled", ?, NOW())'
    )->execute([
        $redemptionId, $userId, 'course_unlock', $vowrPrice,
        json_encode(['parentSlugs' => $realSlugs, 'isBundle' => $pricing['isBundle'], 'unlockedModules' => $enrolledCount]),
    ]);

    $db->commit();
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    error_log('Course unlock with VOWR failed: ' . $error->getMessage());
    jsonError('Could not unlock the course right now', 500);
}

$newBalStmt = $db->prepare('SELECT COALESCE(SUM(points),0) FROM reward_events WHERE user_id = ?');
$newBalStmt->execute([$userId]);

jsonCreated([
    'status' => 'completed',
    'parentSlugs' => $realSlugs,
    'vowrSpent' => $vowrPrice,
    'balance' => (int)$newBalStmt->fetchColumn(),
    'unlockedModules' => $enrolledCount,
    'message' => count($realSlugs) > 1
        ? 'Bundle unlocked — ' . $vowrPrice . ' VOWR spent.'
        : 'Course unlocked — ' . $vowrPrice . ' VOWR spent.',
]);
