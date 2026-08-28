import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  ClipboardCheck,
  Download,
  Glasses,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseExperience } from "@/components/courses/CourseExperience";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { getAcademyBySlug, getAcademyHref, getCourseBySlug, getCourseSummariesByAcademy } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { formatDuration, getCourseStats } from "@/lib/course-content";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { getAcademyCourseImage } from "@/lib/visual-assets";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course" };

  const description = course.description.length > 155
    ? `${course.description.slice(0, 152)}...`
    : course.description;

  return { title: course.title, description };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const academy = getAcademyBySlug(course.academySlug);
  if (isHiddenAcademyCategory(academy?.category)) notFound();

  const accentColor = getAcademyAccentColor(academy?.category);
  const firstLesson = course.modules[0]?.lessons[0];
  const assessment = course.assessments[0];
  const practice = course.vrPractices[0];
  const stats = getCourseStats(course);
  const courseImage = getAcademyCourseImage(academy?.category ?? "upskilling");
  const moreCourses = academy
    ? getCourseSummariesByAcademy(academy.slug).filter((item) => item.slug !== course.slug).slice(0, 3)
    : [];
  const courseFeatures = [
    { Icon: Smartphone, text: "Mobile and PWA access" },
    { Icon: Download, text: "Offline lesson content" },
    { Icon: BadgeCheck, text: "Certificate on completion" },
    { Icon: Award, text: `${course.rewards} VowRewards points` },
    ...(stats.hasVRPractice ? [{ Icon: Glasses, text: "VR practice included" }] : []),
    { Icon: BookOpenCheck, text: `${stats.lessonCount} structured lessons` },
  ];

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <Breadcrumb
              tone="dark"
              items={[
                { label: "Academies", href: "/academies" },
                ...(academy ? [{ label: academy.name, href: getAcademyHref(academy) }] : []),
                { label: course.title },
              ]}
            />

            {academy ? (
              <span className="mt-4 inline-block rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                {academy.name}
              </span>
            ) : null}

            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">{course.description}</p>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><BadgeCheck aria-hidden="true" className="h-4 w-4" /> Certificate included</span>
              <span className="flex items-center gap-1.5"><Award aria-hidden="true" className="h-4 w-4" /> {course.rewards} VowRewards</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {firstLesson ? <ButtonLink href={`/lesson/${firstLesson.slug}`}>Start first lesson</ButtonLink> : null}
              {assessment ? <ButtonLink href={`/assessment/${assessment.slug}`} variant="secondary">Take assessment</ButtonLink> : null}
              {practice ? <ButtonLink href={`/vr-practice/${practice.slug}`} variant="secondary">Open VR practice</ButtonLink> : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/courses/${slug}/discussion`}
                className="flex items-center gap-2 rounded-md border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" /> Discussion
              </Link>
              <Link
                href={`/courses/${slug}/assignments`}
                className="flex items-center gap-2 rounded-md border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white"
              >
                <ClipboardCheck aria-hidden="true" className="h-4 w-4" /> Assignments
              </Link>
            </div>
          </div>

          <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
            <div className="premium-card overflow-hidden rounded-lg text-ink">
              <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
                <Image src={courseImage} alt="" fill priority sizes="360px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06111f]/65 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-[0.14em] text-white">Course preview</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Enrol now</p>
                <p className="mt-3 text-4xl font-bold text-ink">{formatCurrency(course.price)}</p>
                {course.price > 0 ? <p className="mt-1 text-xs text-muted">One-time payment through PayFast</p> : null}
                <div className="mt-5"><EnrollButton course={course} /></div>

                <div className="mt-5 space-y-2.5 text-sm">
                  {courseFeatures.map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-muted">
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Duration</p>
                  <p className="text-sm font-semibold text-ink">{course.duration}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-6">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:grid-cols-4 sm:px-6 lg:px-8">
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

      <CourseExperience course={course} academy={academy} accentColor={accentColor} />

      {moreCourses.length > 0 && academy ? (
        <Section tone="light" size="tight" eyebrow={academy.name} title={`More courses in ${academy.name}`}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moreCourses.map((item) => <CourseCard key={item.slug} course={item} />)}
          </div>
          <div className="mt-6 text-center">
            <ButtonLink href={getAcademyHref(academy)} variant="outline">View all {academy.name} courses</ButtonLink>
          </div>
        </Section>
      ) : null}

      <section className="premium-section-dark surface-grid py-14 pb-36 text-white lg:pb-14">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Ready to start {course.title}?</h2>
          <p className="max-w-xl text-white/70">
            Join a structured pathway with lessons, assessments, and practical learning. Earn a certificate plus {course.rewards} VowRewards on completion.
          </p>
          {firstLesson ? <ButtonLink href={`/lesson/${firstLesson.slug}`}>Start first lesson</ButtonLink> : null}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-14 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(6,17,31,0.12)] backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted">{course.title}</p>
            <p className="text-lg font-bold text-ink">{formatCurrency(course.price)}</p>
          </div>
          <div className="w-40 shrink-0"><EnrollButton course={course} /></div>
        </div>
      </div>
    </main>
  );
}
