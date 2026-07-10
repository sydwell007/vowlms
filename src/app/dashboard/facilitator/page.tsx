"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useDashboardEndpoint } from "@/lib/auth/useDashboardEndpoint";
import type { DashboardMetric } from "@/types/lms";

type FacilitatorCourse = {
  id: string;
  slug: string;
  title: string;
  level: string;
  academy_name: string;
  total_enrolments: number | string;
  avg_progress: number | string | null;
};

type FacilitatorData = {
  facilitator: string;
  metrics: Array<{ label: string; value: string; detail?: string }>;
  courses: FacilitatorCourse[];
  recentAttempts: unknown[];
};

const pendingMetrics: DashboardMetric[] = [
  { label: "My courses", value: "-", detail: "Loading" },
  { label: "Total learners", value: "-", detail: "Loading" },
  { label: "Total enrolments", value: "-", detail: "Loading" },
  { label: "Completions", value: "-", detail: "Loading" },
];

export default function FacilitatorDashboardPage() {
  const { data, error, loading } = useDashboardEndpoint<FacilitatorData>("/api/dashboard/facilitator");
  const metrics: DashboardMetric[] = data?.metrics.map((item) => ({ ...item, detail: item.detail ?? "Verified course data" })) ?? pendingMetrics;

  return (
    <DashboardShell
      role="facilitator"
      title={data?.facilitator ? `${data.facilitator}'s studio` : "Facilitator studio"}
      description="Review assigned courses, enrolments, learner progress, and assessment activity within your authorised scope."
      metrics={metrics}
    >
      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div> : null}
      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-ink">Assigned courses</h2>
        <Link href="/support" className="text-sm font-semibold text-[#1166c8] hover:underline">Escalate support</Link>
      </div>
      {loading ? (
        <div className="mt-4 h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
      ) : data?.courses.length ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {data.courses.map((course) => (
            <article key={course.id} className="rounded-lg border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">{course.academy_name}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{course.title}</h3>
              <p className="mt-2 text-sm text-muted">{course.level} | {course.total_enrolments} enrolments</p>
              <div className="mt-5"><ProgressBar value={Number(course.avg_progress) || 0} /></div>
              <Link href={`/courses/${course.slug}`} className="mt-5 inline-block text-sm font-semibold text-[#1166c8] hover:underline">Open course</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-muted">No courses are assigned to this facilitator account.</div>
      )}
    </DashboardShell>
  );
}
