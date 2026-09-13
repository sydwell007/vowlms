-- =============================================================================
-- VowLMS — Schema Patch 024
-- Fixes a real bug in 023_gateway_config.sql: `country_code VARCHAR(2)` is too
-- narrow for the seeded `'DEFAULT'` fallback row (7 chars) — under strict SQL
-- mode that INSERT fails outright (or truncates/gets skipped depending on
-- server config), which silently breaks the fallback route for any country
-- not explicitly listed and can surface as an uncaught DB error to callers
-- that don't defend against it.
--
-- Safe to re-run: ALTER ... MODIFY is idempotent at the target width, and the
-- INSERT is IGNORE.
-- =============================================================================

ALTER TABLE `gateway_config`
  MODIFY COLUMN `country_code` VARCHAR(10) NOT NULL
    COMMENT 'ISO 3166-1 alpha-2, matching x-vercel-ip-country, or the literal string DEFAULT for the fallback row.';

INSERT IGNORE INTO `gateway_config` (`country_code`, `gateway`, `currency`) VALUES
  ('ZA', 'payfast',  'ZAR'),
  ('NG', 'paystack', 'USD'),
  ('GH', 'paystack', 'USD'),
  ('KE', 'paystack', 'USD'),
  ('CI', 'paystack', 'USD'),
  ('RW', 'paystack', 'USD'),
  ('EG', 'paystack', 'USD'),
  ('DEFAULT', 'paypal', 'USD');

-- =============================================================================
-- Patch 024 complete. Re-run is safe.
-- =============================================================================
