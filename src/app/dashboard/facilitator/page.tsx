import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { getFacilitatorDashboard } from "@/lib/data";

export const metadata = {
  title: "Facilitator Dashboard",
};

export default function FacilitatorDashboardPage() {
  const dashboard = getFacilitatorDashboard();

  return (
    <DashboardShell
      role="facilitator"
      title={dashboard.name}
      description="Monitor assigned courses, cohort progress, assessment performance, and VR practice activity."
      metrics={dashboard.metrics}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {dashboard.focusCourses.map((course) => (
          <article key={course.slug} className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Assigned course</p>
            <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{course.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold">42</p>
                <p className="mt-1 text-xs text-muted">Learners</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold">81%</p>
                <p className="mt-1 text-xs text-muted">Progress</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold">76%</p>
                <p className="mt-1 text-xs text-muted">Pass rate</p>
              </div>
            </div>
            <Link href={`/courses/${course.slug}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#06111f] px-5 text-sm font-semibold text-white">
              Review course
            </Link>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
