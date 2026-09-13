-- =============================================================================
-- VowLMS — Schema Patch 031
-- Adds 'survey' as a real lesson type and retypes every "Rate this Module"
-- lesson to it. The frontend's static seed-data.ts already know this (fixed
-- alongside module_survey_responses/surveys endpoints), but the CURRENTLY
-- OPEN lesson's own type is read directly from this table via the bridge
-- (src/app/lesson/[slug]/page.tsx's bridgeToProps(), `d.lesson.type`) —
-- entirely independent of the sidebar's module list, which does come from
-- seed-data.ts. Without this, the survey form the frontend now knows how to
-- render never actually shows: the currently-open lesson still reports type
-- 'text', and the learner sees the old broken "Content is being loaded"
-- placeholder no matter what the sidebar says.
--
-- Safe to re-run: ALTER ... MODIFY and the UPDATE are both idempotent.
-- =============================================================================

ALTER TABLE `lessons`
  MODIFY COLUMN `type` ENUM('text','video','assessment','vr_practice','survey') NOT NULL DEFAULT 'text';

UPDATE `lessons` SET `type` = 'survey' WHERE `slug` LIKE '%-rate-this-module' AND `type` != 'survey';

-- =============================================================================
-- Patch 031 complete. Re-run is safe.
-- =============================================================================
