<?php
/**
 * Public, read-only pricing for unlocking the rest of one or more Upskilling
 * courses (everything after the free Module 1) — cash and VOWR, with the
 * founding-learner discount and (for 2+ courses) the bundle discount already
 * applied, so the paywall UI never has to duplicate this math client-side.
 * The exact same computeCourseUnlockPrice() also runs (never trusted from
 * the client) inside every endpoint that actually charges someone.
 *
 * GET /courses/unlock-price?slugs=business-ethics,leadership
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
requireMethod('GET');

$db = getDb();

$slugsParam = trim($_GET['slugs'] ?? '');
if ($slugsParam === '') jsonError('slugs is required');
$slugs = explode(',', $slugsParam);
if (count($slugs) > 10) jsonError('Too many courses in one request');

$result = computeCourseUnlockPrice($db, $slugs);
if ($result === null) jsonError('None of the requested courses have unlock pricing configured', 404);

jsonOk($result);
