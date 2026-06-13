import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLearnerDashboard } from "@/lib/data";

export const metadata = {
  title: "Learner Dashboard",
};

export default function LearnerDashboardPage() {
  const dashboard = getLearnerDashboard();

  return (
    <DashboardShell
      role="learner"
      title={`Welcome back, ${dashboard.learner}`}
      description="Track active courses, next lessons, rewards, certificates, and opportunities from one mobile-first learner dashboard."
      metrics={dashboard.metrics}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {dashboard.enrolledCourses.map((item) => (
            <article key={item.courseSlug} className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Enrolled course</p>
              <h2 className="mt-3 text-2xl font-semibold">{item.course?.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.course?.description}</p>
              <div className="mt-5">
                <ProgressBar value={item.progress} />
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href={`/lesson/${item.nextLessonSlug}`} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#06111f] px-5 text-sm font-semibold text-white">
                  Continue lesson
                </Link>
                <Link href={`/courses/${item.courseSlug}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-ink">
                  Course details
                </Link>
              </div>
            </article>
          ))}
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
          <h2 className="text-2xl font-semibold">Next opportunity path</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Complete Career Readiness Accelerator, generate the certificate, collect rewards, then move into PlugConnect matching.
          </p>
          <div className="mt-5 space-y-3">
            {["Finish VR practice", "Pass assessment", "Generate certificate", "Open PlugConnect match"].map((item) => (
              <p key={item} className="rounded-md bg-slate-50 px-4 py-3 text-sm font-medium text-ink">{item}</p>
            ))}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
