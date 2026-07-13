import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { formatCurrency, getAcademyBySlug, getCourseBySlug } from "@/lib/data";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { formatDuration, getCourseStats } from "@/lib/course-content";

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
  const accentColor = getAcademyAccentColor(academy?.category);
  const firstLesson = course.modules[0]?.lessons[0];
  const assessment = course.assessments[0];
  const practice = course.vrPractices[0];
  const stats = getCourseStats(course);

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
              <Link href="/courses" className="hover:text-white transition">Courses</Link>
              <span>/</span>
              <Link href={`/academies/${academy?.category}`} className="hover:text-white transition">{academy?.name}</Link>
            </div>

            {academy ? (
              <span className="inline-block rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                Course preview
              </span>
            ) : null}

            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">{course.description}</p>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><span>📊</span> {course.level}</span>
              <span className="flex items-center gap-1.5"><span>⏱</span> {course.duration}</span>
              <span className="flex items-center gap-1.5"><span>📚</span> {stats.lessonCount} lessons</span>
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

          {/* Enrolment card — sticky on desktop so it stays in view while scrolling the preview */}
          <aside className="self-start lg:sticky lg:top-24">
            <div className="premium-card rounded-2xl p-6 text-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Enrol now</p>
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

      {/* ── Course-at-a-glance stat strip ─────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-6">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 sm:grid-cols-4 lg:px-8">
          {[
            { label: "Modules", value: String(stats.moduleCount) },
            { label: "Lessons", value: String(stats.lessonCount) },
            { label: "Total time", value: formatDuration(stats.totalMinutes) },
            { label: "Level", value: course.level },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-semibold sm:text-3xl" style={{ color: accentColor }}>{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ─────────────────────────────────────────────── */}
      <Section
        tone="light"
        size="tight"
        eyebrow="Course preview"
        title="What you'll learn"
        description="A quick look at the outcomes this course is built to deliver — before you commit."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {course.outcomes.map((outcome) => (
            <div key={outcome} className="premium-card flex items-start gap-3 rounded-xl p-5">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: `${accentColor}18`, color: accentColor }}
              >
                ✓
              </span>
              <p className="text-sm leading-6 text-ink">{outcome}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Curriculum accordion ──────────────────────────────────────────── */}
      <Section
        tone="light"
        size="tight"
        eyebrow="Curriculum"
        title="Course curriculum"
        description="Every module is summarised below. Open a module to preview its lessons — enrol to unlock the full learning experience."
      >
        <CourseCurriculum modules={course.modules} accentColor={accentColor} />
      </Section>

      {/* ── Opportunity pathways ──────────────────────────────────────────── */}
      <Section title="Where this course leads">
        <div className="premium-card-dark rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Opportunity pathways</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {course.opportunityPathways.map((pathway) => (
              <div key={pathway} className="flex items-start gap-3 rounded-md bg-white/8 px-4 py-3">
                <span className="text-gold mt-0.5 shrink-0">→</span>
                <p className="text-sm text-white/80">{pathway}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="premium-section-dark surface-grid py-14 text-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Ready to start {course.title}?</h2>
          <p className="max-w-xl text-white/70">
            Join a structured pathway with lessons, assessments, and VR practice — and earn a certificate plus {course.rewards} VowRewards on completion.
          </p>
          {firstLesson ? (
            <ButtonLink href={`/lesson/${firstLesson.slug}`}>Start first lesson</ButtonLink>
          ) : null}
        </div>
      </section>
    </main>
  );
}
