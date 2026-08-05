-- =============================================================================
-- VowLMS — Schema Patch 016
-- opportunity_matches: records when a learner's certificate is matched to a
-- PlugConnect opportunity. `plugconnect_opportunity_id` stays VARCHAR(100) as
-- specified — it's an external PlugConnect id, not a local UUID, since
-- PlugConnect has no integration surface to VowLMS today (see
-- SCHEMA_CHANGELOG.md "016"). `certificate_id` corrected to VARCHAR(36) to
-- match `certificates.id` (001_schema.sql) rather than INT.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `opportunity_matches` (
  `id`                          VARCHAR(36)  NOT NULL,
  `user_id`                     VARCHAR(36)  NOT NULL,
  `certificate_id`              VARCHAR(36)  NOT NULL,
  `plugconnect_opportunity_id`  VARCHAR(100) NOT NULL,
  `matched_at`                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status`                      ENUM('pending','viewed','applied','dismissed') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`user_id`),
  CONSTRAINT `fk_oppmatch_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oppmatch_certificate` FOREIGN KEY (`certificate_id`) REFERENCES `certificates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
