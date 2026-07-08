-- Fix: courses.academy_id was stored as aca-{slug} (slug-based format)
-- but the academies table uses sequential IDs like aca-{slug}-{seq}.
-- This UPDATE joins them via the slug (strips the "aca-" prefix) and
-- overwrites academy_id with the correct sequential ID.
-- Safe to run multiple times.

UPDATE courses c
JOIN academies a ON a.slug = SUBSTRING(c.academy_id, 5)
SET c.academy_id = a.id
WHERE c.academy_id <> a.id;

-- Verify (should return 0 after the fix):
-- SELECT COUNT(*) AS still_broken
-- FROM courses c
-- LEFT JOIN academies a ON a.id = c.academy_id
-- WHERE a.id IS NULL;
