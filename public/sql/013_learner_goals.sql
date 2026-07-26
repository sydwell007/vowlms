-- 013 — Learner goals (goal-first onboarding: "Find My Path" + Path Finder Quiz)
-- One row per user — stores which goal tile / role / academy a learner was routed
-- to, plus their most recent Path Finder Quiz answers and recommendation.
-- Course catalogue matching itself runs in the Next.js app against the static
-- course data (see src/lib/goal-routing.ts) — this table only persists the
-- learner's own choice so it can follow them across devices when logged in.

CREATE TABLE IF NOT EXISTS `learner_goals` (
  `id`                   VARCHAR(36)  NOT NULL,
  `user_id`              VARCHAR(36)  NOT NULL,
  `goal_tile`            VARCHAR(50)  NOT NULL,
  `role_selected`        VARCHAR(100) NULL,
  `academy_routed`       VARCHAR(50)  NOT NULL,
  `quiz_q1`               VARCHAR(50) NULL,
  `quiz_q2`               VARCHAR(50) NULL,
  `quiz_q3`               VARCHAR(50) NULL,
  `quiz_q4`               VARCHAR(50) NULL,
  `quiz_recommendation`  VARCHAR(50)  NULL,
  `created_at`           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user` (`user_id`),
  INDEX `idx_academy_routed` (`academy_routed`),
  CONSTRAINT `fk_learner_goals_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
