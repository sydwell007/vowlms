import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Grades & Results" };

const pendingMetrics = [
  { label: "Assessment attempts", value: "-", detail: "History API required" },
  { label: "Average score", value: "-", detail: "No sample data" },
  { label: "Pass rate", value: "-", detail: "No sample data" },
  { label: "Completed courses", value: "-", detail: "Use learner dashboard" },
];

export default function GradesPage() {
  return (
    <DashboardShell
      role="learner"
      title="Grades & results"
      description="Assessment history must come from learner-owned attempt records."
      metrics={pendingMetrics}
    >
      <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <h2 className="text-xl font-semibold text-ink">Assessment history is not connected yet</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">
          VowLMS records new assessment submissions on the backend, but a learner-owned results-history endpoint is still required before this page can display scores and attempts safely.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dashboard/learner" variant="ink">Learner dashboard</ButtonLink>
          <ButtonLink href="/courses" variant="outline">Browse courses</ButtonLink>
        </div>
      </section>
    </DashboardShell>
  );
}
