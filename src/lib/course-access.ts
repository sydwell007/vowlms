import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";

type EnrollmentRecord = {
  courseSlug?: string;
  course_slug?: string;
  status?: string;
};

export async function hasActiveCourseEnrollment(courseSlugs: string[]): Promise<boolean> {
  if (!isBridgeConfigured()) return true;

  const allowed = new Set(courseSlugs);
  const enrollments = await bridgeGet<EnrollmentRecord[]>("/enrollments");

  return enrollments.some((enrollment) => {
    const slug = enrollment.courseSlug ?? enrollment.course_slug;
    return Boolean(slug && allowed.has(slug) && ["active", "completed"].includes(enrollment.status ?? ""));
  });
}
