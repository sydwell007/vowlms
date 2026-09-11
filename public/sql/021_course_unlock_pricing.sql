-- =============================================================================
-- VowLMS — Schema Patch 021
-- Paid course access for the 20 Upskilling Academy courses: Module 1 stays
-- free for everyone (existing `is_free`/`price` on the real per-module
-- `courses` rows is untouched), every module after that is unlocked as one
-- purchase — cash (existing PayFast flow) or VOWR (existing reward_events
-- ledger), at the platform's real, server-computed price. Nothing here
-- invents a separate "Treasury"/token-supply system — VOWR stays the same
-- simple earn/spend ledger it already is; this patch only adds what's
-- needed to *charge* for it.
--
-- ⚠ PLACEHOLDER PRICING: price_zar/founding_price_zar below (R299 / R209)
-- are a recommended starting point, not a confirmed final price — see the
-- build summary for the reasoning. Update via `UPDATE course_unlock_pricing
-- SET price_zar = ... WHERE parent_slug = ...` once real prices are set;
-- no code change needed, the app always reads this table live.
--
-- Run after 020_course_orientation_progress.sql. Re-running is safe
-- (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS / INSERT IGNORE).
-- =============================================================================

-- ── Platform-wide settings (key/value) — exchange rate + VOWR discount live
--    here so they can be tuned without a code deploy. ──────────────────────────
CREATE TABLE IF NOT EXISTS `platform_settings` (
  `setting_key`   VARCHAR(100) NOT NULL,
  `setting_value` VARCHAR(255) NOT NULL,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1 VOWR = R1 to start (simplest possible mental model for a first launch —
-- an intentionally round, conservative placeholder, not a market-derived
-- rate; VOWR isn't trading anywhere yet). vowr_discount_percent is the
-- "pay with VOWR instead of cash" discount from the brief (10-15% — 12%
-- picked as the brief's own suggested middle value).
INSERT IGNORE INTO `platform_settings` (`setting_key`, `setting_value`) VALUES
  ('vowr_per_zar', '1.0'),
  ('vowr_discount_percent', '12'),
  ('bundle_discount_percent', '20');

-- ── Per-course "unlock the rest" pricing ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `course_unlock_pricing` (
  `parent_slug`        VARCHAR(300)  NOT NULL,
  `price_zar`           DECIMAL(10,2) NOT NULL,
  `founding_price_zar`  DECIMAL(10,2) NOT NULL,
  `founding_cutoff`     SMALLINT      NOT NULL DEFAULT 100,
  `created_at`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parent_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `course_unlock_pricing` (`parent_slug`, `price_zar`, `founding_price_zar`, `founding_cutoff`) VALUES
  ('business-ethics', 299.00, 209.00, 100),
  ('workplace-compliance', 299.00, 209.00, 100),
  ('organizational-culture', 299.00, 209.00, 100),
  ('stress-management', 299.00, 209.00, 100),
  ('cybersecurity', 299.00, 209.00, 100),
  ('health-and-wellness', 299.00, 209.00, 100),
  ('human-resources', 299.00, 209.00, 100),
  ('marketing', 299.00, 209.00, 100),
  ('sales', 299.00, 209.00, 100),
  ('project-management', 299.00, 209.00, 100),
  ('customer-service', 299.00, 209.00, 100),
  ('career-management', 299.00, 209.00, 100),
  ('change-management', 299.00, 209.00, 100),
  ('communication', 299.00, 209.00, 100),
  ('leadership', 299.00, 209.00, 100),
  ('resilience', 299.00, 209.00, 100),
  ('problem-solving', 299.00, 209.00, 100),
  ('time-management', 299.00, 209.00, 100),
  ('team-management', 299.00, 209.00, 100),
  ('critical-thinking', 299.00, 209.00, 100);

-- ── Founding-learner redemption counter, per course — checked and
--    incremented atomically inside the same transaction as the actual
--    unlock, so the cutoff can never be over-sold under concurrent buyers. ──
CREATE TABLE IF NOT EXISTS `course_unlock_founding_counter` (
  `parent_slug`     VARCHAR(300) NOT NULL,
  `redeemed_count`  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`parent_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `course_unlock_founding_counter` (`parent_slug`, `redeemed_count`)
SELECT `parent_slug`, 0 FROM `course_unlock_pricing`;

-- ── Which real `courses` rows a parent-course "unlock" actually grants —
--    every module except Module 1 (which is free on its own). Generated
--    from src/data/course-groupings.ts's real moduleSlugOrder, not guessed. ──
CREATE TABLE IF NOT EXISTS `course_unlock_children` (
  `parent_slug`      VARCHAR(300) NOT NULL,
  `child_course_id`  VARCHAR(36)  NOT NULL,
  PRIMARY KEY (`parent_slug`, `child_course_id`),
  CONSTRAINT `fk_unlock_child_course` FOREIGN KEY (`child_course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'business-ethics', id FROM courses WHERE slug = 'module-3-employee-ethics';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'business-ethics', id FROM courses WHERE slug = 'module-2-leadership-on-ethics';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'workplace-compliance', id FROM courses WHERE slug = 'module-2-workplace-violence';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'organizational-culture', id FROM courses WHERE slug = 'module-2-inclusive-communication';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'organizational-culture', id FROM courses WHERE slug = 'module-3-culture-competence';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'stress-management', id FROM courses WHERE slug = 'module-2-stress-and-work-performance';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'stress-management', id FROM courses WHERE slug = 'module-3-strategies-to-relieve-stress';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'cybersecurity', id FROM courses WHERE slug = 'module-2-how-to-protect-your-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'cybersecurity', id FROM courses WHERE slug = 'module-3-social-engineering';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'health-and-wellness', id FROM courses WHERE slug = 'module-2-forming-healthy-habits';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'health-and-wellness', id FROM courses WHERE slug = 'module-3-positive-psychology-in-the-workplace';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'health-and-wellness', id FROM courses WHERE slug = 'module-4-exercise';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'health-and-wellness', id FROM courses WHERE slug = 'module-5-mental-health-awareness';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'health-and-wellness', id FROM courses WHERE slug = 'module-6-dealing-with-emotions';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-2-diversity-inclusion-and-belonging';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-3-interviewing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-4-unconscious-bias';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-5-talent-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-6-workplace-well-being';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-7-anti-harassment-and-discrimination';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'human-resources', id FROM courses WHERE slug = 'module-8-retirement-planning';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-2-brand-identity-and-strategy';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-3-product-marketing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-4-content-marketing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-5-customer-and-marketing-research';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-6-website-marketing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-7-search-engine-optimization';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-8-social-media-marketing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-9-email-marketing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-10-paid-advertising';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'marketing', id FROM courses WHERE slug = 'module-11-marketing-analytics';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-2-sales-leadership-and-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-3-sales-psychology';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-4-presenting-your-solution';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-5-building-relationships';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-6-closing-the-deal';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-7-handling-objections';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'sales', id FROM courses WHERE slug = 'module-8-prospecting';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-2-project-frameworks';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-3-project-communication';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-4-project-scheduling';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-5-project-scope-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-6-project-reporting';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-7-project-improvement';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'project-management', id FROM courses WHERE slug = 'module-8-project-change-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'customer-service', id FROM courses WHERE slug = 'module-2-customer-service-skills';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'customer-service', id FROM courses WHERE slug = 'module-3-customer-communication-basics';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'customer-service', id FROM courses WHERE slug = 'module-4-customer-communication-channels';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'customer-service', id FROM courses WHERE slug = 'module-5-team-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'customer-service', id FROM courses WHERE slug = 'module-6-culture-sensitivity';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'customer-service', id FROM courses WHERE slug = 'module-7-difficult-situations';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-2-assessing-your-strengths-and-skills';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-3-finding-a-new-job';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-4-new-professional';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-5-networking';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-6-mentoring-in-the-workplace';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-7-professional-etiquette';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-8-working-relationships';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'career-management', id FROM courses WHERE slug = 'module-9-overcoming-challenges';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'change-management', id FROM courses WHERE slug = 'module-2-change-management-models';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'change-management', id FROM courses WHERE slug = 'module-3-the-change-management-process';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'change-management', id FROM courses WHERE slug = 'module-4-communicating-change';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'change-management', id FROM courses WHERE slug = 'module-5-leading-through-change';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'change-management', id FROM courses WHERE slug = 'module-6-managing-change-in-time-of-crisis';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-2-empathy';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-3-verbal-communication';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-4-meetings';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-5-presentations';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-6-negotiation-and-persuasion';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-7-writing-well';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'communication', id FROM courses WHERE slug = 'module-8-communicating-in-difficult-situations';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'leadership', id FROM courses WHERE slug = 'module-2-leadership-styles';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'leadership', id FROM courses WHERE slug = 'module-3-emotional-intelligence';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'leadership', id FROM courses WHERE slug = 'module-4-crisis-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'resilience', id FROM courses WHERE slug = 'module-2-building-career-resilience';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'resilience', id FROM courses WHERE slug = 'module-3-leadership-and-resilience';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'resilience', id FROM courses WHERE slug = 'module-4-emotional-and-physical-resilience';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'resilience', id FROM courses WHERE slug = 'module-5-thriving-through-challenges';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'problem-solving', id FROM courses WHERE slug = 'module-2-problem-solving-in-the-workplace';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'problem-solving', id FROM courses WHERE slug = 'module-3-steps-to-problem-solving';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'problem-solving', id FROM courses WHERE slug = 'module-4-advanced-problem-solving';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'time-management', id FROM courses WHERE slug = 'module-2-goal-setting';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'time-management', id FROM courses WHERE slug = 'module-3-scheduling';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'time-management', id FROM courses WHERE slug = 'module-4-prioritization';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'time-management', id FROM courses WHERE slug = 'module-5-concentration';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'time-management', id FROM courses WHERE slug = 'module-6-overcoming-time-challenges';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-2-new-manager';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-3-developing-your-team';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-4-team-culture';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-5-delegating-tasks';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-6-motivating-your-team';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-7-managing-remote-teams';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-8-team-dynamics';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-9-performance-management';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-10-resolving-conflict';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'team-management', id FROM courses WHERE slug = 'module-11-letting-an-employee-go';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'critical-thinking', id FROM courses WHERE slug = 'module-2-thinking-in-the-workplace';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'critical-thinking', id FROM courses WHERE slug = 'module-3-critical-thinking-and-information-literacy';

-- ── payments gets one new nullable column: which parent-course slug(s) a
--    payment unlocks (JSON array — a bundle purchase spans more than one).
--    NULL for every existing/ordinary single-course payment, so this is a
--    pure addition with zero effect on the current PayFast flow. ────────────
ALTER TABLE `payments`
  ADD COLUMN IF NOT EXISTS `unlock_parent_slugs` JSON NULL AFTER `course_id`;

-- =============================================================================
-- Patch 021 complete. Re-run is safe.
-- =============================================================================
