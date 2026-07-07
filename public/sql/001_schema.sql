-- =============================================================================
-- VowLMS — MySQL 8 Database Schema
-- File: 001_schema.sql
-- Upload: phpMyAdmin → goalvow_lms database → Import tab
-- Run this FIRST before any seed files
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`              VARCHAR(36)     NOT NULL,
  `name`            VARCHAR(255)    NOT NULL,
  `email`           VARCHAR(255)    NOT NULL,
  `password_hash`   VARCHAR(255)    NOT NULL,
  `role`            ENUM('learner','facilitator','employer','admin') NOT NULL DEFAULT 'learner',
  `phone`           VARCHAR(50)     NULL,
  `city`            VARCHAR(100)    NULL,
  `country`         VARCHAR(100)    NULL DEFAULT 'ZA',
  `bio`             TEXT            NULL,
  `preferred_academy` VARCHAR(100)  NULL,
  `email_verified`  TINYINT(1)      NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `language`        VARCHAR(20)     NOT NULL DEFAULT 'en',
  `timezone`        VARCHAR(60)     NOT NULL DEFAULT 'Africa/Johannesburg',
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Academies ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `academies` (
  `id`           VARCHAR(36)  NOT NULL,
  `slug`         VARCHAR(100) NOT NULL,
  `name`         VARCHAR(255) NOT NULL,
  `description`  TEXT         NULL,
  `audience`     TEXT         NULL,
  `category`     VARCHAR(100) NOT NULL,
  `hero_message` TEXT         NULL,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Courses ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `courses` (
  `id`           VARCHAR(36)   NOT NULL,
  `slug`         VARCHAR(300)  NOT NULL,
  `academy_id`   VARCHAR(36)   NOT NULL,
  `moodle_id`    INT           NULL,
  `title`        VARCHAR(500)  NOT NULL,
  `description`  TEXT          NULL,
  `level`        ENUM('Foundation','Beginner','Intermediate','Advanced','Expert') NOT NULL DEFAULT 'Foundation',
  `duration`     VARCHAR(100)  NULL,
  `price`        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_free`      TINYINT(1)    NOT NULL DEFAULT 1,
  `status`       ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  `created_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`),
  INDEX `idx_academy` (`academy_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_free` (`is_free`),
  FULLTEXT INDEX `ft_search` (`title`,`description`),
  CONSTRAINT `fk_course_academy` FOREIGN KEY (`academy_id`) REFERENCES `academies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Modules ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `modules` (
  `id`         VARCHAR(36)  NOT NULL,
  `slug`       VARCHAR(300) NOT NULL,
  `course_id`  VARCHAR(36)  NOT NULL,
  `title`      VARCHAR(500) NOT NULL,
  `position`   SMALLINT     NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`),
  INDEX `idx_course` (`course_id`),
  CONSTRAINT `fk_module_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Lessons ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `lessons` (
  `id`               VARCHAR(36)  NOT NULL,
  `slug`             VARCHAR(300) NOT NULL,
  `module_id`        VARCHAR(36)  NOT NULL,
  `title`            VARCHAR(500) NOT NULL,
  `type`             ENUM('text','video','assessment','vr_practice') NOT NULL DEFAULT 'text',
  `duration_minutes` SMALLINT     NOT NULL DEFAULT 5,
  `content`          MEDIUMTEXT   NULL,
  `video_url`        VARCHAR(500) NULL,
  `position`         SMALLINT     NOT NULL DEFAULT 0,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`),
  INDEX `idx_module` (`module_id`),
  CONSTRAINT `fk_lesson_module` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Enrollments ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id`           VARCHAR(36) NOT NULL,
  `user_id`      VARCHAR(36) NOT NULL,
  `course_id`    VARCHAR(36) NOT NULL,
  `status`       ENUM('active','completed','dropped') NOT NULL DEFAULT 'active',
  `progress`     TINYINT     NOT NULL DEFAULT 0,
  `enrolled_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP   NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enrollment` (`user_id`,`course_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_course` (`course_id`),
  CONSTRAINT `fk_enroll_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Lesson Progress ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `progress` (
  `id`           VARCHAR(36) NOT NULL,
  `user_id`      VARCHAR(36) NOT NULL,
  `lesson_id`    VARCHAR(36) NOT NULL,
  `completed`    TINYINT(1)  NOT NULL DEFAULT 0,
  `completed_at` TIMESTAMP   NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_progress` (`user_id`,`lesson_id`),
  INDEX `idx_user` (`user_id`),
  CONSTRAINT `fk_prog_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prog_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Assessments ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `assessments` (
  `id`         VARCHAR(36)  NOT NULL,
  `slug`       VARCHAR(300) NOT NULL,
  `course_id`  VARCHAR(36)  NOT NULL,
  `title`      VARCHAR(500) NOT NULL,
  `pass_mark`  TINYINT      NOT NULL DEFAULT 60,
  `questions`  JSON         NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`),
  INDEX `idx_course` (`course_id`),
  CONSTRAINT `fk_assess_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Assessment Attempts ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `assessment_attempts` (
  `id`             VARCHAR(36) NOT NULL,
  `user_id`        VARCHAR(36) NOT NULL,
  `assessment_id`  VARCHAR(36) NOT NULL,
  `score`          TINYINT     NOT NULL,
  `passed`         TINYINT(1)  NOT NULL DEFAULT 0,
  `answers`        JSON        NULL,
  `attempted_at`   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_assess` (`user_id`,`assessment_id`),
  CONSTRAINT `fk_attempt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attempt_assess` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── VR Practices ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `vr_practices` (
  `id`               VARCHAR(36)  NOT NULL,
  `slug`             VARCHAR(300) NOT NULL,
  `course_id`        VARCHAR(36)  NOT NULL,
  `title`            VARCHAR(500) NOT NULL,
  `scenario`         TEXT         NULL,
  `score_placeholder` INT          NOT NULL DEFAULT 0,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`),
  CONSTRAINT `fk_vr_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── VR Attempts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `vr_attempts` (
  `id`             VARCHAR(36) NOT NULL,
  `user_id`        VARCHAR(36) NOT NULL,
  `vr_practice_id` VARCHAR(36) NOT NULL,
  `score`          INT         NULL,
  `feedback`       TEXT        NULL,
  `attempted_at`   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`user_id`),
  CONSTRAINT `fk_vrattempt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vrattempt_vr` FOREIGN KEY (`vr_practice_id`) REFERENCES `vr_practices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Certificates ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `certificates` (
  `id`              VARCHAR(36)  NOT NULL,
  `user_id`         VARCHAR(36)  NOT NULL,
  `course_id`       VARCHAR(36)  NOT NULL,
  `certificate_id`  VARCHAR(100) NOT NULL,
  `learner_name`    VARCHAR(255) NOT NULL,
  `course_name`     VARCHAR(500) NOT NULL,
  `issued_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cert_id` (`certificate_id`),
  UNIQUE KEY `uq_user_course` (`user_id`,`course_id`),
  INDEX `idx_user` (`user_id`),
  CONSTRAINT `fk_cert_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cert_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Reward Events ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `reward_events` (
  `id`         VARCHAR(36)  NOT NULL,
  `user_id`    VARCHAR(36)  NOT NULL,
  `event`      VARCHAR(100) NOT NULL,
  `points`     INT          NOT NULL DEFAULT 0,
  `metadata`   JSON         NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`user_id`),
  CONSTRAINT `fk_reward_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Payments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `payments` (
  `id`                 VARCHAR(36)   NOT NULL,
  `user_id`            VARCHAR(36)   NOT NULL,
  `course_id`          VARCHAR(36)   NOT NULL,
  `amount`             DECIMAL(10,2) NOT NULL,
  `status`             ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `payfast_payment_id` VARCHAR(100)  NULL,
  `payfast_ref`        VARCHAR(100)  NULL,
  `itn_data`           JSON          NULL,
  `created_at`         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_pay_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pay_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Opportunities ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `opportunities` (
  `id`          VARCHAR(36)  NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `type`        ENUM('employment','entrepreneurship','training','funding','mentorship') NOT NULL,
  `company`     VARCHAR(255) NULL,
  `location`    VARCHAR(255) NULL,
  `description` TEXT         NULL,
  `course_slug` VARCHAR(300) NULL,
  `apply_url`   VARCHAR(500) NULL,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Learning Hubs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `learning_hubs` (
  `id`            VARCHAR(36)  NOT NULL,
  `name`          VARCHAR(255) NOT NULL,
  `location`      VARCHAR(255) NOT NULL,
  `status`        ENUM('active','partner-ready','planned') NOT NULL DEFAULT 'planned',
  `capacity`      INT          NOT NULL DEFAULT 30,
  `description`   TEXT         NULL,
  `contact_email` VARCHAR(255) NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Password Resets ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id`         VARCHAR(36)  NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `token`      VARCHAR(64)  NOT NULL,
  `expires_at` TIMESTAMP    NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token` (`token`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Announcements ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `announcements` (
  `id`          VARCHAR(36)  NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `body`        TEXT         NOT NULL,
  `category`    ENUM('general','course','system','event') NOT NULL DEFAULT 'general',
  `target_role` ENUM('all','learner','facilitator','employer','admin') NOT NULL DEFAULT 'all',
  `is_pinned`   TINYINT(1)   NOT NULL DEFAULT 0,
  `published_at` TIMESTAMP   NULL,
  `created_by`  VARCHAR(36)  NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_role` (`target_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Calendar Events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id`          VARCHAR(36)  NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT         NULL,
  `type`        ENUM('live','deadline','vr','workshop','webinar') NOT NULL DEFAULT 'live',
  `start_at`    TIMESTAMP    NOT NULL,
  `end_at`      TIMESTAMP    NULL,
  `course_id`   VARCHAR(36)  NULL,
  `hub_id`      VARCHAR(36)  NULL,
  `join_url`    VARCHAR(500) NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_start` (`start_at`),
  INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Schema created: 18 tables
-- Next: Run 002_seed_academies.sql, 003_seed_opportunities.sql, etc.
-- =============================================================================
