-- =============================================================================
-- VowLMS - Schema Patch 020
-- Persists completion of the four VowLMS-authored Module 0 orientation lessons
-- for virtual parent courses. This is additive and safe to re-run.
-- Run after 019_redemption_requests.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `course_orientation_progress` (
  `id`           VARCHAR(36) NOT NULL,
  `user_id`      VARCHAR(36) NOT NULL,
  `course_slug`  VARCHAR(120) NOT NULL,
  `lesson_slug`  VARCHAR(180) NOT NULL,
  `completed`    TINYINT(1) NOT NULL DEFAULT 0,
  `completed_at` DATETIME NULL,
  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orientation_user_lesson` (`user_id`, `lesson_slug`),
  KEY `idx_orientation_course` (`user_id`, `course_slug`, `completed`),
  CONSTRAINT `fk_orientation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Patch 020 complete.
-- =============================================================================
