"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import {
  COURSE_ENROLLMENT_COUNTS_CHANGED,
  getCourseEnrollmentCounts,
} from "@/lib/course-enrollment-counts-client";

export function CourseEnrollmentCount({ courseSlug }: { courseSlug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const loadCount = () => {
      getCourseEnrollmentCounts()
        .then((counts) => {
          if (active) setCount(counts[courseSlug] ?? 0);
        })
        .catch(() => undefined);
    };

    const handleEnrollmentChange = (event: Event) => {
      const changedCourseSlug = (event as CustomEvent<{ courseSlug?: string }>).detail?.courseSlug;
      if (changedCourseSlug !== courseSlug) return;
      setCount(null);
      loadCount();
    };

    loadCount();
    window.addEventListener(COURSE_ENROLLMENT_COUNTS_CHANGED, handleEnrollmentChange);

    return () => {
      active = false;
      window.removeEventListener(COURSE_ENROLLMENT_COUNTS_CHANGED, handleEnrollmentChange);
    };
  }, [courseSlug]);

  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
      <Users aria-hidden="true" className="h-4 w-4" />
      {count === null ? (
        <span aria-label="Loading enrolment total" className="h-3 w-14 animate-pulse rounded-sm bg-slate-200" />
      ) : (
        `${count.toLocaleString()} enrolled`
      )}
    </span>
  );
}
