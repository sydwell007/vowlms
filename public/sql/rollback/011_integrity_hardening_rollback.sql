-- Review-only rollback for migration 011.
-- Take a backup and confirm no cancelled payment rows exist before running.

SELECT COUNT(*) AS cancelled_payments FROM payments WHERE status = 'cancelled';

-- Run only when cancelled_payments = 0 and the previous application requires it:
-- ALTER TABLE payments DROP INDEX uq_payfast_payment_id;
-- ALTER TABLE payments MODIFY COLUMN status
--   ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending';

-- Additive updated_at columns are intentionally retained.
