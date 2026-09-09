"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseSummary, Role } from "@/types/lms";

const COURSE_BATCH_SIZE = 6;

type Props = {
  courses: CourseSummary[];
  role: Role | null;
};

export function FeaturedCourseGrid({ courses, role }: Props) {
  const [visibleCount, setVisibleCount] = useState(COURSE_BATCH_SIZE);
  const visibleCourses = courses.slice(0, visibleCount);
  const hasMoreCourses = visibleCourses.length < courses.length;

  function showMoreCourses() {
    setVisibleCount((current) => Math.min(current + COURSE_BATCH_SIZE, courses.length));
  }

  return (
    <div>
      <div id="featured-course-grid" data-testid="featured-course-grid" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleCourses.map((course, index) => (
          <CourseCard key={course.slug} course={course} priority={index === 0} role={role} />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visibleCourses.length} of {courses.length} courses.
      </p>

      {hasMoreCourses ? (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            aria-controls="featured-course-grid"
            onClick={showMoreCourses}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-ink shadow-sm transition hover:border-[#1765a6] hover:bg-[#f3f8fb] hover:text-[#1765a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1765a6]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Explore more courses
          </button>
        </div>
      ) : null}
    </div>
  );
}
