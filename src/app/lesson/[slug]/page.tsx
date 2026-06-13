import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="bg-slate-50 text-ink">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <article className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">{course.title}</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{lesson.title}</h1>
          <p className="mt-3 text-sm font-medium text-muted">{module.title}</p>
          <div className="mt-8 aspect-video rounded-lg bg-[#06111f] p-6 text-white">
            <div className="flex h-full flex-col justify-end rounded-lg border border-white/10 bg-white/10 p-5">
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
          <div className="rounded-lg border border-slate-200 bg-white p-5 card-shadow">
            <p className="text-sm font-semibold text-[#1166c8]">Lesson actions</p>
            <div className="mt-4 space-y-3">
              {assessment ? (
                <Link href={`/assessment/${assessment.slug}`} className="flex min-h-11 items-center justify-center rounded-md bg-[#06111f] px-4 text-sm font-semibold text-white">
                  Assessment
                </Link>
              ) : null}
              {practice ? (
                <Link href={`/vr-practice/${practice.slug}`} className="flex min-h-11 items-center justify-center rounded-md bg-[#1166c8] px-4 text-sm font-semibold text-white">
                  VR practice
                </Link>
              ) : null}
              <Link href={`/results/${course.slug}`} className="flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-ink">
                Results
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
