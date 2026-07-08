-- Fix: Delete lessons and modules that have no valid parent course.
-- These were created by the seed SQL when a course INSERT was skipped
-- by INSERT IGNORE (duplicate slug), leaving modules/lessons pointing
-- to a course_id that doesn't exist. Clicking those lesson links causes 404.

SET FOREIGN_KEY_CHECKS=0;

-- 1. Remove lesson_resources for orphaned lessons first
DELETE lr FROM lesson_resources lr
JOIN lessons l ON l.id = lr.lesson_id
JOIN modules m ON m.id = l.module_id
LEFT JOIN courses c ON c.id = m.course_id
WHERE c.id IS NULL;

-- 2. Remove orphaned lessons
DELETE l FROM lessons l
JOIN modules m ON m.id = l.module_id
LEFT JOIN courses c ON c.id = m.course_id
WHERE c.id IS NULL;

-- 3. Remove orphaned modules
DELETE m FROM modules m
LEFT JOIN courses c ON c.id = m.course_id
WHERE c.id IS NULL;

SET FOREIGN_KEY_CHECKS=1;

-- Verify — both should return 0 rows after the fix:
-- SELECT COUNT(*) AS orphaned_modules FROM modules m LEFT JOIN courses c ON c.id=m.course_id WHERE c.id IS NULL;
-- SELECT COUNT(*) AS orphaned_lessons  FROM lessons  l JOIN modules m ON m.id=l.module_id LEFT JOIN courses c ON c.id=m.course_id WHERE c.id IS NULL;
