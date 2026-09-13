-- =============================================================================
-- VowLMS — Schema Patch 022
-- International course-unlock payments (Paystack, PayPal) — a separate table
-- from the existing PayFast-specific `payments` table (which has
-- payfast_payment_id/payfast_ref columns baked in), so this is purely
-- additive and cannot affect the existing PayFast reconciliation logic at
-- all. Mirrors the course-unlock model already in course_unlock_pricing.sql:
-- amount_zar is always the real, server-recomputed canonical price from
-- computeCourseUnlockPrice(); amount_charged/currency_charged is what the
-- gateway actually billed, purely a record of the converted amount shown
-- and charged at that moment — never a second source of truth for price.
--
-- Run after 021_course_unlock_pricing.sql. Re-running is safe
-- (CREATE TABLE IF NOT EXISTS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS `international_payments` (
  `id`                      VARCHAR(36)   NOT NULL,
  `user_id`                 VARCHAR(36)   NOT NULL,
  `course_id`               VARCHAR(36)   NOT NULL,
  `module_id`               VARCHAR(36)   NULL,
  `unlock_parent_slugs`     JSON          NULL,
  `gateway`                 ENUM('paystack','paypal') NOT NULL,
  `external_transaction_id` VARCHAR(191)  NULL,
  `amount_zar`              DECIMAL(10,2) NOT NULL,
  `amount_charged`          DECIMAL(10,2) NOT NULL,
  `currency_charged`        VARCHAR(3)    NOT NULL,
  `exchange_rate_used`      DECIMAL(18,8) NOT NULL,
  `status`                  ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `metadata`                JSON          NULL,
  `created_at`              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_intl_payment_external_txn` (`gateway`, `external_transaction_id`),
  INDEX `idx_intl_payment_user` (`user_id`),
  INDEX `idx_intl_payment_status` (`status`),
  CONSTRAINT `fk_intl_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_intl_payment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Patch 022 complete. Re-run is safe.
-- =============================================================================
