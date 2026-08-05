-- =============================================================================
-- VowLMS — Schema Patch 015
-- course_evaluations: learner course/instructor ratings and feedback.
-- Ids corrected to VARCHAR(36) UUIDs matching 001_schema.sql conventions.
-- MySQL's CHECK constraints are enforced from 8.0.16+ (Afrihost's shared MySQL
-- is 8.0+) — kept as specified since VowLMS's existing schema already assumes
-- MySQL 8.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `course_evaluations` (
  `id`                 VARCHAR(36)  NOT NULL,
  `user_id`            VARCHAR(36)  NOT NULL,
  `course_id`          VARCHAR(36)  NOT NULL,
  `rating`             TINYINT      NOT NULL,
  `instructor_rating`  TINYINT      NULL,
  `feedback_text`      TEXT         NULL,
  `would_recommend`    TINYINT(1)   NULL,
  `created_at`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_course_eval` (`user_id`, `course_id`),
  INDEX `idx_course` (`course_id`),
  CONSTRAINT `chk_rating_range` CHECK (`rating` BETWEEN 1 AND 5),
  CONSTRAINT `chk_instructor_rating_range` CHECK (`instructor_rating` IS NULL OR `instructor_rating` BETWEEN 1 AND 5),
  CONSTRAINT `fk_evaluation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_evaluation_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
