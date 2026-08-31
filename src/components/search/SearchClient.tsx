"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Academy, CourseSummary } from "@/types/lms";

const RESULT_LIMIT = 20;
const popularSearches = [
  "career readiness",
  "solar installation",
  "chef foundations",
  "business launchpad",
  "VR practice",
  "digital workplace",
];

type SearchClientProps = {
  academies: Academy[];
  courses: CourseSummary[];
  initialQuery: string;
};

export function SearchClient({ academies, courses, initialQuery }: SearchClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<"all" | "courses" | "academies">("all");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return { academies: [], courses: [] };

    return {
      courses: courses.filter((course) =>
        `${course.title} ${course.description} ${course.level} ${course.academyName}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
      academies: academies.filter((academy) =>
        `${academy.name} ${academy.description} ${academy.audience}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    };
  }, [academies, courses, query]);

  const totalResults = results.courses.length + results.academies.length;
  const visibleCourses = results.courses.slice(0, RESULT_LIMIT);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const normalizedQuery = query.trim();
      if (normalizedQuery) params.set("q", normalizedQuery);
      else params.delete("q");

      const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
      if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pathname, query, router]);

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-semibold text-ink">Search VowLMS</h1>

        <form action="/search" method="get" role="search" className="mb-6">
          <label className="premium-card relative flex items-center gap-3 rounded-xl px-4 py-3.5">
            <span className="text-sm font-semibold text-muted" aria-hidden="true">Search</span>
            <span className="sr-only">Search courses and academies</span>
            <input
              name="q"
              type="search"
              autoFocus
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Course, academy, or skill"
              aria-controls="search-results"
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="min-h-10 px-2 text-xs font-semibold text-muted hover:text-ink"
              >
                Clear
              </button>
            ) : null}
          </label>
        </form>

        {!query.trim() ? (
          <>
            <p className="mb-3 text-sm font-semibold text-muted">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-[#1166c8]/40 hover:text-[#1166c8]"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Link href="/academies" className="premium-card rounded-xl p-5 transition hover:border-[#1166c8]/20">
                <p className="text-lg font-semibold text-ink">Browse academies</p>
                <p className="mt-1 text-sm text-muted">Explore the GoalVow academy network</p>
              </Link>
              <Link href="/courses" className="premium-card rounded-xl p-5 transition hover:border-[#1166c8]/20">
                <p className="text-lg font-semibold text-ink">All courses</p>
                <p className="mt-1 text-sm text-muted">Open the complete course catalogue</p>
              </Link>
            </div>
          </>
        ) : (
          <div id="search-results">
            <p role="status" aria-live="polite" className="sr-only">
              {totalResults} {totalResults === 1 ? "result" : "results"} found
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-4" role="tablist" aria-label="Search result types">
              {[
                { key: "all" as const, label: `All (${totalResults})` },
                { key: "courses" as const, label: `Courses (${results.courses.length})` },
                { key: "academies" as const, label: `Academies (${results.academies.length})` },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.key}
                  onClick={() => setTab(item.key)}
                  className={`border-b-2 pb-2 text-sm font-semibold transition ${
                    tab === item.key
                      ? "border-[#1166c8] text-[#1166c8]"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {totalResults === 0 ? (
              <div className="premium-card rounded-xl px-6 py-14 text-center">
                <h2 className="text-lg font-semibold text-ink">No results for &ldquo;{query}&rdquo;</h2>
                <p className="mt-2 text-sm text-muted">Try a broader term or browse the course catalogue.</p>
              </div>
            ) : null}

            {(tab === "all" || tab === "courses") && visibleCourses.length > 0 ? (
              <section className="mb-8">
                {tab === "all" ? (
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Courses</h2>
                ) : null}
                <div className="space-y-3">
                  {visibleCourses.map((course) => (
                    <Link
                      key={course.slug}
                      href={`/courses/${course.slug}`}
                      className="premium-card flex items-start gap-4 rounded-xl p-5 transition hover:border-[#1166c8]/20"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1166c8]/10 text-sm font-bold text-[#1166c8]"
                      >
                        C
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-semibold text-ink">{course.title}</span>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {course.price === 0 ? "Free" : `R${course.price}`}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs font-medium text-[#1166c8]">{course.academyName}</span>
                        <span className="mt-1 block truncate text-xs text-muted">{course.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                {results.courses.length > RESULT_LIMIT ? (
                  <Link
                    href={`/courses?q=${encodeURIComponent(query)}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[#1166c8] hover:underline"
                  >
                    View all {results.courses.length} matching courses
                  </Link>
                ) : null}
              </section>
            ) : null}

            {(tab === "all" || tab === "academies") && results.academies.length > 0 ? (
              <section>
                {tab === "all" ? (
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Academies</h2>
                ) : null}
                <div className="space-y-3">
                  {results.academies.map((academy) => (
                    <Link
                      key={academy.slug}
                      href={`/academies/${academy.category}`}
                      className="premium-card flex items-start gap-4 rounded-xl p-5 transition hover:border-[#1166c8]/20"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-sm font-bold text-[#7a5600]"
                      >
                        A
                      </span>
                      <span>
                        <span className="font-semibold text-ink">{academy.name}</span>
                        <span className="mt-1 block text-xs text-muted">{academy.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
