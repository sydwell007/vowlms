export type CourseRatingSummary = { averageRating: number | null; totalReviews: number };
type Summaries = Record<string, CourseRatingSummary>;

export const COURSE_REVIEW_SUMMARIES_CHANGED = "vowlms:course-review-summaries-changed";

let cachedSummaries: Summaries | null = null;
let summariesRequest: Promise<Summaries> | null = null;
let cacheRevision = 0;

/** Mirrors getCourseEnrollmentCounts()'s fetch-once, cache-until-invalidated pattern. */
export function getCourseReviewSummaries(): Promise<Summaries> {
  if (cachedSummaries) return Promise.resolve(cachedSummaries);
  if (summariesRequest) return summariesRequest;

  const requestRevision = cacheRevision;
  const request: Promise<Summaries> = fetch("/api/courses/review-summaries", { cache: "no-store" })
    .then(async (response): Promise<Summaries> => {
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Course ratings could not be loaded.");

      const summaries = payload.data as Summaries;
      if (requestRevision !== cacheRevision) return getCourseReviewSummaries();
      cachedSummaries = summaries;
      return summaries;
    })
    .finally(() => {
      if (summariesRequest === request) summariesRequest = null;
    });

  summariesRequest = request;
  return request;
}

export function invalidateCourseReviewSummaries(courseSlug: string) {
  cacheRevision += 1;
  cachedSummaries = null;
  summariesRequest = null;

  window.dispatchEvent(
    new CustomEvent(COURSE_REVIEW_SUMMARIES_CHANGED, {
      detail: { courseSlug },
    }),
  );
}
