import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssessmentBySlug } from "@/lib/data";

export default async function AssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getAssessmentBySlug(slug);

  if (!result) {
    notFound();
  }

  const { assessment, course } = result;

  return (
    <main className="bg-slate-50 text-ink">
      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">{course.title}</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{assessment.title}</h1>
          <p className="mt-4 text-sm text-muted">Pass mark: {assessment.passMark}%</p>
          <div className="mt-8 space-y-5">
            {assessment.questions.map((question, index) => (
              <fieldset key={question.id} className="rounded-lg border border-slate-200 p-5">
                <legend className="px-2 text-sm font-semibold text-ink">
                  {index + 1}. {question.prompt}
                </legend>
                <div className="mt-4 grid gap-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <input name={question.id} type="radio" className="h-4 w-4 accent-[#1166c8]" />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/results/${course.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#06111f] px-5 text-sm font-semibold text-white">
              Submit demo attempt
            </Link>
            <Link href={`/courses/${course.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-ink">
              Back to course
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
