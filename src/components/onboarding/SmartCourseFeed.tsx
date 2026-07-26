"use client";

import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { getCoursesForRole } from "@/lib/goal-routing";
import type { RoleOption } from "@/data/goal-tiles";
import type { AcademyCategory } from "@/types/lms";

export function SmartCourseFeed({
  academyCategory,
  role,
  onStartOver,
}: {
  academyCategory: AcademyCategory;
  role: RoleOption;
  onStartOver: () => void;
}) {
  const courses = getCoursesForRole(academyCategory, role, 6);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-ink">Your path to becoming a {role.label}</h3>
      {courses.length > 0 ? (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/courses?academy=${academyCategory}`}
              className="text-sm font-semibold text-[#1166c8] hover:underline"
            >
              See all {role.label} courses →
            </Link>
            <span className="text-muted">·</span>
            <button type="button" onClick={onStartOver} className="text-sm font-semibold text-muted hover:text-ink">
              Not what you were looking for? Start over →
            </button>
          </div>
        </>
      ) : (
        <div className="premium-card mt-6 rounded-xl p-8 text-center">
          <p className="text-base font-semibold text-ink">No courses found for this role yet — check back soon.</p>
          <button type="button" onClick={onStartOver} className="mt-4 text-sm font-semibold text-[#1166c8] hover:underline">
            Start over →
          </button>
        </div>
      )}
    </div>
  );
}
