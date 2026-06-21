"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { getCourses, getAcademies } from "@/lib/data";

const ALL_COURSES = getCourses();
const ALL_ACADEMIES = getAcademies();
const PAGE_SIZE = 24;

const LEVEL_OPTS = ["All levels", "Foundation", "Intermediate", "Advanced"] as const;
const PRICE_OPTS = ["All", "Free", "Paid"] as const;

export default function CoursesPage() {
  const [academy, setAcademy] = useState("all");
  const [level, setLevel] = useState<string>("All levels");
  const [price, setPrice] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = ALL_COURSES;
    if (academy !== "all") list = list.filter((c) => c.academySlug === academy);
    if (level !== "All levels") list = list.filter((c) => c.level === level);
    if (price === "Free") list = list.filter((c) => c.price === 0);
    if (price === "Paid") list = list.filter((c) => c.price > 0);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [academy, level, price, query]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function reset() {
    setAcademy("all");
    setLevel("All levels");
    setPrice("All");
    setQuery("");
    setPage(1);
  }

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-14 text-white md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Academy Network</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
            {ALL_COURSES.length.toLocaleString()} courses across 6 academies
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Browse upskilling, skills training, culinary, school, business, and university pathways — each with assessments, certificates, and VowRewards.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex max-w-xl items-center gap-2 rounded-xl border border-white/18 bg-white/8 px-4 py-3 backdrop-blur-md">
            <svg className="h-4 w-4 shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search courses by title or topic…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(""); setPage(1); }} className="text-white/40 hover:text-white text-xs">✕</button>
            )}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Academy tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setAcademy("all"); setPage(1); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${academy === "all" ? "bg-[#06111f] text-white" : "premium-card-soft text-ink hover:border-[#1166c8]/30"}`}
          >
            All academies ({ALL_COURSES.length})
          </button>
          {ALL_ACADEMIES.map((a) => {
            const count = ALL_COURSES.filter((c) => c.academySlug === a.slug).length;
            return (
              <button
                key={a.slug}
                onClick={() => { setAcademy(a.slug); setPage(1); }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${academy === a.slug ? "bg-[#06111f] text-white" : "premium-card-soft text-ink hover:border-[#1166c8]/30"}`}
              >
                {a.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Level */}
          <div className="flex items-center gap-1">
            {LEVEL_OPTS.map((l) => (
              <button
                key={l}
                onClick={() => { setLevel(l); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${level === l ? "bg-[#1166c8] text-white" : "premium-card-soft text-muted hover:text-ink"}`}
              >
                {l}
              </button>
            ))}
          </div>

          <span className="h-4 border-r border-slate-200" />

          {/* Price */}
          <div className="flex items-center gap-1">
            {PRICE_OPTS.map((p) => (
              <button
                key={p}
                onClick={() => { setPrice(p); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${price === p ? "bg-gold/90 text-[#06111f]" : "premium-card-soft text-muted hover:text-ink"}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Reset */}
          {(academy !== "all" || level !== "All levels" || price !== "All" || query) && (
            <button
              onClick={reset}
              className="ml-auto text-xs font-semibold text-[#1166c8] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-ink">{paginated.length}</span> of{" "}
            <span className="font-semibold text-ink">{filtered.length}</span> courses
            {query ? ` matching "${query}"` : ""}
          </p>
          {filtered.length === 0 && (
            <button onClick={reset} className="text-xs font-semibold text-[#1166c8] hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="text-5xl">🔍</div>
            <h2 className="text-xl font-semibold text-ink">No courses found</h2>
            <p className="text-sm text-muted max-w-sm">Try a different keyword or adjust your filters.</p>
            <button onClick={reset} className="mt-2 rounded-xl bg-[#06111f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0d2239] transition">
              Browse all courses
            </button>
          </div>
        )}

        {/* Course grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {paginated.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50 hover:border-[#1166c8]/30"
            >
              Load more courses ({filtered.length - paginated.length} remaining)
            </button>
            <p className="text-xs text-muted">Showing {paginated.length} of {filtered.length}</p>
          </div>
        )}

        {/* Browse academies CTA */}
        {!hasMore && filtered.length > 0 && (
          <div className="mt-12 rounded-2xl border border-slate-100 bg-gradient-to-r from-[#f8fbfe] to-[#eef4fb] px-8 py-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">All courses loaded</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Looking for something specific?</h2>
            <p className="mt-2 text-sm text-muted">Browse by academy to see focused pathways, or use the search bar above.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {ALL_ACADEMIES.map((a) => (
                <Link
                  key={a.slug}
                  href={`/academies/${a.category}`}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:border-[#1166c8]/40 hover:text-[#1166c8]"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
