-- VowLMS migration 011: payment and progress integrity hardening
--
-- Back up enrollments, progress, and payments before running this migration.
-- This migration is additive except for expanding the payments status enum.

ALTER TABLE `enrollments`
  ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP NOT NULL
  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `completed_at`;

ALTER TABLE `progress`
  ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP NOT NULL
  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `completed_at`;

ALTER TABLE `payments`
  MODIFY COLUMN `status`
  ENUM('pending','paid','failed','cancelled','refunded') NOT NULL DEFAULT 'pending';

-- Verify this query returns no rows before creating the provider-reference key:
-- SELECT payfast_payment_id, COUNT(*)
-- FROM payments
-- WHERE payfast_payment_id IS NOT NULL
-- GROUP BY payfast_payment_id HAVING COUNT(*) > 1;

SET @payfast_index_exists = (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'payments'
    AND index_name = 'uq_payfast_payment_id'
);
SET @payfast_index_sql = IF(
  @payfast_index_exists = 0,
  'ALTER TABLE `payments` ADD UNIQUE KEY `uq_payfast_payment_id` (`payfast_payment_id`)',
  'SELECT 1'
);
PREPARE payfast_index_statement FROM @payfast_index_sql;
EXECUTE payfast_index_statement;
DEALLOCATE PREPARE payfast_index_statement;

-- Verification
SELECT column_name, column_type
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name IN ('enrollments', 'progress', 'payments')
  AND column_name IN ('updated_at', 'status')
ORDER BY table_name, column_name;

SELECT index_name, non_unique
FROM information_schema.statistics
WHERE table_schema = DATABASE()
  AND table_name = 'payments'
  AND index_name = 'uq_payfast_payment_id';

-- Rollback guidance:
-- 1. Keep updated_at columns unless an older application cannot tolerate them.
-- 2. DROP INDEX uq_payfast_payment_id ON payments;
-- 3. Only contract the status enum after confirming no row has status='cancelled'.
