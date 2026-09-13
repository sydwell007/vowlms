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
  `country_code` VARCHAR(10) NOT NULL COMMENT 'ISO 3166-1 alpha-2, matching x-vercel-ip-country, or the literal string DEFAULT for the fallback row.',
  `gateway`      ENUM('payfast','paystack','paypal','lemonsqueezy') NOT NULL,
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
  -- EU (27 members) + UK — routed to Lemon Squeezy, a merchant-of-record
  -- gateway that calculates, collects, and remits EU/UK VAT itself, so
  -- VowLMS never has to register for VAT in any of these jurisdictions.
  -- Lemon Squeezy always settles in USD regardless of buyer country, hence
  -- 'USD' here too — see lemonsqueezy_client.php.
  ('AT', 'lemonsqueezy', 'USD'), ('BE', 'lemonsqueezy', 'USD'), ('BG', 'lemonsqueezy', 'USD'),
  ('HR', 'lemonsqueezy', 'USD'), ('CY', 'lemonsqueezy', 'USD'), ('CZ', 'lemonsqueezy', 'USD'),
  ('DK', 'lemonsqueezy', 'USD'), ('EE', 'lemonsqueezy', 'USD'), ('FI', 'lemonsqueezy', 'USD'),
  ('FR', 'lemonsqueezy', 'USD'), ('DE', 'lemonsqueezy', 'USD'), ('GR', 'lemonsqueezy', 'USD'),
  ('HU', 'lemonsqueezy', 'USD'), ('IE', 'lemonsqueezy', 'USD'), ('IT', 'lemonsqueezy', 'USD'),
  ('LV', 'lemonsqueezy', 'USD'), ('LT', 'lemonsqueezy', 'USD'), ('LU', 'lemonsqueezy', 'USD'),
  ('MT', 'lemonsqueezy', 'USD'), ('NL', 'lemonsqueezy', 'USD'), ('PL', 'lemonsqueezy', 'USD'),
  ('PT', 'lemonsqueezy', 'USD'), ('RO', 'lemonsqueezy', 'USD'), ('SK', 'lemonsqueezy', 'USD'),
  ('SI', 'lemonsqueezy', 'USD'), ('ES', 'lemonsqueezy', 'USD'), ('SE', 'lemonsqueezy', 'USD'),
  ('GB', 'lemonsqueezy', 'USD'),
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
