"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseSummary, Role } from "@/types/lms";

const PAGE_SIZE = 12;
const LEVEL_OPTS = ["All levels", "Foundation", "Intermediate", "Advanced"] as const;
const PRICE_OPTS = ["All", "Free", "Paid"] as const;

export function AcademyCourseGrid({ courses, role = null }: { courses: CourseSummary[]; role?: Role | null }) {
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
        <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
          <input
            aria-label="Search courses in this academy"
            name="academyCourseSearch"
            type="search"
            placeholder="Search in this academy…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent text-sm text-ink placeholder-muted outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear academy course search"
              onClick={() => { setQuery(""); setPage(1); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-slate-100 hover:text-ink"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Level + price */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {LEVEL_OPTS.map((l) => (
              <button key={l} type="button" aria-pressed={level === l} onClick={() => { setLevel(l); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${level === l ? "bg-[#1166c8] text-white" : "premium-card-soft text-muted hover:text-ink"}`}>
                {l}
              </button>
            ))}
          </div>
          <span className="h-4 border-r border-slate-200" />
          <div className="flex gap-1">
            {PRICE_OPTS.map((p) => (
              <button key={p} type="button" aria-pressed={price === p} onClick={() => { setPrice(p); setPage(1); }}
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
            type="button"
            onClick={() => { setLevel("All levels"); setPrice("All"); setQuery(""); setPage(1); }}
            className="mt-2 rounded-lg bg-[#06111f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0d2239] transition"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paginated.map((course) => (
          <CourseCard key={course.slug} course={course} role={role} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 bg-white px-10 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50 hover:border-[#1166c8]/30"
          >
            Load more ({filtered.length - paginated.length} remaining)
          </button>
          <p className="text-xs text-muted">Showing {paginated.length} of {filtered.length}</p>
        </div>
      )}
    </div>
  );
}
