import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { formatCurrency, getAcademyBySlug, getCourseBySlug } from "@/lib/data";
import { visualAssets } from "@/lib/visual-assets";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  return { title: course?.title ?? "Course" };
}

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
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
              <Link href="/courses" className="hover:text-white transition">Courses</Link>
              <span>/</span>
              <Link href={`/academies/${academy?.category}`} className="hover:text-white transition">{academy?.name}</Link>
            </div>
            <h1 className="mt-2 text-balance text-4xl font-semibold sm:text-6xl">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">{course.description}</p>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><span>📊</span> {course.level}</span>
              <span className="flex items-center gap-1.5"><span>⏱</span> {course.duration}</span>
              <span className="flex items-center gap-1.5"><span>📚</span> {totalLessons} lessons</span>
              <span className="flex items-center gap-1.5"><span>🏅</span> Certificate included</span>
              <span className="flex items-center gap-1.5"><span>⭐</span> {course.rewards} VowRewards</span>
            </div>

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

            {/* Discussion + Assignments links */}
            <div className="mt-5 flex gap-3">
              <Link href={`/courses/${slug}/discussion`}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white">
                💬 Discussion
              </Link>
              <Link href={`/courses/${slug}/assignments`}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white">
                📝 Assignments
              </Link>
            </div>
          </div>

          {/* Enrollment card */}
          <aside className="space-y-4 self-start">
            <ImagePanel
              src={practice ? visualAssets.vrPracticeLab : visualAssets.dashboardExperience}
              alt={`${course.title} learning experience`}
              aspect="video"
              className="hidden lg:block"
            />
            <div className="premium-card rounded-2xl p-6 text-ink">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">Enrol now</p>
            <p className="mt-3 text-4xl font-bold text-ink">{formatCurrency(course.price)}</p>
            {course.price > 0 && <p className="mt-1 text-xs text-muted">One-time payment · PayFast secure</p>}
            <div className="mt-5">
              <EnrollButton course={course} />
            </div>

            <div className="mt-5 space-y-2.5 text-sm">
              {[
                { icon: "📱", text: "Mobile-first PWA access" },
                { icon: "⬇", text: "Offline lesson content" },
                { icon: "🏅", text: "Certificate on completion" },
                { icon: "⭐", text: `${course.rewards} VowRewards points` },
                { icon: "🥽", text: "VR practice included" },
                { icon: "💬", text: "Facilitator-led discussion" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-muted">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-2">Duration</p>
              <p className="text-sm font-semibold text-ink">{course.duration}</p>
            </div>
            </div>
          </aside>
        </div>
      </section>

      <Section tone="light" title="Modules and lessons" description="A structured course pathway with text lessons, assessments, and VR practice.">
        <div className="grid gap-5 lg:grid-cols-2">
          {course.modules.map((moduleItem) => (
            <article key={moduleItem.title} className="premium-card rounded-xl p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Module {moduleItem.order}</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{moduleItem.title}</h2>
              <div className="mt-5 space-y-2">
                {moduleItem.lessons.map((lesson) => (
                  <Link key={lesson.slug} href={`/lesson/${lesson.slug}`}
                    className="premium-card-soft flex items-center justify-between rounded-lg p-4 text-sm font-medium text-ink transition hover:border-[#1166c8]/18 hover:bg-[#f5f9ff]">
                    <div className="flex items-center gap-3">
                      <span className="text-base">
                        {lesson.type === "vr-practice" ? "🥽" : lesson.type === "assessment" ? "📝" : "▸"}
                      </span>
                      <span>{lesson.title}</span>
                    </div>
                    <span className="text-xs text-muted shrink-0">{lesson.durationMinutes} min</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Outcomes and opportunity pathways">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="premium-card-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Learner outcomes</h2>
            <div className="space-y-2">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-3 rounded-md bg-white/8 px-4 py-3">
                  <span className="text-gold mt-0.5 shrink-0">✓</span>
                  <p className="text-sm text-white/80">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="premium-card-dark rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Opportunity pathways</h2>
            <div className="space-y-2">
              {course.opportunityPathways.map((pathway) => (
                <div key={pathway} className="flex items-start gap-3 rounded-md bg-white/8 px-4 py-3">
                  <span className="text-gold mt-0.5 shrink-0">→</span>
                  <p className="text-sm text-white/80">{pathway}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
