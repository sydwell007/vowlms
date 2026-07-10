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

SELECT 'duplicate_enrolments' AS check_name, COUNT(*) AS issue_groups
FROM (
  SELECT user_id, course_id FROM enrollments GROUP BY user_id, course_id HAVING COUNT(*) > 1
) duplicates
UNION ALL
SELECT 'duplicate_payfast_references', COUNT(*)
FROM (
  SELECT payfast_payment_id FROM payments
  WHERE payfast_payment_id IS NOT NULL
  GROUP BY payfast_payment_id HAVING COUNT(*) > 1
) duplicates;
