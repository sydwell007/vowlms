import { notFound } from "next/navigation";
import { getAssessmentBySlug } from "@/lib/data";
import { AssessmentPlayer } from "@/components/learning/AssessmentPlayer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getAssessmentBySlug(slug);
  return { title: result?.assessment.title ?? "Assessment" };
}

export default async function AssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getAssessmentBySlug(slug);

  if (!result) notFound();

  return <AssessmentPlayer assessment={result.assessment} course={result.course} />;
}
