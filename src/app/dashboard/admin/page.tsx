"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { useDashboardEndpoint } from "@/lib/auth/useDashboardEndpoint";
import { formatCurrency } from "@/lib/data";
import type { DashboardMetric } from "@/types/lms";

type AdminData = {
  totals: {
    users: number;
    courses: number;
    enrollments: number;
    certificates: number;
    revenue: number;
  };
  roleCounts: Record<string, number>;
  recentUsers: Array<{ id: string; name: string; email: string; role: string; created_at: string }>;
  topCourses: Array<{ title: string; slug: string; enrolment_count: number | string }>;
  academyStats: Array<{ name: string; course_count: number | string; total_enrolments: number | string }>;
  mode?: string;
};

const pendingMetrics: DashboardMetric[] = [
  { label: "Users", value: "-", detail: "Loading" },
  { label: "Courses", value: "-", detail: "Loading" },
  { label: "Enrolments", value: "-", detail: "Loading" },
  { label: "Paid revenue", value: "-", detail: "Loading" },
];

const modules = [
  { title: "Users and roles", href: "/dashboard/admin/users", description: "Review account and role administration" },
  { title: "Analytics readiness", href: "/dashboard/admin/analytics", description: "Review authorised reporting sources" },
  { title: "Courses", href: "/courses", description: "Review the published course catalogue" },
  { title: "Settings", href: "/dashboard/admin/settings", description: "Review platform integration settings" },
];

export default function AdminDashboardPage() {
  const { data, error, loading } = useDashboardEndpoint<AdminData>("/api/dashboard/admin");
  const metrics: DashboardMetric[] = data
    ? [
        { label: "Users", value: data.totals.users.toLocaleString(), detail: "Active accounts" },
        { label: "Courses", value: data.totals.courses.toLocaleString(), detail: "Published catalogue" },
        { label: "Enrolments", value: data.totals.enrollments.toLocaleString(), detail: "All statuses" },
        { label: "Paid revenue", value: formatCurrency(Number(data.totals.revenue) || 0), detail: "Verified payment records" },
      ]
    : pendingMetrics;

  return (
    <DashboardShell
      role="admin"
      title="VowLMS administration"
      description="Review authorised platform totals, academy activity, users, and operational controls. Production actions remain enforced by backend role checks."
      metrics={metrics}
    >
      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div> : null}
      {data?.mode === "development" ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">Development mode: account and enrolment totals are intentionally zero rather than fabricated.</div>
      ) : null}

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-ink">Administration areas</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <Link key={module.href} href={module.href} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-[#1166c8]/35">
              <h3 className="text-base font-semibold text-ink">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Academy activity</h2>
          {loading ? <div className="mt-4 h-32 animate-pulse rounded bg-slate-100" /> : (
            <div className="mt-4 divide-y divide-slate-100">
              {(data?.academyStats ?? []).map((academy) => (
                <div key={academy.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="font-medium text-ink">{academy.name}</span>
                  <span className="text-muted">{academy.course_count} courses | {academy.total_enrolments ?? 0} enrolments</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Top courses</h2>
          {data?.topCourses.length ? (
            <div className="mt-4 divide-y divide-slate-100">
              {data.topCourses.map((course) => (
                <Link key={course.slug} href={`/courses/${course.slug}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-[#1166c8]">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-muted">{course.enrolment_count} enrolments</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted">No verified enrolment ranking is available yet.</p>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
