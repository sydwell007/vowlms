-- =============================================================================
-- VowLMS — First Admin User Setup
-- File: 005_admin_user_setup.sql
-- Run AFTER 001_schema.sql
-- =============================================================================
--
-- INSTRUCTIONS:
-- 1. Generate a bcrypt hash for your password at: https://bcrypt-generator.com
--    (Use 10 rounds, enter your chosen password)
-- 2. Replace $2y$10$REPLACE_THIS_WITH_YOUR_BCRYPT_HASH below
-- 3. Replace sydwell@goalvow.com with your admin email if different
-- 4. Run this SQL in phpMyAdmin
-- =============================================================================

SET NAMES utf8mb4;

INSERT IGNORE INTO `users` (
  `id`,
  `name`,
  `email`,
  `password_hash`,
  `role`,
  `phone`,
  `city`,
  `country`,
  `is_active`,
  `email_verified`
) VALUES (
  UUID(),
  'Sydwell',
  'sydwell@goalvow.com',
  '$2y$10$REPLACE_THIS_WITH_YOUR_BCRYPT_HASH',
  'admin',
  '+27632706787',
  'Cape Town',
  'ZA',
  1,
  1
);

-- Verify admin was created
SELECT id, name, email, role, created_at FROM users WHERE role = 'admin';

-- ── Optional: Create test learner account ─────────────────────────────────────
-- Password: TestLearner2026! (replace hash below)
INSERT IGNORE INTO `users` (
  `id`,
  `name`,
  `email`,
  `password_hash`,
  `role`,
  `city`,
  `country`,
  `is_active`,
  `email_verified`
) VALUES (
  UUID(),
  'Test Learner',
  'learner@goalvow.com',
  '$2y$10$REPLACE_THIS_WITH_LEARNER_BCRYPT_HASH',
  'learner',
  'Cape Town',
  'ZA',
  1,
  1
);

-- ── Reward bootstrap: 100 pts for registration ───────────────────────────────
INSERT IGNORE INTO `reward_events` (`id`, `user_id`, `event`, `points`)
SELECT UUID(), id, 'register', 100 FROM users WHERE email IN ('sydwell@goalvow.com','learner@goalvow.com');

SELECT COUNT(*) AS user_count FROM users;
