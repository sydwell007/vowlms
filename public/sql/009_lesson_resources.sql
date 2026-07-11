-- =============================================================
-- VowLMS — Lesson Resources Table
-- Run AFTER 001–008 scripts
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

-- ── lesson_resources ─────────────────────────────────────────────────────────
-- Stores per-lesson downloadable/viewable files (PDFs, videos, audio, etc.)
-- Files are served by PHP from the `courses` symlink using their SHA-1 hash,
-- OR proxied from Moodle's pluginfile.php as a fallback.

CREATE TABLE IF NOT EXISTS `lesson_resources` (
  `id`           VARCHAR(36)   NOT NULL,
  `lesson_id`    VARCHAR(36)   NOT NULL,
  `academy`      VARCHAR(50)   NOT NULL DEFAULT '',
  `type`         ENUM('pdf','video','audio','image','other') NOT NULL DEFAULT 'other',
  `filename`     VARCHAR(500)  NOT NULL,
  `content_hash` CHAR(40)      NULL COMMENT 'SHA-1 hash — used to serve from courses/ symlink',
  `file_url`     VARCHAR(1000) NULL COMMENT 'Moodle pluginfile URL; token is injected server-side',
  `filesize`     INT UNSIGNED  NOT NULL DEFAULT 0,
  `mime_type`    VARCHAR(100)  NULL,
  `position`     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_lr_lesson`  (`lesson_id`),
  KEY `idx_lr_hash`    (`content_hash`),
  CONSTRAINT `fk_lr_lesson` FOREIGN KEY (`lesson_id`)
    REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Add video_hash to lessons ────────────────────────────────────────────────
-- Stores SHA-1 of an uploaded video file so serve.php can stream it directly.
ALTER TABLE `lessons`
  ADD COLUMN IF NOT EXISTS `video_hash` CHAR(40) NULL AFTER `video_url`;

SET FOREIGN_KEY_CHECKS=1;

-- Verify
-- SELECT COUNT(*) FROM lesson_resources;
-- SELECT slug, video_url, video_hash FROM lessons WHERE video_hash IS NOT NULL LIMIT 5;
