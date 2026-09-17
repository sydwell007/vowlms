import { msOfficeGroupings, upskillGroupings } from "@/data/course-groupings";
import type { Course } from "@/types/lms";

/**
 * Learner-ready Upskilling parents: 20 professional-skills courses plus the
 * seven source-aligned Microsoft Office journeys. Ungrouped migration records
 * remain admin-only so learners never see internal module courses as products.
 */
export const LEARNER_VISIBLE_UPSKILLING_SLUGS: ReadonlySet<string> = new Set(
  [...upskillGroupings, ...msOfficeGroupings].map((grouping) => grouping.slug),
);

export function isLearnerVisibleUpskillingCourse(course: Pick<Course, "slug">): boolean {
  return LEARNER_VISIBLE_UPSKILLING_SLUGS.has(course.slug);
}
