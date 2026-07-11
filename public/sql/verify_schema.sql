-- VowLMS post-migration verification
-- This deployment uses goalvxiw_vowlms. Every application-table reference is
-- fully qualified because phpMyAdmin may retain information_schema as context.
-- Replace all goalvxiw_vowlms references if the database is renamed.

USE `goalvxiw_vowlms`;

SELECT 'goalvxiw_vowlms' AS verified_database;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'goalvxiw_vowlms'
  AND table_name IN (
    'users','academies','courses','modules','lessons','enrollments','progress',
    'assessments','assessment_attempts','vr_practices','vr_attempts',
    'certificates','reward_events','payments','password_resets'
  )
ORDER BY table_name;

SELECT table_name, column_name, column_type
FROM information_schema.columns
WHERE table_schema = 'goalvxiw_vowlms'
  AND (
    (table_name = 'payments' AND column_name IN ('amount','status','payfast_payment_id','itn_data')) OR
    (table_name = 'enrollments' AND column_name IN ('progress','updated_at')) OR
    (table_name = 'progress' AND column_name IN ('completed','updated_at'))
  )
ORDER BY table_name, column_name;

SELECT table_name, index_name, non_unique
FROM information_schema.statistics
WHERE table_schema = 'goalvxiw_vowlms'
  AND index_name IN ('uq_enrollment','uq_progress','uq_cert_id','uq_user_course','uq_payfast_payment_id')
ORDER BY table_name, index_name;

SELECT COUNT(*) AS invalid_progress_rows
FROM `goalvxiw_vowlms`.`enrollments`
WHERE progress < 0 OR progress > 100;

SELECT COUNT(*) AS orphan_progress_rows
FROM `goalvxiw_vowlms`.`progress` p
LEFT JOIN `goalvxiw_vowlms`.`users` u ON u.id = p.user_id
LEFT JOIN `goalvxiw_vowlms`.`lessons` l ON l.id = p.lesson_id
WHERE u.id IS NULL OR l.id IS NULL;
