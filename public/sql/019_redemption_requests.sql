-- =============================================================================
-- VowLMS — Schema Patch 019
-- Adds `redemption_requests`, tracking learner requests to spend VOWR balance
-- (reward_events points) on catalogue items that require real-world or admin
-- fulfilment (course credit, data bundle, electricity token, mentorship
-- session, assessment retake waiver, VR practice credit). Peer-to-peer
-- donations between learners do not use this table — they resolve instantly
-- as a pair of reward_events rows and need no fulfilment step.
-- Run after 018_vowhuman_presenters.sql. Re-running is safe (CREATE TABLE
-- IF NOT EXISTS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS `redemption_requests` (
  `id`              VARCHAR(36) NOT NULL,
  `user_id`         VARCHAR(36) NOT NULL,
  `redemption_type` VARCHAR(64) NOT NULL,
  `vowr_amount`     INT NOT NULL,
  `status`          ENUM('pending','fulfilled','failed','cancelled') NOT NULL DEFAULT 'pending',
  `metadata`        JSON NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fulfilled_at`    TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `idx_redemption_user` (`user_id`, `created_at`),
  CONSTRAINT `fk_redemption_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Patch 019 complete. Re-run is safe (CREATE TABLE IF NOT EXISTS is idempotent).
-- =============================================================================
