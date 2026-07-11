-- =============================================================================
-- VowLMS Ecosystem Upgrade SQL
-- Import in phpMyAdmin: goalvxiw_vowlms database
-- =============================================================================
-- LEGACY / DO NOT IMPORT FOR THE CURRENT 000-011 INSTALLATION.
--
-- This older optional bundle creates and seeds editable ecosystem-content and
-- lead tables. It is intentionally excluded from README_IMPORT_ORDER.md because
-- its seed wording predates the current evidence-safe VowLMS content and can
-- reintroduce unapproved claims. The current Next.js public pages do not require
-- this file. If these tables already exist, leave them in place; do not rerun
-- this seed bundle. Any future use requires a separately reviewed migration.
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── ecosystem_services ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `ecosystem_services` (
  `id`          VARCHAR(64)  NOT NULL,
  `name`        VARCHAR(128) NOT NULL,
  `slug`        VARCHAR(64)  NOT NULL UNIQUE,
  `tagline`     VARCHAR(255) NOT NULL DEFAULT '',
  `description` TEXT,
  `icon`        VARCHAR(16)  NOT NULL DEFAULT '🔷',
  `status`      ENUM('live','coming_soon','connected','built_in','in_development','support') NOT NULL DEFAULT 'coming_soon',
  `href`        VARCHAR(255) NOT NULL DEFAULT '/',
  `color`       VARCHAR(16)  NOT NULL DEFAULT '#1e3a8a',
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── homepage_sections ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `homepage_sections` (
  `id`          VARCHAR(64)  NOT NULL,
  `section_key` VARCHAR(64)  NOT NULL UNIQUE,
  `title`       VARCHAR(255) NOT NULL,
  `subtitle`    VARCHAR(255),
  `body`        TEXT,
  `cta_label`   VARCHAR(64),
  `cta_href`    VARCHAR(255),
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── investor_sections ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `investor_sections` (
  `id`          VARCHAR(64)  NOT NULL,
  `section_key` VARCHAR(64)  NOT NULL UNIQUE,
  `title`       VARCHAR(255) NOT NULL,
  `body`        TEXT,
  `metric_value`VARCHAR(32),
  `metric_label`VARCHAR(128),
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── academy_pages ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `academy_pages` (
  `id`            VARCHAR(64)  NOT NULL,
  `academy_slug`  VARCHAR(64)  NOT NULL UNIQUE,
  `hero_title`    VARCHAR(255) NOT NULL,
  `hero_subtitle` VARCHAR(255),
  `hero_body`     TEXT,
  `outcome_1`     VARCHAR(255),
  `outcome_2`     VARCHAR(255),
  `outcome_3`     VARCHAR(255),
  `target_learner`VARCHAR(255),
  `cta_label`     VARCHAR(64),
  `cta_href`      VARCHAR(255),
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── support_services ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `support_services` (
  `id`          VARCHAR(64)  NOT NULL,
  `name`        VARCHAR(128) NOT NULL,
  `slug`        VARCHAR(64)  NOT NULL UNIQUE,
  `description` TEXT,
  `icon`        VARCHAR(16)  NOT NULL DEFAULT '🤝',
  `category`    VARCHAR(64)  NOT NULL DEFAULT 'general',
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── sidebar_services ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sidebar_services` (
  `id`          VARCHAR(64)  NOT NULL,
  `name`        VARCHAR(128) NOT NULL,
  `tagline`     VARCHAR(255) NOT NULL DEFAULT '',
  `icon`        VARCHAR(16)  NOT NULL DEFAULT '🔷',
  `status`      ENUM('Built-in','Coming soon','Connected','Support','In development') NOT NULL DEFAULT 'Coming soon',
  `href`        VARCHAR(255) NOT NULL DEFAULT '/',
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── partner_leads ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `partner_leads` (
  `id`           VARCHAR(64)  NOT NULL,
  `name`         VARCHAR(255) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `organisation` VARCHAR(255),
  `partner_type` VARCHAR(64),
  `message`      TEXT,
  `status`       ENUM('new','contacted','qualified','rejected') NOT NULL DEFAULT 'new',
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── investor_leads ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `investor_leads` (
  `id`              VARCHAR(64)  NOT NULL,
  `name`            VARCHAR(255) NOT NULL,
  `email`           VARCHAR(255) NOT NULL,
  `organisation`    VARCHAR(255),
  `investment_range`VARCHAR(64),
  `investor_type`   VARCHAR(64),
  `message`         TEXT,
  `status`          ENUM('new','contacted','qualified','rejected') NOT NULL DEFAULT 'new',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── service_interest_logs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `service_interest_logs` (
  `id`           VARCHAR(64) NOT NULL,
  `service_slug` VARCHAR(64) NOT NULL,
  `email`        VARCHAR(255),
  `name`         VARCHAR(255),
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_service_slug` (`service_slug`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- ecosystem_services seed
INSERT INTO `ecosystem_services` (`id`,`name`,`slug`,`tagline`,`description`,`icon`,`status`,`href`,`color`,`sort_order`) VALUES
('svc-academies','Academies','academies','6 structured learning pathways','Upskilling, Skills Training, Chef Academy, Private School, Business School, and University Online — sharing one learner identity and reward system.','🎓','live','/academies','#1e3a8a',1),
('svc-hubs','Learning Hubs','learning-hubs','Hybrid community access points','Physical hubs across South Africa providing devices, internet, study rooms, printing, mentoring, and practical training environments.','🏫','connected','/learning-hubs','#06b6d4',2),
('svc-vowsupport','VowSupport','vowsupport','Tutoring, mentoring & coaching','End-to-end learner support covering academic tutoring, career mentoring, study coaching, and administrative registration assistance.','🤝','built_in','/vowsupport','#19c37d',3),
('svc-rewards','VowRewards','vowrewards','Rewards for every milestone','VowRewards points earned for lessons, assessments, VR sessions, and course completions — redeemable across the full GoalVow ecosystem.','⭐','built_in','/rewards','#f5c542',4),
('svc-vowtools','VowTools','vowtools','CV builder, diagnostics & prep','CV builder, skill gap diagnostics, interview preparation, and productivity tools to help learners turn credentials into opportunities.','🔧','coming_soon','/vowtools','#f97316',5),
('svc-plugconnect','PlugConnect','plugconnect','Jobs, internships & projects','Verified learner achievements matched to employer requirements, freelance projects, and entrepreneurship opportunities.','🔗','connected','/opportunities','#8b5cf6',6),
('svc-skillsshop','SkillsShop','skillsshop','Academy-aligned kits & bundles','Learning kits, trade tools, kitchen equipment, uniforms, and digital subscriptions aligned to academy pathways with VowRewards redemption.','🛍️','coming_soon','/skillsshop','#06b6d4',7),
('svc-cheforder','ChefOrder','cheforder','Chef business & food platform','Food ordering and chef business marketplace creating commercial revenue pathways for Chef Academy graduates.','🍳','coming_soon','/cheforder','#f97316',8),
('svc-innovation','Innovation Labs','innovation-labs','VR/AR simulations & AI support','WebXR skill simulations, AI learning personalisation, and R&D for next-generation GoalVow platform capabilities.','🔬','in_development','/innovation-labs','#06b6d4',9)
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- sidebar_services seed
INSERT INTO `sidebar_services` (`id`,`name`,`tagline`,`icon`,`status`,`href`,`sort_order`) VALUES
('sb-vowsupport','VowSupport','Tutoring, mentoring & coaching','🤝','Support','/vowsupport',1),
('sb-rewards','VowRewards','Earn points on every lesson','⭐','Built-in','/rewards',2),
('sb-vowtools','VowTools','CV builder, diagnostics & prep','🔧','Coming soon','/vowtools',3),
('sb-plugconnect','PlugConnect','Jobs, internships & projects','🔗','Connected','/opportunities',4),
('sb-skillsshop','SkillsShop','Kits, tools & learning bundles','🛍️','Coming soon','/skillsshop',5),
('sb-hubs','Learning Hubs','Hybrid in-person access points','🏫','Connected','/learning-hubs',6),
('sb-cheforder','ChefOrder','Chef business & food platform','🍳','Coming soon','/cheforder',7),
('sb-innovation','Innovation Labs','VR/AR & AI learning tools','🔬','In development','/innovation-labs',8)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- support_services seed
INSERT INTO `support_services` (`id`,`name`,`slug`,`description`,`icon`,`category`,`sort_order`) VALUES
('ss-tutoring','Academic Tutoring','academic-tutoring','One-on-one and small group tutoring sessions aligned to GoalVow academy curriculum.','📚','academic',1),
('ss-mentoring','Career Mentoring','career-mentoring','Industry-matched mentors guide learners on career direction and professional development.','🧭','career',2),
('ss-coaching','Study Coaching','study-coaching','Learning coaches help learners build study habits and stay on track through courses.','🧠','academic',3),
('ss-registration','Registration Support','registration-support','Help with academy enrolment, document submission, and payment queries.','📋','admin',4),
('ss-wellbeing','Wellbeing Check-ins','wellbeing','Regular facilitator check-ins to identify learners who need extra support.','💬','wellness',5),
('ss-goals','Goal Planning','goal-planning','Structured sessions to align study plans with career aspirations and life circumstances.','🎯','career',6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
