<?php
/**
 * Public, read-only international pricing preview — the ZAR price plus the
 * gateway/currency this learner's (server-detected, Next.js-forwarded)
 * country routes to, and the converted display amount if a fresh exchange
 * rate is cached. Never the endpoint that actually charges anyone; see
 * paystack-verify-transaction.php / paypal-create-order.php /
 * paypal-capture-order.php for that — all three recompute this same way
 * independently at the moment of charging, never trusting a client-supplied
 * amount.
 *
 * GET /courses/unlock-price-international?slugs=business-ethics&country=NG
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/international_pricing.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('GET');

$db = getDb();

$slugsParam = trim($_GET['slugs'] ?? '');
if ($slugsParam === '') jsonError('slugs is required');
$slugs = explode(',', $slugsParam);
if (count($slugs) > 10) jsonError('Too many courses in one request');

// The `country` here is always forwarded by the Next.js layer from the real
// x-vercel-ip-country header on the learner's own request — this bridge
// only ever receives trusted server-to-server calls, never a request
// directly from a learner's browser.
$countryCode = trim($_GET['country'] ?? 'DEFAULT');
// Set only when a learner explicitly picked a gateway via "Other payment
// options" — resolves that gateway's own real currency, never the
// auto-detected country's.
$gatewayOverride = trim($_GET['gateway'] ?? '') ?: null;

$result = computeInternationalUnlockPrice($db, $slugs, $countryCode, $gatewayOverride);
if ($result === null) jsonError('None of the requested courses have unlock pricing configured', 404);

jsonOk($result);
