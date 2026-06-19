import { notFound } from "next/navigation";
import { getCourseBySlug, getAcademyBySlug } from "@/lib/data";
import { CertificateViewer } from "@/components/learning/CertificateViewer";

export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  return { title: course ? `Certificate — ${course.title}` : "Certificate" };
}

export default async function CertificatePageRoute({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const academy = getAcademyBySlug(course.academySlug);

  return (
    <CertificateViewer
      course={course}
      academyName={academy?.name ?? "GoalVow Academy"}
      learnerName="Amina Mokoena"
      completionDate="19 June 2026"
      certificateId={`GV-${courseSlug.slice(0, 6).toUpperCase()}-2026-001`}
    />
  );
}
