-- =============================================================================
-- VowLMS — Schema Patch 030
-- Real storage for the "Rate this Module" survey, replacing what was a
-- broken placeholder lesson ("Content is being loaded...") with an actual
-- functional module-feedback form. Keyed by the real `lessons` row for that
-- module's "Rate this Module" entry — every module already has exactly one
-- of these (a genuine, imported Moodle lesson, unlike the fake per-module
-- certificate lessons removed in 027), so no new module-identity concept is
-- needed.
--
-- One response per user per module (re-submitting updates it, it doesn't
-- pile up duplicates) — a learner's opinion of a module is a single current
-- answer, not a growing log.
--
-- Safe to re-run: CREATE TABLE IF NOT EXISTS.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `module_survey_responses` (
  `id`         VARCHAR(36)  NOT NULL,
  `user_id`    VARCHAR(36)  NOT NULL,
  `lesson_id`  VARCHAR(36)  NOT NULL,
  `rating`     TINYINT      NOT NULL COMMENT '1-5 stars',
  `liked`      TEXT         NULL COMMENT 'What the learner said worked well — optional',
  `improve`    TEXT         NULL COMMENT 'What the learner said could be improved — optional',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_survey_user_lesson` (`user_id`, `lesson_id`),
  INDEX `idx_survey_lesson` (`lesson_id`),
  CONSTRAINT `fk_survey_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_survey_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Patch 030 complete. Re-run is safe.
-- =============================================================================
