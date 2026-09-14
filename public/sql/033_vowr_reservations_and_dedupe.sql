-- =============================================================================
-- VowLMS — Schema Patch 033
-- Adds the two pieces of schema the new hybrid partial-VOWR-redemption
-- checkout needs, without touching or recreating any existing table:
--
-- 1. `course_unlock_vowr_reservations` — a hold on a learner's VOWR balance
--    while a matching cash payment (Paystack/PayPal/PayFast/Lemon Squeezy)
--    is in flight for the REMAINING portion of a course price. The VOWR
--    portion is debited from `reward_events` immediately at reservation time
--    (same "debit now, reconcile via status" convention 019_redemption_
--    requests.sql already established for pending redemption requests) —
--    this row is what lets that debit later resolve to either `committed`
--    (cash payment verified — keep the debit, grant access) or `released`
--    (cash payment failed/abandoned/expired — refund the debit).
--
-- 2. A nullable, uniquely-indexed `dedupe_key` on the existing `reward_events`
--    table, so a milestone-based award (e.g. "first lesson completed") can be
--    granted at-most-once per learner even if the triggering client call is
--    retried or duplicated. NULL is used for ordinary admin/facilitator
--    awards via the existing award.php (unlimited — MySQL treats multiple
--    NULLs in a unique index as distinct from one another).
--
-- Safe to re-run: CREATE TABLE IF NOT EXISTS, and both the column and the
-- unique key are added only if not already present (checked via
-- information_schema, same guarded pattern 011_integrity_hardening.sql uses
-- for uq_payfast_payment_id).
-- =============================================================================

CREATE TABLE IF NOT EXISTS `course_unlock_vowr_reservations` (
  `id`                       VARCHAR(36)   NOT NULL,
  `user_id`                  VARCHAR(36)   NOT NULL,
  `parent_slugs`             JSON          NOT NULL,
  `vowr_amount`               INT          NOT NULL,
  `vowr_value_zar`           DECIMAL(10,2) NOT NULL,
  `cash_amount_zar`          DECIMAL(10,2) NOT NULL,
  `currency_charged`         VARCHAR(8)    NOT NULL DEFAULT 'ZAR',
  `gateway`                  VARCHAR(32)   NOT NULL,
  `external_reference`       VARCHAR(191)  NULL,
  `status`                   ENUM('reserved','committed','released','expired') NOT NULL DEFAULT 'reserved',
  `reward_event_id`          VARCHAR(36)   NULL,
  `release_reward_event_id`  VARCHAR(36)   NULL,
  `created_at`               TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at`                TIMESTAMP    NOT NULL,
  `committed_at`              TIMESTAMP    NULL,
  `released_at`                TIMESTAMP   NULL,
  PRIMARY KEY (`id`),
  KEY `idx_vowr_reservation_user_status` (`user_id`, `status`),
  KEY `idx_vowr_reservation_gateway_ref` (`gateway`, `external_reference`),
  KEY `idx_vowr_reservation_expiry_sweep` (`status`, `expires_at`),
  CONSTRAINT `fk_vowr_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `reward_events`
  ADD COLUMN IF NOT EXISTS `dedupe_key` VARCHAR(191) NULL AFTER `metadata`;

-- Lets payfast-notify.php / paystack-verify-transaction.php / the PayPal and
-- Lemon Squeezy equivalents look up the matching reservation to commit or
-- release when a cash payment for the REMAINING (post-VOWR) amount resolves.
ALTER TABLE `payments`
  ADD COLUMN IF NOT EXISTS `vowr_reservation_id` VARCHAR(36) NULL AFTER `unlock_parent_slugs`;

ALTER TABLE `international_payments`
  ADD COLUMN IF NOT EXISTS `vowr_reservation_id` VARCHAR(36) NULL AFTER `unlock_parent_slugs`;

SET @dedupe_index_exists = (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'reward_events'
    AND index_name = 'uk_reward_dedupe'
);
SET @dedupe_index_sql = IF(
  @dedupe_index_exists = 0,
  'ALTER TABLE `reward_events` ADD UNIQUE KEY `uk_reward_dedupe` (`user_id`, `dedupe_key`)',
  'SELECT 1'
);
PREPARE dedupe_index_statement FROM @dedupe_index_sql;
EXECUTE dedupe_index_statement;
DEALLOCATE PREPARE dedupe_index_statement;

-- =============================================================================
-- Patch 033 complete. Re-run is safe.
-- =============================================================================
