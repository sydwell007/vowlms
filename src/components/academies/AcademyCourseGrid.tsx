"use client";

import { useState, useMemo } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import type { Course } from "@/types/lms";

const PAGE_SIZE = 12;
const LEVEL_OPTS = ["All levels", "Foundation", "Intermediate", "Advanced"] as const;
const PRICE_OPTS = ["All", "Free", "Paid"] as const;

export function AcademyCourseGrid({ courses }: { courses: Course[] }) {
  const [level, setLevel] = useState<string>("All levels");
  const [price, setPrice] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = courses;
    if (level !== "All levels") list = list.filter((c) => c.level === level);
    if (price === "Free") list = list.filter((c) => c.price === 0);
    if (price === "Paid") list = list.filter((c) => c.price > 0);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return list;
  }, [courses, level, price, query]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 max-w-sm w-full">
          <svg className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search in this academy…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent text-sm text-ink placeholder-muted outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); setPage(1); }} className="text-muted hover:text-ink text-xs">✕</button>
          )}
        </div>

        {/* Level + price */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {LEVEL_OPTS.map((l) => (
              <button key={l} onClick={() => { setLevel(l); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${level === l ? "bg-[#1166c8] text-white" : "premium-card-soft text-muted hover:text-ink"}`}>
                {l}
              </button>
            ))}
          </div>
          <span className="h-4 border-r border-slate-200" />
          <div className="flex gap-1">
            {PRICE_OPTS.map((p) => (
              <button key={p} onClick={() => { setPrice(p); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${price === p ? "bg-gold/90 text-[#06111f]" : "premium-card-soft text-muted hover:text-ink"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-5 text-sm text-muted">
        Showing <span className="font-semibold text-ink">{paginated.length}</span> of <span className="font-semibold text-ink">{filtered.length}</span> courses
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-semibold text-ink">No courses found</h3>
          <p className="text-sm text-muted">Try a different keyword or adjust your filters.</p>
          <button
            onClick={() => { setLevel("All levels"); setPrice("All"); setQuery(""); setPage(1); }}
            className="mt-2 rounded-xl bg-[#06111f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0d2239] transition"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paginated.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50 hover:border-[#1166c8]/30"
          >
            Load more ({filtered.length - paginated.length} remaining)
          </button>
          <p className="text-xs text-muted">Showing {paginated.length} of {filtered.length}</p>
        </div>
      )}
    </div>
  );
}
