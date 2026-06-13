import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { getAdminDashboard } from "@/lib/data";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  const dashboard = getAdminDashboard();

  return (
    <DashboardShell
      role="admin"
      title={dashboard.name}
      description="A compact platform control view for academies, courses, users, completions, revenue placeholders, integrations, and API health."
      metrics={dashboard.metrics}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
          <h2 className="text-2xl font-semibold">Operational overview</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Academies", "Courses", "Learners", "Facilitators", "Employers", "Completions", "Payments", "Integrations"].map((item) => (
              <div key={item} className="rounded-md bg-slate-50 p-4">
                <p className="font-semibold">{item}</p>
                <p className="mt-1 text-sm text-muted">Admin module placeholder</p>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
          <h2 className="text-2xl font-semibold">Analytics events</h2>
          <div className="mt-5 space-y-2">
            {dashboard.analyticsEvents.map((event) => (
              <p key={event} className="rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">{event}</p>
            ))}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
