import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { getEmployerDashboard } from "@/lib/data";

export const metadata = {
  title: "Employer Dashboard",
};

export default function EmployerDashboardPage() {
  const dashboard = getEmployerDashboard();

  return (
    <DashboardShell
      role="employer"
      title={dashboard.name}
      description="Review learner achievements, course completions, certificates, and future opportunity postings."
      metrics={dashboard.metrics}
    >
      <div className="premium-card rounded-xl p-6">
        <h2 className="text-2xl font-semibold">Talent and opportunity pipeline</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {dashboard.opportunities.map((opportunity) => (
            <article key={opportunity.id} className="premium-card-soft rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{opportunity.type}</p>
              <h3 className="mt-3 text-xl font-semibold">{opportunity.title}</h3>
              <p className="mt-2 text-sm font-medium text-muted">{opportunity.partner} | {opportunity.location}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{opportunity.description}</p>
            </article>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
