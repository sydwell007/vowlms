-- =============================================================================
-- VowLMS — Schema Patch 027
-- Removes the ~183 fake per-module "...Certificate of Completion" lesson rows
-- that were baked into the original Moodle migration dump (every module in
-- almost every course ended with one) — these were placeholder Moodle
-- sections with no real content ("Content is being loaded. Please check back
-- shortly." on the lesson page) and, more importantly, they inflate each
-- course's real lesson COUNT in the `lessons` table, which is what
-- public/php/api/progress/index.php divides by to compute
-- `enrollments.progress` — so a learner who finishes every real lesson could
-- never actually reach 100% progress, and a certificate could never be
-- issued (progress=100 is one of certificate-generate.php's hard gates).
--
-- Mirrors the equivalent fix already applied to the frontend's static lesson
-- content in src/data/seed-data.ts (and to future Moodle re-imports in
-- scripts/moodle-migration/3-transform.mjs) — this migration is what makes
-- the same fix take effect for real, already-enrolled learners' progress
-- calculations.
--
-- Safe to re-run (both DELETEs are no-ops once nothing matches). `lessons`
-- has `progress.lesson_id` with ON DELETE CASCADE, so any learner's existing
-- progress row against a fake lesson is cleaned up automatically — that
-- progress was never toward anything a learner could see anyway.
-- =============================================================================

DELETE FROM `lessons` WHERE `slug` LIKE '%-certificate-of-completion';

-- A module whose only lesson was the fake certificate lesson is now an
-- empty shell (no fk_module_course cascade triggers this automatically —
-- deleting a lesson doesn't delete its now-childless module).
DELETE FROM `modules` WHERE `id` NOT IN (SELECT DISTINCT `module_id` FROM `lessons`);

-- =============================================================================
-- Patch 027 complete. Re-run is safe.
-- =============================================================================
