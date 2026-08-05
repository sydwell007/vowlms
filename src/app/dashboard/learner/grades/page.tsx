"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useDashboardEndpoint } from "@/lib/auth/useDashboardEndpoint";
import type { DashboardMetric } from "@/types/lms";

type Attempt = {
  id: string;
  score: number;
  passed: number | boolean;
  attempted_at: string;
  assessment_title: string;
  pass_mark: number;
  course_slug: string;
  course_title: string;
};

type HistoryData = {
  attempts: Attempt[];
  summary: {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    completedCourses: number;
  };
};

const pendingMetrics: DashboardMetric[] = [
  { label: "Assessment attempts", value: "-", detail: "Loading" },
  { label: "Average score", value: "-", detail: "Loading" },
  { label: "Pass rate", value: "-", detail: "Loading" },
  { label: "Completed courses", value: "-", detail: "Loading" },
];

export default function GradesPage() {
  const { data, error, loading } = useDashboardEndpoint<HistoryData>("/api/assessments/history");

  const metrics: DashboardMetric[] = data
    ? [
        { label: "Assessment attempts", value: data.summary.totalAttempts.toLocaleString(), detail: "All attempts, any score" },
        { label: "Average score", value: `${data.summary.averageScore}%`, detail: "Across all attempts" },
        { label: "Pass rate", value: `${data.summary.passRate}%`, detail: "Attempts that met the pass mark" },
        { label: "Completed courses", value: data.summary.completedCourses.toLocaleString(), detail: "Certificates issued" },
      ]
    : pendingMetrics;

  return (
    <DashboardShell
      role="learner"
      title="Grades & results"
      description="Every assessment attempt recorded to your account, most recent first."
      metrics={metrics}
    >
      {error ? <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div> : null}

      {loading ? (
        <div className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
      ) : data && data.attempts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              <tr>
                <th className="px-5 py-3">Assessment</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Result</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.attempts.map((attempt) => {
                const passed = Number(attempt.passed) === 1;
                return (
                  <tr key={attempt.id}>
                    <td className="px-5 py-4 font-medium text-ink">{attempt.assessment_title}</td>
                    <td className="px-5 py-4">
                      <Link href={`/courses/${attempt.course_slug}`} className="text-[#1166c8] hover:underline">
                        {attempt.course_title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-ink">{attempt.score}% <span className="text-muted">(pass {attempt.pass_mark}%)</span></td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${passed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {passed ? "Passed" : "Not yet"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(attempt.attempted_at))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-ink">No assessment attempts yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">
            Complete a course lesson and take its assessment to see your results here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/courses" variant="ink">Browse courses</ButtonLink>
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
