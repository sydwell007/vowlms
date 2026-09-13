-- =============================================================================
-- VowLMS — Schema Patch 029
-- One-time corrective recalculation of every existing enrollment's progress
-- percentage, now that 027_remove_fake_certificate_lessons.sql shrank the
-- real lesson count for almost every course.
--
-- public/php/api/progress/index.php only ever recalculates
-- `enrollments.progress` as a side effect of a NEW lesson-completion event —
-- it never retroactively re-runs for lessons a learner already completed
-- before 027 ran. So a learner who finished every real lesson before that
-- migration shipped is left with a stale, understated progress value
-- (computed against the OLD, larger lesson-count denominator) even though
-- their real completed-lesson count already satisfies 100% today — which
-- silently blocks certificate issuance (generate.php requires progress=100)
-- with no further action from the learner able to fix it.
--
-- This can only ever CORRECT PROGRESS UPWARD: the numerator (real completed
-- lessons) is unchanged, only the denominator (total real lessons) shrank,
-- so no enrollment can come out of this with a lower percentage than it
-- already had. `dropped` enrollments are left untouched — finishing every
-- lesson before dropping a course shouldn't silently resurrect it as
-- completed.
--
-- Safe to re-run: recomputing the same real counts twice is a no-op.
-- =============================================================================

UPDATE `enrollments` e
JOIN (
  SELECT m.course_id, COUNT(l.id) AS total_lessons
  FROM `lessons` l
  JOIN `modules` m ON m.id = l.module_id
  GROUP BY m.course_id
) totals ON totals.course_id = e.course_id
LEFT JOIN (
  SELECT m.course_id, p.user_id, COUNT(*) AS done_lessons
  FROM `progress` p
  JOIN `lessons` l ON l.id = p.lesson_id
  JOIN `modules` m ON m.id = l.module_id
  WHERE p.completed = 1
  GROUP BY m.course_id, p.user_id
) done ON done.course_id = e.course_id AND done.user_id = e.user_id
SET
  e.progress = LEAST(100, ROUND(COALESCE(done.done_lessons, 0) / totals.total_lessons * 100)),
  e.status = IF(COALESCE(done.done_lessons, 0) >= totals.total_lessons, 'completed', e.status),
  e.completed_at = IF(
    COALESCE(done.done_lessons, 0) >= totals.total_lessons AND e.completed_at IS NULL,
    NOW(),
    e.completed_at
  )
WHERE totals.total_lessons > 0 AND e.status != 'dropped';

-- =============================================================================
-- Patch 029 complete. Re-run is safe.
-- =============================================================================
