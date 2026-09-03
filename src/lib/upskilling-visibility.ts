import { upskillGroupings } from "@/data/course-groupings";
import type { Course } from "@/types/lms";

/**
 * The 20 fully-built Upskilling parent courses (real modules, lessons, and
 * module images) — the only Upskilling courses ready for learners today.
 * Everything else under the Upskilling academy (the 7 grouped Microsoft
 * Office courses, and the ~300 ungrouped raw Moodle-migrated courses like
 * "Microsoft Word Basics") is admin-only until it's finished and launched.
 */
export const LEARNER_VISIBLE_UPSKILLING_SLUGS: ReadonlySet<string> = new Set(
  upskillGroupings.map((grouping) => grouping.slug),
);

export function isLearnerVisibleUpskillingCourse(course: Pick<Course, "slug">): boolean {
  return LEARNER_VISIBLE_UPSKILLING_SLUGS.has(course.slug);
}
