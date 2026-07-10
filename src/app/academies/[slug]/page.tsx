import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { getAcademyBySlug, getCoursesByAcademy, getCourses } from "@/lib/data";
import { AcademyCourseGrid } from "@/components/academies/AcademyCourseGrid";
import { visualAssets } from "@/lib/visual-assets";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const academy = getAcademyBySlug(slug);
  return { title: academy?.name ?? "Academy" };
}

export default async function AcademyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const academy = getAcademyBySlug(slug);

  if (!academy) {
    notFound();
  }

  const courses = getCoursesByAcademy(academy.slug);
  const allCourses = getCourses();

  const CATEGORY_COLOR: Record<string, string> = {
    "upskilling": "#1166c8",
    "skills-training": "#19c37d",
    "chef-academy": "#ff7a59",
    "private-school": "#9b59b6",
    "sports-academy": "#f97316",
    "business-school": "#f5c542",
    "university-online": "#20c7ff",
  };

  const accentColor = CATEGORY_COLOR[academy.category] ?? "#1166c8";

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <div className="flex items-center gap-3">
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
                {courses.reduce((sum, c) => sum + c.modules.reduce((ms, m) => ms + m.lessons.length, 0), 0).toLocaleString()}
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
        <AcademyCourseGrid courses={courses} />
      </Section>

      {/* Other academies */}
      <section className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-4">Other GoalVow academies</p>
          <div className="flex flex-wrap gap-3">
            {["upskilling-academy", "skills-training-academy", "chef-academy", "private-school", "sports-academy", "business-school", "university-online"]
              .filter((s) => s !== academy.slug)
              .map((s) => {
                const a = getAcademyBySlug(s);
                if (!a) return null;
                const count = allCourses.filter((c) => c.academySlug === a.slug).length;
                return (
                  <Link
                    key={s}
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
