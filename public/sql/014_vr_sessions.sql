-- =============================================================================
-- VowLMS — Schema Patch 014
-- vr_sessions: diagnostic/integration-test tracking for VR-platform completion
-- callbacks (public/php/api/qa/test-vr-callback.php). Distinct from the existing
-- `vr_attempts` table (which records a learner's score against a VowLMS-owned
-- `vr_practices` row) — this table tracks the raw external callback itself,
-- including whether it successfully synced onward to `progress` and
-- `reward_events`, independent of whether a matching `vr_practices` row exists.
-- Ids corrected to VARCHAR(36) UUIDs to match every other table in this schema
-- (001_schema.sql) — the original spec used INT AUTO_INCREMENT, which doesn't
-- match `users.id` / `courses.id` / `modules.id`.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `vr_sessions` (
  `id`                     VARCHAR(36)  NOT NULL,
  `user_id`                VARCHAR(36)  NOT NULL,
  `course_id`              VARCHAR(36)  NOT NULL,
  `module_id`              VARCHAR(36)  NULL,
  `vr_scenario_id`         VARCHAR(100) NOT NULL,
  `started_at`             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at`           TIMESTAMP    NULL,
  `score`                  DECIMAL(5,2) NULL,
  `status`                 ENUM('started','completed','abandoned') NOT NULL DEFAULT 'started',
  `synced_to_lms_progress` TINYINT(1)   NOT NULL DEFAULT 0,
  `synced_to_rewards`      TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_user_course` (`user_id`, `course_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_vrsession_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vrsession_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vrsession_module` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
