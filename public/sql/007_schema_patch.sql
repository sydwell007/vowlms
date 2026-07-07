-- =============================================================================
-- VowLMS — Schema Patch 007
-- Adds columns that were missing from 001_schema.sql but are referenced
-- by PHP API files. Safe to run on an existing database.
-- Run AFTER 001_schema.sql (import in phpMyAdmin as a separate file)
-- =============================================================================

-- ── Users: add profile + notification columns ─────────────────────────────────
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `avatar_url`           VARCHAR(500)  NULL AFTER `bio`,
  ADD COLUMN IF NOT EXISTS `province`             VARCHAR(100)  NULL AFTER `city`,
  ADD COLUMN IF NOT EXISTS `company`              VARCHAR(255)  NULL AFTER `province`,
  ADD COLUMN IF NOT EXISTS `email_notifications`  TINYINT(1)    NOT NULL DEFAULT 1 AFTER `language`,
  ADD COLUMN IF NOT EXISTS `sms_notifications`    TINYINT(1)    NOT NULL DEFAULT 0 AFTER `email_notifications`;

-- ── Courses: add optional facilitator link ────────────────────────────────────
ALTER TABLE `courses`
  ADD COLUMN IF NOT EXISTS `facilitator_id` VARCHAR(36) NULL AFTER `academy_id`;

-- ── Opportunities: add posted_by for employer dashboard ───────────────────────
ALTER TABLE `opportunities`
  ADD COLUMN IF NOT EXISTS `posted_by` VARCHAR(36) NULL AFTER `is_active`;

-- =============================================================================
-- Patch 007 complete. Re-run is safe (ADD COLUMN IF NOT EXISTS is idempotent).
-- =============================================================================
