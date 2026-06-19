import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { getAdminDashboard, getAcademies, getCourses } from "@/lib/data";

export const metadata = { title: "Admin Dashboard" };

const platformHealth = [
  { label: "API health", value: "99.9%", status: "ok" },
  { label: "PWA cache", value: "Active", status: "ok" },
  { label: "Database", value: "Connected (mock)", status: "ok" },
  { label: "Auth service", value: "Mock (ready)", status: "warn" },
  { label: "PayFast", value: "Pending config", status: "warn" },
  { label: "VowRewards API", value: "Placeholder", status: "info" },
];

export default function AdminDashboardPage() {
  const dashboard = getAdminDashboard();
  const academies = getAcademies();
  const courses = getCourses();

  const adminModules = [
    { title: "User management", href: "/dashboard/admin/users", icon: "👥", desc: "Manage learners, facilitators, and employers", badge: "1,284 users" },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: "📊", desc: "Charts, revenue, and engagement insights", badge: "Live" },
    { title: "Academies", href: "/academies", icon: "🏫", desc: `${academies.length} GoalVow academies active`, badge: `${academies.length}` },
    { title: "Courses", href: "/courses", icon: "📚", desc: `${courses.length} published courses`, badge: `${courses.length}` },
    { title: "Announcements", href: "/announcements", icon: "📣", desc: "Platform-wide and academy-specific news", badge: "7 posts" },
    { title: "Calendar", href: "/calendar", icon: "📅", desc: "Sessions, deadlines, cohorts, and events", badge: "6 upcoming" },
    { title: "Opportunities", href: "/opportunities", icon: "🎯", desc: "PlugConnect and partner opportunity pipeline", badge: "4 active" },
    { title: "Learning hubs", href: "/learning-hubs", icon: "🏢", desc: "Physical and virtual hub management", badge: "3 hubs" },
    { title: "Platform settings", href: "/dashboard/admin/settings", icon: "⚙️", desc: "Integrations, API keys, and system config", badge: "" },
  ];

  return (
    <DashboardShell
      role="admin"
      title={dashboard.name}
      description="Platform oversight for GoalVow Holdings — academies, learners, completions, revenue, integrations, and API health."
      metrics={dashboard.metrics}
    >
      <div className="space-y-6">
        {/* Admin modules grid */}
        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">Administration modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {adminModules.map((mod) => (
              <Link key={mod.title} href={mod.href}
                className="premium-card group flex items-start gap-4 rounded-xl p-5 transition hover:border-[#1166c8]/30 hover:shadow-[0_20px_56px_rgba(6,17,31,0.12)]">
                <span className="text-2xl mt-0.5">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink group-hover:text-[#1166c8] transition">{mod.title}</p>
                    {mod.badge && <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-muted">{mod.badge}</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted leading-4">{mod.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Platform health + Analytics events */}
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="premium-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-ink mb-4">Platform health</h2>
            <div className="space-y-2">
              {platformHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
                  <p className="text-sm text-ink">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.status === "ok" ? "bg-emerald-500" : item.status === "warn" ? "bg-yellow-500" : "bg-slate-400"}`} />
                    <p className={`text-xs font-semibold ${item.status === "ok" ? "text-emerald-600" : item.status === "warn" ? "text-yellow-600" : "text-muted"}`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="premium-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-ink mb-4">Analytics event stream</h2>
            <div className="space-y-1.5">
              {dashboard.analyticsEvents.map((event) => (
                <div key={event} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <p className="font-mono text-xs text-slate-600">{event}</p>
                  <p className="ml-auto text-[10px] text-muted">active</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard/admin/analytics" className="mt-4 block text-center text-xs font-semibold text-[#1166c8] hover:underline">
              View full analytics dashboard →
            </Link>
          </section>
        </div>

        {/* Quick links */}
        <section>
          <h2 className="text-base font-semibold text-ink mb-3">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Invite learner", href: "/dashboard/admin/users" },
              { label: "View opportunities", href: "/opportunities" },
              { label: "Check API health", href: "/api/health" },
              { label: "Review announcements", href: "/announcements" },
              { label: "Learning hubs", href: "/learning-hubs" },
              { label: "Pricing settings", href: "/pricing" },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-[#1166c8]/30 hover:text-[#1166c8]">
                {action.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
