type EnrollmentCounts = Record<string, number>;

export const COURSE_ENROLLMENT_COUNTS_CHANGED = "vowlms:course-enrollment-counts-changed";

let cachedCounts: EnrollmentCounts | null = null;
let countsRequest: Promise<EnrollmentCounts> | null = null;
let cacheRevision = 0;

export function getCourseEnrollmentCounts(): Promise<EnrollmentCounts> {
  if (cachedCounts) return Promise.resolve(cachedCounts);
  if (countsRequest) return countsRequest;

  const requestRevision = cacheRevision;
  const request: Promise<EnrollmentCounts> = fetch("/api/courses/enrollment-counts", { cache: "no-store" })
    .then(async (response): Promise<EnrollmentCounts> => {
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Enrolment totals could not be loaded.");

      const counts = payload.data as EnrollmentCounts;
      if (requestRevision !== cacheRevision) return getCourseEnrollmentCounts();
      cachedCounts = counts;
      return counts;
    })
    .finally(() => {
      if (countsRequest === request) countsRequest = null;
    });

  countsRequest = request;
  return request;
}

export function invalidateCourseEnrollmentCounts(courseSlug: string) {
  cacheRevision += 1;
  cachedCounts = null;
  countsRequest = null;

  window.dispatchEvent(
    new CustomEvent(COURSE_ENROLLMENT_COUNTS_CHANGED, {
      detail: { courseSlug },
    }),
  );
}
