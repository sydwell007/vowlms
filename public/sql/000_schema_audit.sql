-- Read-only VowLMS schema audit. Run before importing migrations.

SELECT DATABASE() AS current_database, VERSION() AS mysql_version;

SELECT table_name, engine, table_collation
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY table_name;

SELECT table_name, column_name, column_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = DATABASE()
ORDER BY table_name, ordinal_position;

SELECT table_name, index_name, non_unique, GROUP_CONCAT(column_name ORDER BY seq_in_index) AS columns
FROM information_schema.statistics
WHERE table_schema = DATABASE()
GROUP BY table_name, index_name, non_unique
ORDER BY table_name, index_name;

-- Duplicate integrity checks.
-- Uses only information_schema (no stored procedures, no CREATE ROUTINE privilege needed).
-- Reports whether each table exists. On a new database both rows will show
-- TABLE_NOT_FOUND meaning no duplicate check is required before migration.
-- On an existing database, if a row shows TABLE_FOUND, run the corresponding
-- manual query in the comment block below before continuing with migrations.

SELECT
  'enrollments' AS table_name,
  CASE WHEN COUNT(*) > 0
       THEN 'TABLE_FOUND — run duplicate_enrolments check below before migrating'
       ELSE 'TABLE_NOT_FOUND — new database, no duplicate check needed'
  END AS duplicate_check_status
FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_name = 'enrollments'

UNION ALL

SELECT
  'payments' AS table_name,
  CASE WHEN COUNT(*) > 0
       THEN 'TABLE_FOUND — run duplicate_payfast_references check below before migrating'
       ELSE 'TABLE_NOT_FOUND — new database, no duplicate check needed'
  END AS duplicate_check_status
FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_name = 'payments';

/*
  ── Manual duplicate checks ───────────────────────────────────────────────────
  Run these individually in phpMyAdmin ONLY when the table status above shows
  TABLE_FOUND (i.e. you are patching an existing database, not a fresh install).
  Both queries must return issue_groups = 0 before you run 011_integrity_hardening.sql.

  SELECT 'duplicate_enrolments' AS check_name, COUNT(*) AS issue_groups
  FROM (
    SELECT user_id, course_id FROM enrollments
    GROUP BY user_id, course_id HAVING COUNT(*) > 1
  ) d;

  SELECT 'duplicate_payfast_references' AS check_name, COUNT(*) AS issue_groups
  FROM (
    SELECT payfast_payment_id FROM payments
    WHERE payfast_payment_id IS NOT NULL
    GROUP BY payfast_payment_id HAVING COUNT(*) > 1
  ) d;
  ─────────────────────────────────────────────────────────────────────────────
*/
