import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";

type EnrollmentRecord = {
  courseSlug?: string;
  course_slug?: string;
  status?: string;
};

function matchesAny(enrollments: EnrollmentRecord[], allowed: Set<string>): boolean {
  return enrollments.some((enrollment) => {
    const slug = enrollment.courseSlug ?? enrollment.course_slug;
    return Boolean(slug && allowed.has(slug) && ["active", "completed"].includes(enrollment.status ?? ""));
  });
}

/**
 * Real, observed behavior on the live bridge: a GET /enrollments issued
 * within a second or two of the POST /enrollments that created the row can
 * occasionally still come back empty (confirmed via direct server-side
 * logging — not a client/router caching artifact, and the staleness window
 * varies in length). This is transient read-after-write staleness on the
 * Afrihost/PHP side, not a permissions question, so short-delay retries are
 * safe: they can never grant access to someone who genuinely isn't enrolled
 * (they'd fail every retry identically), they only protect a learner who
 * just enrolled from a spurious "not enrolled" bounce back to the paywall.
 */
export async function hasActiveCourseEnrollment(courseSlugs: string[]): Promise<boolean> {
  if (!isBridgeConfigured()) return true;

  const allowed = new Set(courseSlugs);
  const retryDelaysMs = [600, 1000, 1500];

  const first = await bridgeGet<EnrollmentRecord[]>("/enrollments");
  if (matchesAny(first, allowed)) return true;

  for (const delayMs of retryDelaysMs) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const retry = await bridgeGet<EnrollmentRecord[]>("/enrollments");
    if (matchesAny(retry, allowed)) return true;
  }

  return false;
}
