-- =============================================================================
-- VowLMS — Schema Patch 032
-- Rescales the whole VOWR economy from the current live rate (~1 VOWR = R1,
-- `platform_settings.vowr_per_zar = 1.0`) to 100 VOWR = R1 (1 VOWR = R0.01),
-- per explicit user decision 2026-09-14 — see
-- docs/audits/VOWLMS_VOWR_BASELINE_AUDIT.md §4 for the conflict this
-- resolves. This is a UNIT rescale, not a value cut: every existing
-- `reward_events` row is multiplied by 100 in the SAME migration, so a
-- learner who already holds a real balance today keeps the same real ZAR
-- purchasing power after this runs (e.g. 184 VOWR ≈ R184 today becomes
-- 18,400 VOWR ≈ R184 after).
--
-- Also adds two new platform_settings keys that drive the new partial/hybrid
-- VOWR redemption model (public/php/lib/vowr_config.php reads these, not
-- hardcoded PHP constants, matching this table's existing role as the single
-- source of truth for VOWR economics).
--
-- Idempotent: guarded by the current value of vowr_per_zar, so re-running
-- this file after it has already applied is a no-op (does not re-multiply
-- reward_events a second time).
-- =============================================================================

SET @current_rate = (SELECT setting_value FROM platform_settings WHERE setting_key = 'vowr_per_zar');

-- Rescale every existing ledger row by 100x — only when the rescale has not
-- already run (i.e. the rate isn't already '100').
UPDATE reward_events
  SET points = points * 100
  WHERE (@current_rate IS NULL OR @current_rate <> '100');

UPDATE platform_settings
  SET setting_value = '100'
  WHERE setting_key = 'vowr_per_zar' AND (@current_rate IS NULL OR @current_rate <> '100');

INSERT INTO platform_settings (setting_key, setting_value)
  SELECT 'vowr_per_zar', '100'
  WHERE NOT EXISTS (SELECT 1 FROM platform_settings WHERE setting_key = 'vowr_per_zar');

-- New settings for the partial/hybrid redemption model. Existing keys
-- (vowr_discount_percent, bundle_discount_percent) are untouched — they
-- continue to govern the existing all-VOWR unlock path unchanged.
INSERT IGNORE INTO platform_settings (setting_key, setting_value) VALUES
  ('vowr_max_redemption_percent', '12'),
  ('vowr_reservation_ttl_minutes', '30');

-- =============================================================================
-- Patch 032 complete. Re-run is safe (guarded by the current rate value).
-- =============================================================================
