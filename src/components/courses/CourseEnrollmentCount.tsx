"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

type EnrollmentCounts = Record<string, number>;

let cachedCounts: EnrollmentCounts | null = null;
let countsRequest: Promise<EnrollmentCounts> | null = null;

async function getEnrollmentCounts() {
  if (cachedCounts) return cachedCounts;
  if (!countsRequest) {
    countsRequest = fetch("/api/courses/enrollment-counts", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Enrolment totals could not be loaded.");
        cachedCounts = payload.data as EnrollmentCounts;
        return cachedCounts;
      })
      .catch((error) => {
        countsRequest = null;
        throw error;
      });
  }
  return countsRequest;
}

export function CourseEnrollmentCount({ courseSlug }: { courseSlug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getEnrollmentCounts()
      .then((counts) => {
        if (active) setCount(counts[courseSlug] ?? 0);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [courseSlug]);

  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
      <Users aria-hidden="true" className="h-4 w-4" />
      {count === null ? "Enrolled learners" : `${count.toLocaleString()} Enrolled`}
    </span>
  );
}
