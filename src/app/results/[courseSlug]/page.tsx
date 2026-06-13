import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCourseBySlug } from "@/lib/data";

export default async function ResultsPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <main className="premium-page">
      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="premium-card rounded-xl p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Results</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{course.title}</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Lessons" value="6/6" detail="Completed in demo flow" />
            <MetricCard label="Assessment" value="84%" detail="Passed above mark" />
            <MetricCard label="VR score" value="86%" detail="Practice placeholder" />
            <MetricCard label="Rewards" value={`${course.rewards}`} detail="Points queued" />
          </div>
          <div className="mt-8">
            <ProgressBar value={100} label="Completion" />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/certificates/${course.slug}`} variant="ink">
              Generate certificate
            </ButtonLink>
            <ButtonLink href="/rewards" variant="outline">
              View rewards
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
