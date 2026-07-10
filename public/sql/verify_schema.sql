-- VowLMS post-migration verification

SELECT table_name
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN (
    'users','academies','courses','modules','lessons','enrollments','progress',
    'assessments','assessment_attempts','vr_practices','vr_attempts',
    'certificates','reward_events','payments','password_resets'
  )
ORDER BY table_name;

SELECT table_name, column_name, column_type
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND (
    (table_name = 'payments' AND column_name IN ('amount','status','payfast_payment_id','itn_data')) OR
    (table_name = 'enrollments' AND column_name IN ('progress','updated_at')) OR
    (table_name = 'progress' AND column_name IN ('completed','updated_at'))
  )
ORDER BY table_name, column_name;

SELECT table_name, index_name, non_unique
FROM information_schema.statistics
WHERE table_schema = DATABASE()
  AND index_name IN ('uq_enrollment','uq_progress','uq_cert_id','uq_user_course','uq_payfast_payment_id')
ORDER BY table_name, index_name;

SELECT COUNT(*) AS invalid_progress_rows
FROM enrollments
WHERE progress < 0 OR progress > 100;

SELECT COUNT(*) AS orphan_progress_rows
FROM progress p
LEFT JOIN users u ON u.id = p.user_id
LEFT JOIN lessons l ON l.id = p.lesson_id
WHERE u.id IS NULL OR l.id IS NULL;
