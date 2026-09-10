import { allGroupings } from "@/data/course-groupings";
import { getCourseBySlug, getParentGroupSlug } from "@/lib/data";
import { isCertificateCourse } from "@/lib/certificates/catalogue";

export type CertificateIssuePayload = {
  courseSlug: string;
  courseName: string;
  courseSlugs: string[];
  anchorCourseSlug: string;
};

export function getCertificateIssuePayload(courseSlug: string): CertificateIssuePayload | null {
  const parentSlug = getParentGroupSlug(courseSlug) ?? courseSlug;
  if (!isCertificateCourse(parentSlug)) return null;
  const grouping = allGroupings.find((item) => item.slug === parentSlug);
  const course = getCourseBySlug(parentSlug);
  const courseSlugs = grouping?.moduleSlugOrder ?? [courseSlug];
  const anchorCourseSlug = courseSlugs.at(-1);
  if (!course || !anchorCourseSlug) return null;
  return { courseSlug: parentSlug, courseName: course.title, courseSlugs, anchorCourseSlug };
}
