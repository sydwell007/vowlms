import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Section } from "@/components/ui/Section";
import { formatCurrency, getAcademyBySlug, getCourseBySlug } from "@/lib/data";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const academy = getAcademyBySlug(course.academySlug);
  const firstLesson = course.modules[0]?.lessons[0];
  const assessment = course.assessments[0];
  const practice = course.vrPractices[0];

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{academy?.name}</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">{course.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {firstLesson ? (
                <ButtonLink href={`/lesson/${firstLesson.slug}`}>
                  Start first lesson
                </ButtonLink>
              ) : null}
              {assessment ? (
                <ButtonLink href={`/assessment/${assessment.slug}`} variant="secondary">
                  Take assessment
                </ButtonLink>
              ) : null}
              {practice ? (
                <ButtonLink href={`/vr-practice/${practice.slug}`} variant="secondary">
                  Open VR practice
                </ButtonLink>
              ) : null}
            </div>
          </div>
          <aside className="premium-card rounded-xl p-5 text-ink">
            <p className="text-sm font-semibold text-[#1166c8]">{course.level}</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(course.price)}</p>
            <p className="mt-1 text-sm text-muted">{course.duration}</p>
            <div className="mt-6">
              <ProgressBar value={42} label="Demo learner progress" />
            </div>
            <p className="mt-6 text-sm leading-6 text-muted">
              Completion unlocks certificate generation, VowRewards points, and PlugConnect opportunity matching.
            </p>
          </aside>
        </div>
      </section>
      <Section tone="light" title="Modules and lessons" description="A compact course structure for this phase, without Moodle-style complexity.">
        <div className="grid gap-5 lg:grid-cols-2">
          {course.modules.map((moduleItem) => (
            <article key={moduleItem.title} className="premium-card rounded-xl p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Module {moduleItem.order}</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{moduleItem.title}</h2>
              <div className="mt-5 space-y-3">
                {moduleItem.lessons.map((lesson) => (
                  <Link key={lesson.slug} href={`/lesson/${lesson.slug}`} className="premium-card-soft flex items-center justify-between rounded-lg p-4 text-sm font-medium text-ink transition hover:border-[#1166c8]/18 hover:bg-[#f5f9ff]">
                    <span>{lesson.title}</span>
                    <span className="text-muted">{lesson.durationMinutes} min</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Outcomes and pathways">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="premium-card-dark rounded-xl p-6">
            <h2 className="text-2xl font-semibold">Learner outcomes</h2>
            <div className="mt-5 space-y-3">
              {course.outcomes.map((outcome) => (
                <p key={outcome} className="rounded-md bg-white/10 px-4 py-3 text-sm text-white/78">{outcome}</p>
              ))}
            </div>
          </div>
          <div className="premium-card-dark rounded-xl p-6">
            <h2 className="text-2xl font-semibold">Opportunity pathways</h2>
            <div className="mt-5 space-y-3">
              {course.opportunityPathways.map((pathway) => (
                <p key={pathway} className="rounded-md bg-white/10 px-4 py-3 text-sm text-white/78">{pathway}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
