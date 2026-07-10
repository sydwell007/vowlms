import { notFound } from "next/navigation";
import { getCourseBySlug, getAcademyBySlug } from "@/lib/data";
import { CertificateRouteClient } from "@/components/certificates/CertificateRouteClient";

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

  return <CertificateRouteClient course={course} academyName={academy?.name ?? "GoalVow Academy"} />;
}
