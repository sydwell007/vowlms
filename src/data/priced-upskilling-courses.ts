/**
 * Upskilling parent courses with real unlock pricing configured by migrations
 * 021 and 037 in the `course_unlock_pricing` table. Module 1 stays free and
 * every later module is paid.
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
  "microsoft-word-basics",
  "microsoft-word-advance",
  "microsoft-excel-basics",
  "microsoft-excel-advance",
  "microsoft-power-point",
  "microsoft-outlook",
  "microsoft-access",
]);

export function isPaidUpskillingCourse(slug: string): boolean {
  return PRICED_UPSKILLING_COURSE_SLUGS.has(slug);
}

/**
 * Display-only "starting from" teaser for catalogue/course cards — NOT the
 * authoritative price (that's always `/api/courses/unlock-price`, computed
 * live server-side from `course_unlock_pricing`). This exists purely so a
 * card can say "from R299" without an extra live fetch per card in a grid of
 * 20+ courses. Keep in sync with `price_zar` in
 * `public/sql/021_course_unlock_pricing.sql` — if that ever changes, update
 * this too. A stale few-Rand mismatch here is a cosmetic teaser issue, not a
 * billing one, since checkout always re-fetches the real price.
 *
 * The founding-learner launch discount (R299 → R209) was retired
 * 2026-09-14 (`public/sql/034_disable_founding_discount.sql`) — every
 * course now always prices at its standard rate.
 */
export const UPSKILLING_PRICE_TEASER_ZAR = 299;
