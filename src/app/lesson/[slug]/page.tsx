import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getLessonBySlug } from "@/lib/data";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getLessonBySlug(slug);

  if (!result) {
    notFound();
  }

  const { lesson, course, module } = result;
  const assessment = course.assessments.find((item) => item.lessonSlug === lesson.slug);
  const practice = course.vrPractices.find((item) => item.lessonSlug === lesson.slug);

  return (
    <main className="premium-page">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <article className="premium-card rounded-xl p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">{course.title}</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{lesson.title}</h1>
          <p className="mt-3 text-sm font-medium text-muted">{module.title}</p>
          <div className="premium-section-dark mt-8 aspect-video rounded-xl p-6 text-white">
            <div className="premium-card-dark flex h-full flex-col justify-end rounded-xl p-5">
              <p className="text-sm font-semibold text-gold">Video placeholder</p>
              <p className="mt-2 text-sm text-white/68">{lesson.videoUrl}</p>
            </div>
          </div>
          <div className="prose prose-slate mt-8 max-w-none">
            <p className="text-lg leading-8 text-slate-700">{lesson.content}</p>
            <p className="text-base leading-7 text-slate-600">
              Learners can complete this lesson online today. Offline lesson text and saved progress sync are prepared as a future PWA enhancement.
            </p>
          </div>
        </article>
        <aside className="space-y-4">
          <div className="premium-card rounded-xl p-5">
            <p className="text-sm font-semibold text-[#1166c8]">Lesson actions</p>
            <div className="mt-4 space-y-3">
              {assessment ? (
                <ButtonLink href={`/assessment/${assessment.slug}`} variant="ink" className="flex w-full">
                  Assessment
                </ButtonLink>
              ) : null}
              {practice ? (
                <ButtonLink href={`/vr-practice/${practice.slug}`} variant="ink" className="flex w-full">
                  VR practice
                </ButtonLink>
              ) : null}
              <ButtonLink href={`/results/${course.slug}`} variant="outline" className="flex w-full">
                Results
              </ButtonLink>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
