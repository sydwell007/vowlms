"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";

type PathwayCourseSummary = {
  slug: string;
  title: string;
  level: string;
  duration: string;
  price: number;
};

type Enrollment = {
  courseSlug?: string;
  course_slug?: string;
  groupSlug?: string | null;
  status?: string;
};

export function PathwayCourseList({ courses }: { courses: PathwayCourseSummary[] }) {
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/enrollments", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const enrollments = (payload?.data ?? []) as Enrollment[];
        const active = enrollments.filter((item) => item.status !== "cancelled");
        setEnrolledSlugs(
          new Set(active.flatMap((item) => [item.courseSlug, item.course_slug, item.groupSlug].filter(Boolean) as string[])),
        );
      })
      .catch(() => setEnrolledSlugs(new Set()));

    return () => controller.abort();
  }, []);

  const startedCount = enrolledSlugs ? courses.filter((c) => enrolledSlugs.has(c.slug)).length : null;

  return (
    <div>
      {startedCount !== null ? (
        <div className="mb-5 premium-card-soft rounded-xl p-4">
          <div className="flex items-center justify-between text-sm font-semibold text-ink">
            <span>Your pathway progress</span>
            <span>{startedCount} of {courses.length} courses started</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#1166c8,#20c7ff)] transition-[width] duration-500 ease-out"
              style={{ width: `${courses.length > 0 ? Math.round((startedCount / courses.length) * 100) : 0}%` }}
            />
          </div>
        </div>
      ) : null}

      <ol className="space-y-3">
        {courses.map((course, index) => {
          const started = enrolledSlugs?.has(course.slug) ?? false;
          return (
            <li key={course.slug}>
              <Link
                href={`/courses/${course.slug}`}
                className="premium-card flex items-center gap-4 rounded-xl p-5 transition hover:border-[#1166c8]/20 hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1166c8]/10 text-sm font-bold text-[#1166c8]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-ink">{course.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                    <span>{course.level}</span>
                    <span>·</span>
                    <span>{course.duration}</span>
                    <span>·</span>
                    <span>{formatCurrency(course.price)}</span>
                  </div>
                </div>
                {started ? (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Started
                  </span>
                ) : (
                  <span className="shrink-0 text-sm font-semibold text-[#1166c8]">Open →</span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
