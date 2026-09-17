import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Award,
  BadgeCheck,
  CalendarClock,
  Glasses,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CourseEnrolCard } from "@/components/courses/CourseEnrolCard";
import { CourseExperience } from "@/components/courses/CourseExperience";
import { CourseRatingBadge } from "@/components/courses/CourseRatingBadge";
import { MobileCourseStickyAction } from "@/components/courses/MobileCourseStickyAction";
import { getAcademyBySlug, getAcademyHref, getCourseBySlug, isCourseVisible } from "@/lib/data";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { formatCourseDurationWeeks, getCourseStats } from "@/lib/course-content";
import { getServerRole } from "@/lib/auth/getServerRole";
import { getCourseVisual } from "@/lib/visual-assets";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course", robots: { index: false, follow: false } };

  const academy = getAcademyBySlug(course.academySlug);
  const role = await getServerRole();
  if (!isCourseVisible(course, role)) {
    return { title: "Course", robots: { index: false, follow: false } };
  }
  // Never index admin-only preview content, even when the viewer is admin.
  if (!isCourseVisible(course, null)) {
    return { title: course.title, robots: { index: false, follow: false } };
  }

  const description = course.description.length > 155
    ? `${course.description.slice(0, 152)}...`
    : course.description;

  const canonicalPath = `/courses/${course.slug}`;
  const courseVisual = getCourseVisual(course, academy?.category ?? "upskilling");
  const socialTitle = `${course.title} Course | VowLMS`;

  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url: canonicalPath,
      images: [{ url: courseVisual.src, alt: courseVisual.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [courseVisual.src],
    },
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ enrolment?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const academy = getAcademyBySlug(course.academySlug);
  const role = await getServerRole();
  if (!isCourseVisible(course, role)) notFound();
  const isAdminPreview = role === "admin" && !isCourseVisible(course, null);

  const accentColor = getAcademyAccentColor(academy?.category);
  const firstLesson = course.modules[0]?.lessons[0];
  const firstLessonHref = firstLesson ? `/lesson/${firstLesson.slug}` : undefined;
  const stats = getCourseStats(course);
  const courseVisual = getCourseVisual(course, academy?.category ?? "upskilling");
  const canonicalUrl = `${siteConfig.url}/courses/${course.slug}`;
  const academyUrl = academy ? `${siteConfig.url}${getAcademyHref(academy)}` : `${siteConfig.url}/academies`;
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: canonicalUrl,
    educationalLevel: course.level,
    teaches: course.outcomes,
    provider: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      price: course.price.toFixed(2),
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      name: course.title,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Academies", item: `${siteConfig.url}/academies` },
      ...(academy ? [{ "@type": "ListItem", position: 2, name: academy.name, item: academyUrl }] : []),
      { "@type": "ListItem", position: academy ? 3 : 2, name: course.title, item: canonicalUrl },
    ],
  };
  // Trust badges shown once, over the banner — kept out of the enrol card and the
  // quick-facts stat bar below so the same fact never appears three times on one page.
  const heroBadges = [
    { Icon: BadgeCheck, text: "Certificate included" },
    { Icon: Award, text: `${course.rewards} VOWR` },
    { Icon: CalendarClock, text: "Learn at your own pace" },
    ...(stats.hasVRPractice ? [{ Icon: Glasses, text: "VR practice included" }] : []),
  ];
  return (
    <main>
      <JsonLd data={[courseSchema, breadcrumbSchema]} />
      {isAdminPreview ? (
        <div role="status" className="border-b border-amber-200 bg-amber-50 px-5 py-2.5 text-center text-sm font-medium text-amber-900">
          Admin preview — {course.title} is not visible to learners yet.
        </div>
      ) : null}
      <section className="relative isolate text-white">
        {/* Full-bleed banner — the same image shown on the course card, now the page hero */}
        <div className="absolute inset-0 -z-10 bg-slate-900">
          <Image src={courseVisual.src} alt={courseVisual.alt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#06111f]/74 to-[#06111f]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06111f]/90 via-[#06111f]/45 to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-10 pt-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-10 lg:px-8 lg:pb-0 lg:pt-20">
          <div className="lg:pb-28 lg:pt-4">
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

            {query.enrolment === "required" ? (
              <div role="alert" className="mt-5 max-w-2xl border-l-4 border-gold bg-white/10 px-4 py-3 text-sm text-white/86">
                Enrol in this course before opening its lessons, assessments, or practice activities.
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <CourseRatingBadge courseSlug={course.slug} variant="hero" />
              {heroBadges.map(({ Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon aria-hidden="true" className="h-4 w-4 text-gold" /> {text}
                </span>
              ))}
            </div>

          </div>

          {/* Enrol card sits within the hero's own height — no fixed downward
              offset, since the card's height varies by enrolment state and a
              fixed push would make a taller state spill past the banner. */}
          <aside id="course-enrol-card" className="lg:sticky lg:top-24">
            <CourseEnrolCard
              course={course}
              accentColor={accentColor}
              adminPreview={isAdminPreview}
              previewHref={firstLessonHref}
            />
          </aside>
        </div>
      </section>

      <section className="relative border-b border-slate-100 bg-white pb-6 pt-6 lg:pt-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { label: "Modules", value: String(stats.moduleCount) },
            { label: "Lessons", value: String(stats.lessonCount) },
            { label: "Duration", value: formatCourseDurationWeeks(stats.totalMinutes) },
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

      <section className="visual-hero hero-learning py-14 pb-36 text-white lg:pb-14">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Ready to start {course.title}?</h2>
          <p className="max-w-xl text-white/70">
            Join a structured pathway with lessons, assessments, and practical learning. Earn a certificate plus {course.rewards} VowRewards on completion.
          </p>
          {firstLessonHref ? <ButtonLink href={firstLessonHref}>Start first lesson</ButtonLink> : null}
        </div>
      </section>

      <MobileCourseStickyAction course={course} enrolCardId="course-enrol-card"
        adminPreview={isAdminPreview}
        previewHref={firstLessonHref}
      />
    </main>
  );
}
