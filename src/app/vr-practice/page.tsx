import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { getCourses } from "@/lib/data";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "VR Practice",
  description: "Build confidence through guided GoalVow workplace simulations.",
};

const PAGE_SIZE = 18;

type VRPracticeIndexPageProps = {
  searchParams: Promise<{
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

export default async function VRPracticeIndexPage({ searchParams }: VRPracticeIndexPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const practices = getCourses().flatMap((course) =>
    course.vrPractices.map((practice) => ({
      courseSlug: course.slug,
      courseTitle: course.title,
      ...practice,
    })),
  );

  const filteredPractices = normalizedQuery
    ? practices.filter((practice) =>
        `${practice.title} ${practice.courseTitle} ${practice.scenario} ${practice.skillsPracticed.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : practices;

  const totalPages = Math.max(1, Math.ceil(filteredPractices.length / PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
    totalPages,
  );
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visiblePractices = filteredPractices.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = visiblePageNumbers(currentPage, totalPages);

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">VR Practice</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
              Practice skills before the real-world moment
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
              Guided simulations help learners build confidence, capture evidence, and prepare for workplace scenarios.
            </p>
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
        eyebrow="Scenario library"
        title="Choose a practical learning scenario"
        description={`${filteredPractices.length.toLocaleString()} guided simulations available across the academy network.`}
      >
        <form action="/vr-practice" method="get" className="mb-8 flex max-w-2xl gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search VR practice scenarios</span>
            <input
              type="search"
              name="q"
              defaultValue={query}
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
          {query ? (
            <Link
              href="/vr-practice"
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#1166c8]"
            >
              Clear
            </Link>
          ) : null}
        </form>

        {visiblePractices.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePractices.map((practice) => (
              <article
                key={`${practice.courseSlug}:${practice.slug}`}
                className="premium-card flex h-full flex-col rounded-xl p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">
                  {practice.courseTitle}
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-snug">{practice.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">{practice.scenario}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {practice.skillsPracticed.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]"
                    >
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
