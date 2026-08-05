-- =============================================================================
-- VowLMS — Seed integrity diagnostics (read-only)
-- Run manually in phpMyAdmin, or via GET public/php/api/qa/verify-seed-integrity.php
-- (which runs these same queries and returns them as structured JSON).
--
-- Corrected to the real schema (001_schema.sql): lowercase snake_case tables,
-- `courses.academy_id -> academies.id` (there is no `Course.academy` string
-- column), and no PascalCase `Course`/`Academy` tables — those don't exist.
-- =============================================================================

-- Course count per academy
SELECT a.`name` AS academy, a.`slug` AS academy_slug, COUNT(c.`id`) AS course_count
FROM `academies` a
LEFT JOIN `courses` c ON c.`academy_id` = a.`id`
GROUP BY a.`id`, a.`name`, a.`slug`
ORDER BY course_count DESC;

-- Orphaned courses (academy_id doesn't match any real academy)
SELECT COUNT(*) AS orphaned_courses
FROM `courses` c
LEFT JOIN `academies` a ON c.`academy_id` = a.`id`
WHERE a.`id` IS NULL;

-- Empty title/description
SELECT COUNT(*) AS empty_courses
FROM `courses`
WHERE `title` IS NULL OR `title` = '' OR `description` IS NULL OR `description` = '';

-- Courses with zero modules
SELECT COUNT(*) AS courses_without_modules
FROM `courses` c
LEFT JOIN `modules` m ON m.`course_id` = c.`id`
WHERE m.`id` IS NULL;

-- Duplicate titles within the same academy
SELECT c.`title`, a.`name` AS academy, COUNT(*) AS dupes
FROM `courses` c
JOIN `academies` a ON a.`id` = c.`academy_id`
GROUP BY c.`title`, a.`id`, a.`name`
HAVING COUNT(*) > 1;
