-- =============================================================================
-- VowLMS — Schema Patch 034
-- Retires the "founding learner" launch discount (R299 → R209) per explicit
-- user decision 2026-09-14 — every course now always prices at its real
-- `price_zar` (R299). Implemented by zeroing `founding_cutoff` rather than
-- deleting `founding_price_zar`/the counter table: computeCourseUnlockPrice()
-- treats `redeemed < founding_cutoff` as the "is the discount still active"
-- check, and `redeemed` (an unsigned counter) can never be less than 0, so
-- founding_cutoff = 0 makes foundingActive permanently false everywhere
-- without losing the historical redeemed counts or the mechanism itself,
-- should a future promotion want to reuse it.
--
-- No frontend code change is required for the price/strikethrough/"Founding
-- Learner pricing" badge to disappear — they already render conditionally
-- on foundingActive, computed live from this table.
--
-- Idempotent: setting founding_cutoff to 0 twice is a no-op.
-- =============================================================================

UPDATE `course_unlock_pricing` SET `founding_cutoff` = 0;

-- =============================================================================
-- Patch 034 complete. Re-run is safe.
-- =============================================================================
