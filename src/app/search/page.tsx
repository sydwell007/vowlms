"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getCourses, getAcademies } from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "courses" | "academies">("all");

  const courses = getCourses();
  const academies = getAcademies();

  const results = useMemo(() => {
    if (!query.trim()) return { courses: [], academies: [] };
    const q = query.toLowerCase();

    const matchedCourses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.level.toLowerCase().includes(q) ||
        c.academySlug.includes(q)
    );

    const matchedAcademies = academies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.audience.toLowerCase().includes(q)
    );

    return { courses: matchedCourses, academies: matchedAcademies };
  }, [query, courses, academies]);

  const totalResults = results.courses.length + results.academies.length;

  const popularSearches = [
    "career readiness", "solar installation", "chef foundations",
    "business launchpad", "VR practice", "digital workplace",
  ];

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-ink mb-6">Search VowLMS</h1>

        {/* Search input */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, academies, lessons…"
            className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-6 text-base text-ink placeholder:text-muted shadow-sm focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink">✕</button>
          )}
        </div>

        {!query ? (
          <div>
            <p className="text-sm font-semibold text-muted mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s) => (
                <button key={s} onClick={() => setQuery(s)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-ink transition hover:border-[#1166c8]/40 hover:text-[#1166c8]">
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Link href="/academies" className="premium-card rounded-xl p-5 transition hover:border-[#1166c8]/20">
                <p className="text-lg font-semibold text-ink">Browse academies</p>
                <p className="mt-1 text-sm text-muted">Explore all 6 GoalVow academies</p>
              </Link>
              <Link href="/courses" className="premium-card rounded-xl p-5 transition hover:border-[#1166c8]/20">
                <p className="text-lg font-semibold text-ink">All courses</p>
                <p className="mt-1 text-sm text-muted">View the full course catalogue</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Results tabs */}
            <div className="flex items-center gap-4 mb-5">
              {[
                { key: "all", label: `All (${totalResults})` },
                { key: "courses", label: `Courses (${results.courses.length})` },
                { key: "academies", label: `Academies (${results.academies.length})` },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key as typeof tab)}
                  className={`text-sm font-semibold pb-2 border-b-2 transition ${tab === key ? "border-[#1166c8] text-[#1166c8]" : "border-transparent text-muted hover:text-ink"}`}>
                  {label}
                </button>
              ))}
            </div>

            {totalResults === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-semibold text-ink">No results for &ldquo;{query}&rdquo;</p>
                <p className="mt-2 text-sm text-muted">Try a different search term or browse the academy catalogue.</p>
              </div>
            )}

            {/* Courses */}
            {(tab === "all" || tab === "courses") && results.courses.length > 0 && (
              <div className="mb-6">
                {tab === "all" && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-3">Courses</p>}
                <div className="space-y-3">
                  {results.courses.map((course) => (
                    <Link key={course.slug} href={`/courses/${course.slug}`}
                      className="premium-card flex items-start gap-4 rounded-xl p-5 transition hover:border-[#1166c8]/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1166c8]/10 text-lg">
                        📚
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-ink">{course.title}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${course.price === 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                            {course.price === 0 ? "Free" : `R${course.price}`}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted truncate">{course.description}</p>
                        <div className="mt-2 flex gap-3">
                          <span className="text-xs text-muted">{course.level}</span>
                          <span className="text-xs text-muted">·</span>
                          <span className="text-xs text-muted">{course.duration}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Academies */}
            {(tab === "all" || tab === "academies") && results.academies.length > 0 && (
              <div>
                {tab === "all" && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-3">Academies</p>}
                <div className="space-y-3">
                  {results.academies.map((academy) => (
                    <Link key={academy.slug} href={`/academies/${academy.category}`}
                      className="premium-card flex items-start gap-4 rounded-xl p-5 transition hover:border-[#1166c8]/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-lg">
                        🎓
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{academy.name}</p>
                        <p className="mt-0.5 text-xs text-muted">{academy.description}</p>
                        <p className="mt-1.5 text-xs text-[#1166c8] font-medium">{academy.audience}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
