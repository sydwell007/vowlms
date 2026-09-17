"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/types/lms";
import { formatCurrency } from "@/lib/format";
import { EnrollButton } from "@/components/courses/EnrollButton";

type Props = {
  course: Course;
  enrolCardId: string;
};

export function MobileCourseStickyAction({ course, enrolCardId }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const enrolCard = document.getElementById(enrolCardId);
    if (!enrolCard) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(enrolCard);
    return () => observer.disconnect();
  }, [enrolCardId]);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 bottom-14 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(6,17,31,0.12)] backdrop-blur-lg transition duration-200 lg:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted">{course.title}</p>
          <p className="text-lg font-bold text-ink">{formatCurrency(course.price)}</p>
        </div>
        <div className="w-40 shrink-0"><EnrollButton course={course} /></div>
      </div>
    </div>
  );
}
