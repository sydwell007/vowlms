-- =============================================================================
-- VowLMS — Schema Patch 012
-- Adds optional per-module marketing/preview copy used by the redesigned
-- course landing page ("Course Preview" curriculum accordion).
-- Both columns are nullable: when empty, the frontend auto-generates a
-- readable summary from the module's lessons instead. Populate these columns
-- per module at any time to override the generated copy with real content.
-- Run AFTER 007_schema_patch.sql (import in phpMyAdmin as a separate file)
-- =============================================================================

ALTER TABLE `modules`
  ADD COLUMN IF NOT EXISTS `description` TEXT NULL AFTER `title`,
  ADD COLUMN IF NOT EXISTS `outcome`     TEXT NULL AFTER `description`;

-- =============================================================================
-- Patch 012 complete. Re-run is safe (ADD COLUMN IF NOT EXISTS is idempotent).
-- No PHP change is required: public/php/api/courses/index.php already selects
-- `SELECT * FROM modules`, so these columns are returned automatically once
-- they exist and are populated.
-- =============================================================================
