import { notFound } from "next/navigation";
import { ResultsPageClient } from "@/components/learning/ResultsPageClient";
import { getCourseBySlug } from "@/lib/data";

export default async function ResultsPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return <ResultsPageClient course={course} />;
}
