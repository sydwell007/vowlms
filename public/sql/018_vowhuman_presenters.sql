-- =============================================================================
-- VowLMS - Schema Patch 018
-- Adds structured, optional VowHumans presenter settings to existing lessons.
-- This is additive and does not recreate or remove lesson data.
-- Run after 017_integration_health_log.sql.
-- Re-running is safe because every column uses IF NOT EXISTS and the initial
-- presenter is seeded only when that lesson has no presenter URL.
-- =============================================================================

ALTER TABLE `lessons`
  ADD COLUMN IF NOT EXISTS `vowhuman_enabled` TINYINT(1) NOT NULL DEFAULT 0 AFTER `video_url`,
  ADD COLUMN IF NOT EXISTS `vowhuman_embed_url` VARCHAR(500) NULL AFTER `vowhuman_enabled`,
  ADD COLUMN IF NOT EXISTS `vowhuman_presenter_name` VARCHAR(150) NULL AFTER `vowhuman_embed_url`,
  ADD COLUMN IF NOT EXISTS `vowhuman_intro` TEXT NULL AFTER `vowhuman_presenter_name`,
  ADD COLUMN IF NOT EXISTS `vowhuman_placement` VARCHAR(32) NOT NULL DEFAULT 'before-content' AFTER `vowhuman_intro`,
  ADD COLUMN IF NOT EXISTS `vowhuman_role` VARCHAR(32) NOT NULL DEFAULT 'presenter' AFTER `vowhuman_placement`,
  ADD COLUMN IF NOT EXISTS `vowhuman_expertise` VARCHAR(180) NULL AFTER `vowhuman_role`,
  ADD COLUMN IF NOT EXISTS `vowhuman_camera_enabled` TINYINT(1) NOT NULL DEFAULT 1 AFTER `vowhuman_expertise`,
  ADD COLUMN IF NOT EXISTS `vowhuman_microphone_enabled` TINYINT(1) NOT NULL DEFAULT 1 AFTER `vowhuman_camera_enabled`;

-- Initial approved presenter. Existing administrator configuration is preserved.
UPDATE `lessons`
SET
  `vowhuman_enabled` = 1,
  `vowhuman_embed_url` = 'https://vowhumans.com/embed/c81cca0d-866f-466c-a60d-c343dcdab9c4/goalvow-academies',
  `vowhuman_presenter_name` = 'GoalVow Academies Presenter',
  `vowhuman_intro` = 'Meet your AI course presenter before working through the Business Ethics reading material.',
  `vowhuman_placement` = 'before-content',
  `vowhuman_role` = 'presenter',
  `vowhuman_expertise` = 'Business Ethics learning guide',
  `vowhuman_camera_enabled` = 1,
  `vowhuman_microphone_enabled` = 1
WHERE `slug` = 'module-1-business-ethics-fundamentals-module-reading-material'
  AND (`vowhuman_embed_url` IS NULL OR `vowhuman_embed_url` = '');

SELECT
  `slug`,
  `vowhuman_enabled`,
  `vowhuman_embed_url`,
  `vowhuman_presenter_name`,
  `vowhuman_placement`,
  `vowhuman_role`
FROM `lessons`
WHERE `slug` = 'module-1-business-ethics-fundamentals-module-reading-material';

