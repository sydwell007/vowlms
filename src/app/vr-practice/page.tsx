import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCoursesByAcademy, getCourses, isCourseVisible } from "@/lib/data";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { getServerRole } from "@/lib/auth/getServerRole";
import { visualAssets } from "@/lib/visual-assets";
import type { Course } from "@/types/lms";

export const metadata = {
  title: "VR Practice",
  description: "Build confidence through guided GoalVow workplace simulations.",
  alternates: { canonical: "/vr-practice" },
};

const PAGE_SIZE = 18;

type VRPracticeIndexPageProps = {
  searchParams: Promise<{
    academy?: string;
    course?: string;
    page?: string;
    q?: string;
  }>;
};

function pageHref(page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `/vr-practice?${suffix}` : "/vr-practice";
}

function visiblePageNumbers(currentPage: number, totalPages: number) {
  const candidates = new Set([
    1,
    totalPages,
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ]);

  return [...candidates].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

function SearchBar({ defaultValue }: { defaultValue: string }) {
  return (
    <form action="/vr-practice" method="get" className="flex max-w-2xl gap-2">
      <label className="min-w-0 flex-1">
        <span className="sr-only">Search VR practice scenarios</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search scenario, course, or skill"
          className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-ink outline-none focus:border-[#1166c8] focus:ring-2 focus:ring-[#1166c8]/15"
        />
      </label>
      <button
        type="submit"
        className="min-h-11 rounded-lg bg-[#06111f] px-5 text-sm font-semibold text-white transition hover:bg-[#0d2239]"
      >
        Search
      </button>
      {defaultValue ? (
        <Link
          href="/vr-practice"
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#1166c8]"
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}

export default async function VRPracticeIndexPage({ searchParams }: VRPracticeIndexPageProps) {
  const params = await searchParams;
  const role = await getServerRole();
  const query = params.q?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();

  // ─── Search mode: flat results across every scenario this viewer can reach ───
  if (query) {
    const requestedPage = Number.parseInt(params.page ?? "1", 10);
    const practices = getCourses(role).flatMap((course) =>
      course.vrPractices.map((practice) => ({
        courseSlug: course.slug,
        courseTitle: course.title,
        ...practice,
      })),
    );
    const filteredPractices = practices.filter((practice) =>
      `${practice.title} ${practice.courseTitle} ${practice.scenario} ${practice.skillsPracticed.join(" ")}`
        .toLowerCase()
        .includes(normalizedQuery),
    );

    const totalPages = Math.max(1, Math.ceil(filteredPractices.length / PAGE_SIZE));
    const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages);
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const visiblePractices = filteredPractices.slice(pageStart, pageStart + PAGE_SIZE);
    const pageNumbers = visiblePageNumbers(currentPage, totalPages);

    return (
      <main>
        <section className="premium-section-dark surface-grid py-16 text-white md:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            <Breadcrumb tone="dark" items={[{ label: "VR Practice", href: "/vr-practice" }, { label: `Search: "${query}"` }]} />
            <h1 className="mt-5 text-balance text-3xl font-semibold sm:text-5xl">Search results</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              {filteredPractices.length.toLocaleString()} scenario{filteredPractices.length === 1 ? "" : "s"} match &ldquo;{query}&rdquo;.
            </p>
            <div className="mt-6">
              <SearchBar defaultValue={query} />
            </div>
          </div>
        </section>

        <Section tone="light">
          {visiblePractices.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visiblePractices.map((practice) => (
                <article
                  key={`${practice.courseSlug}:${practice.slug}`}
                  className="premium-card flex h-full flex-col rounded-xl p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{practice.courseTitle}</p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug">{practice.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">{practice.scenario}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {practice.skillsPracticed.slice(0, 4).map((skill) => (
                      <span key={skill} className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <ButtonLink href={`/vr-practice/${practice.slug}`} variant="ink" className="mt-6 self-start">
                    Open scenario
                  </ButtonLink>
                </article>
              ))}
            </div>
          ) : (
            <div className="premium-card rounded-xl px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-ink">No scenarios match your search</h2>
              <p className="mt-2 text-sm text-muted">Try a broader skill or course name.</p>
              <ButtonLink href="/vr-practice" variant="ink" className="mt-5">
                Browse all scenarios
              </ButtonLink>
            </div>
          )}

          {filteredPractices.length > PAGE_SIZE ? (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="VR scenario pages">
              {currentPage > 1 ? (
                <Link
                  href={pageHref(currentPage - 1, query)}
                  className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-ink hover:border-[#1166c8]/40"
                >
                  Previous
                </Link>
              ) : null}

              {pageNumbers.map((page, index) => {
                const previousPage = pageNumbers[index - 1];
                return (
                  <span key={page} className="contents">
                    {previousPage && page - previousPage > 1 ? (
                      <span className="px-1 text-muted" aria-hidden="true">...</span>
                    ) : null}
                    <Link
                      href={pageHref(page, query)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-semibold ${
                        page === currentPage
                          ? "bg-[#1166c8] text-white"
                          : "border border-slate-200 bg-white text-ink hover:border-[#1166c8]/40"
                      }`}
                    >
                      {page}
                    </Link>
                  </span>
                );
              })}

              {currentPage < totalPages ? (
                <Link
                  href={pageHref(currentPage + 1, query)}
                  className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-ink hover:border-[#1166c8]/40"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </Section>
      </main>
    );
  }

  // ─── Browse mode: Academy → Course → Scenario drill-down ───
  const academiesWithCounts = getAcademies(role)
    .map((academy) => {
      const courses = getCoursesByAcademy(academy.slug, role).filter((c) => c.vrPractices.length > 0);
      const scenarioCount = courses.reduce((sum, c) => sum + c.vrPractices.length, 0);
      return {
        academy,
        courses,
        scenarioCount,
        isAdminPreview: role === "admin" && isHiddenAcademyCategory(academy.category, null),
      };
    })
    .filter((entry) => entry.courses.length > 0);

  const totalScenarios = academiesWithCounts.reduce((sum, entry) => sum + entry.scenarioCount, 0);
  const totalCourses = academiesWithCounts.reduce((sum, entry) => sum + entry.courses.length, 0);

  // Skip the academy picker entirely when there's only one real option — today
  // that's every learner (only Upskilling is launched); the picker reappears
  // on its own the moment a second academy unlocks.
  const selectedAcademyEntry =
    academiesWithCounts.find((entry) => entry.academy.slug === params.academy) ??
    (params.academy ? undefined : academiesWithCounts.length === 1 ? academiesWithCounts[0] : undefined);

  const heroCopy = selectedAcademyEntry
    ? null
    : {
        eyebrow: "VR Practice",
        title: "Practice skills before the real-world moment",
        description: "Guided simulations help learners build confidence, capture evidence, and prepare for workplace scenarios.",
      };

  // ─── Tier 1: choose an academy ───
  if (!selectedAcademyEntry) {
    return (
      <main>
        <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{heroCopy!.eyebrow}</p>
              <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">{heroCopy!.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">{heroCopy!.description}</p>
              <p className="mt-6 text-sm text-white/50">
                {totalScenarios.toLocaleString()} guided scenarios across {totalCourses.toLocaleString()} courses
              </p>
              <div className="mt-6">
                <SearchBar defaultValue="" />
              </div>
            </div>
            <ImagePanel
              src={visualAssets.vrPracticeLab}
              alt="VowLMS VR practice lab for immersive skills simulation"
              priority
              aspect="video"
            />
          </div>
        </section>

        <Section
          tone="light"
          eyebrow="Step 1 of 2"
          title="Choose an academy"
          description="Pick the academy you're learning in — you'll choose a course next, then a practice scenario."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {academiesWithCounts.map(({ academy, courses, scenarioCount, isAdminPreview }) => {
              const accent = getAcademyAccentColor(academy.category);
              return (
                <Link
                  key={academy.slug}
                  href={`/vr-practice?academy=${academy.slug}`}
                  className="premium-card group flex h-full flex-col rounded-xl border-t-4 p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
                  style={{ borderTopColor: accent }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${accent}18`, color: accent }}
                    >
                      <Sparkles aria-hidden="true" className="h-5 w-5" />
                    </span>
                    {isAdminPreview ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-amber-700">
                        Admin preview
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{academy.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                    {courses.length} course{courses.length === 1 ? "" : "s"} · {scenarioCount} scenario{scenarioCount === 1 ? "" : "s"}
                  </p>
                  <span className="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>
                    Browse courses
                    <ChevronRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>
      </main>
    );
  }

  const { academy, courses: coursesInAcademy, isAdminPreview: academyIsAdminPreview } = selectedAcademyEntry;
  const accent = getAcademyAccentColor(academy.category);
  const selectedCourse: Course | undefined = params.course
    ? coursesInAcademy.find((c) => c.slug === params.course)
    : undefined;

  // ─── Tier 2: choose a course within the academy ───
  if (!selectedCourse) {
    return (
      <main>
        <section className="premium-section-dark surface-grid py-14 text-white md:py-16">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            <Breadcrumb
              tone="dark"
              items={[{ label: "VR Practice", href: "/vr-practice" }, { label: academy.name }]}
            />
            {academyIsAdminPreview ? (
              <p className="mt-4 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-amber-300">
                Admin preview — not visible to learners
              </p>
            ) : null}
            <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{academy.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              Choose a course to see its guided VR practice scenarios.
            </p>
            <div className="mt-6">
              <SearchBar defaultValue="" />
            </div>
          </div>
        </section>

        <Section
          tone="light"
          eyebrow="Step 2 of 2"
          title="Choose a course"
          description={`${coursesInAcademy.length} course${coursesInAcademy.length === 1 ? "" : "s"} with guided practice scenarios.`}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {coursesInAcademy.map((course) => {
              const isCourseAdminPreview = role === "admin" && !isCourseVisible(course, null);
              return (
                <Link
                  key={course.slug}
                  href={`/vr-practice?academy=${academy.slug}&course=${course.slug}`}
                  className="premium-card group flex h-full flex-col rounded-xl border-t-4 p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
                  style={{ borderTopColor: accent }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em]" style={{ background: `${accent}18`, color: accent }}>
                      {course.level}
                    </span>
                    {isCourseAdminPreview ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-amber-700">
                        Admin preview
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold leading-snug">{course.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                    {course.vrPractices.length} practice scenario{course.vrPractices.length === 1 ? "" : "s"}
                  </p>
                  <span className="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>
                    Open scenarios
                    <ChevronRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>
      </main>
    );
  }

  // ─── Tier 3: choose a scenario within the course ───
  const isCourseAdminPreview = role === "admin" && !isCourseVisible(selectedCourse, null);

  return (
    <main>
      <section className="premium-section-dark surface-grid py-14 text-white md:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumb
            tone="dark"
            items={[
              { label: "VR Practice", href: "/vr-practice" },
              { label: academy.name, href: `/vr-practice?academy=${academy.slug}` },
              { label: selectedCourse.title },
            ]}
          />
          {isCourseAdminPreview ? (
            <p className="mt-4 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-amber-300">
              Admin preview — not visible to learners
            </p>
          ) : null}
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{selectedCourse.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
            {selectedCourse.vrPractices.length} guided practice scenario{selectedCourse.vrPractices.length === 1 ? "" : "s"} for this course.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {selectedCourse.vrPractices.map((practice) => (
            <article
              key={practice.slug}
              className="premium-card flex h-full flex-col rounded-xl p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
            >
              <h2 className="text-xl font-semibold leading-snug">{practice.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted">{practice.scenario}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {practice.skillsPracticed.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]">
                    {skill}
                  </span>
                ))}
              </div>
              <ButtonLink href={`/vr-practice/${practice.slug}`} variant="ink" className="mt-6 self-start">
                Open scenario
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
