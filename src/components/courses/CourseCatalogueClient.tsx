"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";
import type { Academy, CourseSummary } from "@/types/lms";

const PAGE_SIZE = 24;
const levelOptions = ["All levels", "Foundation", "Intermediate", "Advanced"] as const;
const priceOptions = ["All", "Free", "Paid"] as const;

// Real Upskilling Academy course titles — a quick-browse shortcut into the search filter below,
// not a separate catalogue. Keeps topic discovery available without a second full page.
const POPULAR_TOPICS = [
  "Business Ethics",
  "Marketing",
  "Sales",
  "Leadership",
  "Communication",
  "Human Resources",
  "Project Management",
  "Customer Service",
  "Cybersecurity",
  "Time Management",
];

type CourseCatalogueClientProps = {
  academies: Academy[];
  courses: CourseSummary[];
  initialAcademy: string;
  initialQuery: string;
};

export function CourseCatalogueClient({
  academies,
  courses,
  initialAcademy,
  initialQuery,
}: CourseCatalogueClientProps) {
  const [academy, setAcademy] = useState(initialAcademy);
  const [level, setLevel] = useState<(typeof levelOptions)[number]>("All levels");
  const [price, setPrice] = useState<(typeof priceOptions)[number]>("All");
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const academyCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of courses) {
      counts.set(course.academySlug, (counts.get(course.academySlug) ?? 0) + 1);
    }
    return counts;
  }, [courses]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courses.filter((course) => {
      if (academy !== "all" && course.academySlug !== academy) return false;
      if (level !== "All levels" && course.level !== level) return false;
      if (price === "Free" && course.price !== 0) return false;
      if (price === "Paid" && course.price === 0) return false;
      if (
        normalizedQuery &&
        !`${course.title} ${course.description} ${course.academyName}`
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        return false;
      }
      return true;
    });
  }, [academy, courses, level, price, query]);

  const visibleCourses = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visibleCourses.length < filtered.length;
  const hasFilters =
    academy !== "all" || level !== "All levels" || price !== "All" || query.length > 0;

  function resetFilters() {
    setAcademy("all");
    setLevel("All levels");
    setPrice("All");
    setQuery("");
    setPage(1);
  }

  return (
    <main>
      <section className="premium-section-dark surface-grid py-14 text-white md:py-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              GoalVow Academy Network
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
              {courses.length.toLocaleString()} courses across the academy network
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              Find practical learning by topic, academy, level, or price.
            </p>

            <label className="mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-white/18 bg-white/8 px-4 py-3 backdrop-blur-md">
              <span aria-hidden="true" className="text-white/50">Search</span>
              <span className="sr-only">Search courses</span>
              <input
                type="search"
                placeholder="Course title, topic, or academy"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  className="text-xs font-semibold text-white/64 hover:text-white"
                >
                  Clear
                </button>
              ) : null}
            </label>

            <div className="mt-4 flex max-w-xl flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-white/50">Popular topics:</span>
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setQuery((current) => (current.trim().toLowerCase() === topic.toLowerCase() ? "" : topic));
                    setPage(1);
                  }}
                  aria-pressed={query.trim().toLowerCase() === topic.toLowerCase()}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    query.trim().toLowerCase() === topic.toLowerCase()
                      ? "border-gold bg-gold text-[#06111f]"
                      : "border-white/16 bg-white/6 text-white/68 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          <ImagePanel
            src={visualAssets.academyNetwork}
            alt="GoalVow academy network course catalogue"
            aspect="video"
            className="hidden lg:block"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="premium-card-soft grid gap-4 rounded-xl p-4 md:grid-cols-[minmax(220px,1fr)_auto_auto_auto] md:items-end">
          <label className="grid gap-1.5 text-xs font-semibold text-muted">
            Academy
            <select
              value={academy}
              onChange={(event) => {
                setAcademy(event.target.value);
                setPage(1);
              }}
              className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-ink outline-none focus:border-[#1166c8]"
            >
              <option value="all">All academies ({courses.length})</option>
              {academies.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name} ({academyCounts.get(item.slug) ?? 0})
                </option>
              ))}
            </select>
          </label>

          <fieldset className="grid gap-1.5">
            <legend className="text-xs font-semibold text-muted">Level</legend>
            <div className="flex flex-wrap gap-1">
              {levelOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={level === item}
                  onClick={() => {
                    setLevel(item);
                    setPage(1);
                  }}
                  className={`min-h-10 rounded-md px-3 text-xs font-semibold transition ${
                    level === item
                      ? "bg-[#1166c8] text-white"
                      : "border border-slate-200 bg-white text-muted hover:text-ink"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-1.5">
            <legend className="text-xs font-semibold text-muted">Price</legend>
            <div className="flex gap-1">
              {priceOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={price === item}
                  onClick={() => {
                    setPrice(item);
                    setPage(1);
                  }}
                  className={`min-h-10 rounded-md px-3 text-xs font-semibold transition ${
                    price === item
                      ? "bg-gold text-[#06111f]"
                      : "border border-slate-200 bg-white text-muted hover:text-ink"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-10 rounded-md px-3 text-sm font-semibold text-[#1166c8] hover:bg-white"
            >
              Reset
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className="mb-5 mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-muted" aria-live="polite">
            Showing <span className="font-semibold text-ink">{visibleCourses.length}</span> of{" "}
            <span className="font-semibold text-ink">{filtered.length}</span> courses
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="premium-card rounded-xl px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-ink">No courses match these filters</h2>
            <p className="mt-2 text-sm text-muted">Adjust your search or return to the full catalogue.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-[#06111f] px-6 py-3 text-sm font-semibold text-white"
            >
              Browse all courses
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {visibleCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        )}

        {hasMore ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:border-[#1166c8]/30 hover:bg-slate-50"
            >
              Load {Math.min(PAGE_SIZE, filtered.length - visibleCourses.length)} more
            </button>
          </div>
        ) : null}

        {filtered.length > 0 && !hasMore ? (
          <div className="mt-12 border-t border-slate-200 pt-8 text-center">
            <h2 className="text-xl font-semibold text-ink">Continue by academy</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {academies.map((item) => (
                <Link
                  key={item.slug}
                  href={`/academies/${item.category}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-[#1166c8]/40 hover:text-[#1166c8]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
