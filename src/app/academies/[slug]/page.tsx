import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImagePanel } from "@/components/ui/ImagePanel";
import {
  getAcademies,
  getAcademyBySlug,
  getCourseSummariesByAcademy,
  getCourses,
  getCoursesByAcademy,
} from "@/lib/data";
import { AcademyCourseGrid } from "@/components/academies/AcademyCourseGrid";
import { getCourseStats } from "@/lib/course-content";
import { visualAssets } from "@/lib/visual-assets";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { getServerRole } from "@/lib/auth/getServerRole";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const academy = getAcademyBySlug(slug);
  const role = await getServerRole();
  if (!academy || isHiddenAcademyCategory(academy.category, role)) {
    return { title: "Academy", robots: { index: false, follow: false } };
  }
  // Never index admin-only preview content, even when the viewer is admin.
  if (isHiddenAcademyCategory(academy.category, null)) {
    return { title: academy.name, robots: { index: false, follow: false } };
  }

  const canonicalPath = `/academies/${academy.category}`;
  return {
    title: academy.name,
    description: academy.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${academy.name} | VowLMS`,
      description: academy.description,
      url: canonicalPath,
      images: [{ url: visualAssets.academyNetwork, alt: `${academy.name} course network` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${academy.name} | VowLMS`,
      description: academy.description,
      images: [visualAssets.academyNetwork],
    },
  };
}

export default async function AcademyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const academy = getAcademyBySlug(slug);
  const role = await getServerRole();

  if (!academy || isHiddenAcademyCategory(academy.category, role)) {
    notFound();
  }

  const isAdminPreview = role === "admin" && isHiddenAcademyCategory(academy.category, null);
  const courses = getCoursesByAcademy(academy.slug, role);
  const courseSummaries = getCourseSummariesByAcademy(academy.slug, role);
  const allCourses = getCourses(role);

  const accentColor = getAcademyAccentColor(academy.category);
  const canonicalPath = `/academies/${academy.category}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Academies", item: `${siteConfig.url}/academies` },
      { "@type": "ListItem", position: 2, name: academy.name, item: `${siteConfig.url}${canonicalPath}` },
    ],
  };

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      {isAdminPreview ? (
        <div role="status" className="border-b border-amber-200 bg-amber-50 px-5 py-2.5 text-center text-sm font-medium text-amber-900">
          Admin preview — {academy.name} is not visible to learners yet.
        </div>
      ) : null}
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <Breadcrumb tone="dark" items={[{ label: "Academies", href: "/academies" }, { label: academy.name }]} />
          <div className="mt-4 flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ backgroundColor: `${accentColor}28`, color: accentColor }}
            >
              {academy.category.replaceAll("-", " ")}
            </span>
            <span className="text-xs text-white/50">{courses.length} courses</span>
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">{academy.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">{academy.heroMessage}</p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/64">{academy.description}</p>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-2xl font-semibold text-gold">{courses.length}</span>
              <span className="ml-2 text-white/60">courses</span>
            </div>
            <div>
              <span className="text-2xl font-semibold text-electric">
                {courses.reduce((sum, c) => sum + getCourseStats(c).lessonCount, 0).toLocaleString()}
              </span>
              <span className="ml-2 text-white/60">lessons</span>
            </div>
            <div>
              <span className="text-2xl font-semibold" style={{ color: accentColor }}>
                {courses.filter((c) => c.price === 0).length}
              </span>
              <span className="ml-2 text-white/60">free courses</span>
            </div>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.academyNetwork}
            alt={`${academy.name} in the GoalVow academy network`}
            priority
            aspect="video"
          />
        </div>
      </section>

      {/* Paginated course grid — client component */}
      <Section tone="light" title={`${academy.name} courses`} description={`Audience: ${academy.audience}`}>
        <AcademyCourseGrid courses={courseSummaries} role={role} />
      </Section>

      {/* Other academies */}
      <section className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-4">Other GoalVow academies</p>
          <div className="flex flex-wrap gap-3">
            {getAcademies(role)
              .filter((a) => a.slug !== academy.slug)
              .map((a) => {
                const count = allCourses.filter((c) => c.academySlug === a.slug).length;
                return (
                  <Link
                    key={a.slug}
                    href={`/academies/${a.category}`}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-[#1166c8]/40 hover:text-[#1166c8]"
                  >
                    {a.name}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-muted">{count}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
