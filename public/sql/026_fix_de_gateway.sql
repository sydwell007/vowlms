-- =============================================================================
-- VowLMS — Schema Patch 026
-- Corrects a single bad row: `gateway_config` for country_code='DE' (Germany)
-- came out of the 025 migration as 'paypal' instead of 'lemonsqueezy', while
-- every other EU country code (FR, GB, IT, etc.) landed correctly — an
-- isolated data anomaly, not a code bug (INSERT IGNORE can't fix a row that
-- already exists with the wrong value, hence a targeted UPDATE here instead).
--
-- Safe to re-run: only touches the one row, only if it's still wrong.
-- =============================================================================

UPDATE `gateway_config`
SET `gateway` = 'lemonsqueezy', `currency` = 'USD'
WHERE `country_code` = 'DE' AND `gateway` != 'lemonsqueezy';

-- =============================================================================
-- Patch 026 complete. Re-run is safe.
-- =============================================================================
