import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
            <article key={item.courseSlug} className="premium-card rounded-xl p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Enrolled course</p>
              <h2 className="mt-3 text-2xl font-semibold">{item.course?.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.course?.description}</p>
              <div className="mt-5">
                <ProgressBar value={item.progress} />
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/lesson/${item.nextLessonSlug}`} variant="ink">
                  Continue lesson
                </ButtonLink>
                <ButtonLink href={`/courses/${item.courseSlug}`} variant="outline">
                  Course details
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
        <aside className="premium-card rounded-xl p-6">
          <h2 className="text-2xl font-semibold">Next opportunity path</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Complete Career Readiness Accelerator, generate the certificate, collect rewards, then move into PlugConnect matching.
          </p>
          <div className="mt-5 space-y-3">
            {["Finish VR practice", "Pass assessment", "Generate certificate", "Open PlugConnect match"].map((item) => (
              <p key={item} className="premium-card-soft rounded-lg px-4 py-3 text-sm font-medium text-ink">{item}</p>
            ))}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
