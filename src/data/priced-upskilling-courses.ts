/**
 * Which of the 20 Upskilling parent courses have real unlock pricing
 * configured (`public/sql/021_course_unlock_pricing.sql`'s
 * `course_unlock_pricing` table) — Module 1 free, everything after it paid.
 *
 * This is only used to decide *shape* (mark modules 2+ as `isFree: false`,
 * enroll only Module 1's real child course on first "Enrol free", show the
 * paywall) — the actual price shown/charged always comes live from
 * `/api/courses/unlock-price`, never from a number in this file.
 */
export const PRICED_UPSKILLING_COURSE_SLUGS = new Set([
  "business-ethics",
  "workplace-compliance",
  "organizational-culture",
  "stress-management",
  "cybersecurity",
  "health-and-wellness",
  "human-resources",
  "marketing",
  "sales",
  "project-management",
  "customer-service",
  "career-management",
  "change-management",
  "communication",
  "leadership",
  "resilience",
  "problem-solving",
  "time-management",
  "team-management",
  "critical-thinking",
]);

export function isPaidUpskillingCourse(slug: string): boolean {
  return PRICED_UPSKILLING_COURSE_SLUGS.has(slug);
}
