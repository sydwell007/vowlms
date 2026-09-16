-- =============================================================================
-- VowLMS — Schema Patch 036
-- Temporarily routes every country currently mapped to Lemon Squeezy (EU/UK)
-- to PayPal instead — the Lemon Squeezy store is stuck in Test Mode until
-- its business/banking "Activate your store" step is completed in their own
-- dashboard (their requirement, not a bug), so every real Lemon Squeezy
-- checkout 404s right now. Per explicit user decision 2026-09-16.
--
-- Currency stays USD for all these rows (already seeded that way in
-- 023_gateway_config.sql), matching PayPal's own configured currency, so no
-- other column needs to change.
--
-- Reversible: once Lemon Squeezy's store is activated, re-run with
-- 'lemonsqueezy' in place of 'paypal' (or restore from
-- 023_gateway_config.sql's original seed) to switch these countries back.
-- Idempotent: re-running is a no-op once already applied (no rows will
-- still be 'lemonsqueezy').
-- =============================================================================

UPDATE `gateway_config`
  SET `gateway` = 'paypal'
  WHERE `gateway` = 'lemonsqueezy';

-- =============================================================================
-- Patch 036 complete. Re-run is safe.
-- =============================================================================
