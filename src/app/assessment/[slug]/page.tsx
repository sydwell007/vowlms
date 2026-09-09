import { notFound, redirect } from "next/navigation";
import { getAcademyBySlug, getAcademyHref, getAssessmentBySlug, getEnrollableCourseSlugs } from "@/lib/data";
import { AssessmentPlayer } from "@/components/learning/AssessmentPlayer";
import { BridgeError } from "@/lib/bridge";
import { hasActiveCourseEnrollment } from "@/lib/course-access";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getAssessmentBySlug(slug);
  return {
    title: result?.assessment.title ?? "Assessment",
    robots: { index: false, follow: false },
  };
}

export default async function AssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getAssessmentBySlug(slug);

  if (!result) notFound();

  try {
    if (!await hasActiveCourseEnrollment(getEnrollableCourseSlugs(result.course.slug))) {
      redirect(`/courses/${result.course.slug}?enrolment=required`);
    }
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) {
      redirect(`/auth/signin?returnTo=${encodeURIComponent(`/assessment/${slug}`)}`);
    }
    throw error;
  }

  const academy = getAcademyBySlug(result.course.academySlug);
  return (
    <AssessmentPlayer
      assessment={result.assessment}
      course={result.course}
      academyName={academy?.name}
      academyHref={academy ? getAcademyHref(academy) : undefined}
    />
  );
}
