-- =============================================================================
-- VowLMS — Schema Patch 023
-- Admin-editable country → payment-gateway routing, and cached FX rates for
-- international price conversion. Both are read-heavy, write-rarely tables —
-- editable without a code deploy (see public/php/lib/gateway_routing.php).
--
-- ⚠ PLACEHOLDER MAPPING: the seeded country list is Paystack's African
-- coverage as of this writing — CONFIRM against Paystack's own current
-- documentation before relying on it; their supported-country list changes.
-- Every country not explicitly listed here falls back to PayPal at query
-- time (see gateway_routing.php), so an out-of-date list only ever means a
-- learner sees PayPal instead of Paystack — never a broken checkout.
--
-- Run after 022_international_payments.sql. Re-running is safe
-- (CREATE TABLE IF NOT EXISTS / INSERT IGNORE).
-- =============================================================================

CREATE TABLE IF NOT EXISTS `gateway_config` (
  `country_code` VARCHAR(2)  NOT NULL COMMENT 'ISO 3166-1 alpha-2, matching x-vercel-ip-country. DEFAULT row is the fallback for every unlisted country.',
  `gateway`      ENUM('payfast','paystack','paypal') NOT NULL,
  `currency`     VARCHAR(3)  NOT NULL COMMENT 'What the learner is charged in for this country.',
  `enabled`      TINYINT(1)  NOT NULL DEFAULT 1,
  `updated_at`   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`country_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `gateway_config` (`country_code`, `gateway`, `currency`) VALUES
  ('ZA', 'payfast',  'ZAR'),
  ('NG', 'paystack', 'USD'),
  ('GH', 'paystack', 'USD'),
  ('KE', 'paystack', 'USD'),
  ('CI', 'paystack', 'USD'),
  ('RW', 'paystack', 'USD'),
  ('EG', 'paystack', 'USD'),
  ('DEFAULT', 'paypal', 'USD');

-- ── Cached exchange rates — Step 2 requires never calling the FX API on
--    every page load; a scheduled refresh (Afrihost cPanel cron calling
--    get-exchange-rates.php) writes here, everything else only reads it. ──
CREATE TABLE IF NOT EXISTS `exchange_rates` (
  `base_currency`  VARCHAR(3)    NOT NULL DEFAULT 'ZAR',
  `quote_currency` VARCHAR(3)    NOT NULL,
  `rate`           DECIMAL(18,8) NOT NULL COMMENT '1 base_currency = `rate` quote_currency',
  `fetched_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`base_currency`, `quote_currency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Patch 023 complete. Re-run is safe.
-- =============================================================================
