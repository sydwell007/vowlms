import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAssessmentBySlug } from "@/lib/data";

export default async function AssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getAssessmentBySlug(slug);

  if (!result) {
    notFound();
  }

  const { assessment, course } = result;

  return (
    <main className="premium-page">
      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="premium-card rounded-xl p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">{course.title}</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{assessment.title}</h1>
          <p className="mt-4 text-sm text-muted">Pass mark: {assessment.passMark}%</p>
          <div className="mt-8 space-y-5">
            {assessment.questions.map((question, index) => (
              <fieldset key={question.id} className="rounded-xl border border-slate-200/90 p-5">
                <legend className="px-2 text-sm font-semibold text-ink">
                  {index + 1}. {question.prompt}
                </legend>
                <div className="mt-4 grid gap-3">
                  {question.options.map((option) => (
                    <label key={option} className="premium-card-soft flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-700">
                      <input name={question.id} type="radio" className="h-4 w-4 accent-[#1166c8]" />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/results/${course.slug}`} variant="ink">
              Submit demo attempt
            </ButtonLink>
            <ButtonLink href={`/courses/${course.slug}`} variant="outline">
              Back to course
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
