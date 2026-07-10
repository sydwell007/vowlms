import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Assigned Courses | Facilitator" };

const pendingMetrics = [
  { label: "Assigned courses", value: "-", detail: "Assignment API required" },
  { label: "Authorised learners", value: "-", detail: "Course scope required" },
  { label: "Assessment reviews", value: "-", detail: "Review API required" },
  { label: "Completion rate", value: "-", detail: "Verified records only" },
];

export default function FacilitatorCoursesPage() {
  return (
    <DashboardShell
      role="facilitator"
      title="Assigned courses"
      description="Course rosters and learner details will appear only from authorised facilitator assignments."
      metrics={pendingMetrics}
    >
      <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <h2 className="text-xl font-semibold text-ink">No authorised course roster is available</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">
          This page no longer displays demonstration learners, grades, pass rates, or activity. Connect the facilitator-assignment and assessment-review contract before publishing roster data.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dashboard/facilitator" variant="ink">Facilitator dashboard</ButtonLink>
          <ButtonLink href="/support" variant="outline">Request support</ButtonLink>
        </div>
      </section>
    </DashboardShell>
  );
}
