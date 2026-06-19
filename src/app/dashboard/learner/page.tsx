import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLearnerDashboard } from "@/lib/data";

export const metadata = { title: "Learner Dashboard" };

export default function LearnerDashboardPage() {
  const dashboard = getLearnerDashboard();

  const quickLinks = [
    { label: "Grades & results", href: "/dashboard/learner/grades", icon: "📊" },
    { label: "Announcements", href: "/announcements", icon: "📣" },
    { label: "Calendar", href: "/calendar", icon: "📅" },
    { label: "Search courses", href: "/search", icon: "🔍" },
    { label: "Profile settings", href: "/profile", icon: "👤" },
    { label: "Learning hubs", href: "/learning-hubs", icon: "🏫" },
  ];

  return (
    <DashboardShell
      role="learner"
      title={`Welcome back, ${dashboard.learner}`}
      description="Track active courses, next lessons, grades, rewards, certificates, and opportunities from your GoalVow learner dashboard."
      metrics={dashboard.metrics}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Quick links */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="premium-card flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition hover:border-[#1166c8]/30">
                <span className="text-xl">{link.icon}</span>
                <p className="text-[10px] font-semibold text-muted leading-3">{link.label}</p>
              </Link>
            ))}
          </div>

          {/* Enrolled courses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-ink">Enrolled courses</h2>
              <Link href="/courses" className="text-sm font-medium text-[#1166c8] hover:underline">Browse more →</Link>
            </div>
            {dashboard.enrolledCourses.map((item) => (
              <article key={item.courseSlug} className="premium-card rounded-xl p-6 mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Enrolled course</p>
                <h3 className="mt-3 text-2xl font-semibold">{item.course?.title}</h3>
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
                  <Link href={`/courses/${item.courseSlug}/discussion`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50">
                    💬 Discussion
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          {/* Opportunity path */}
          <div className="premium-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-ink">Next opportunity path</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Complete Career Readiness Accelerator, generate the certificate, collect rewards, then move into PlugConnect matching.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { step: "Finish VR practice", done: false },
                { step: "Pass assessment", done: true },
                { step: "Generate certificate", done: false },
                { step: "Open PlugConnect match", done: false },
              ].map((item) => (
                <div key={item.step} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${item.done ? "bg-emerald-50 text-emerald-700" : "premium-card-soft text-ink"}`}>
                  <span>{item.done ? "✓" : "○"}</span>
                  {item.step}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="premium-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-ink">Upcoming events</h3>
              <Link href="/calendar" className="text-xs font-medium text-[#1166c8] hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {[
                { title: "Live session: Career Readiness", date: "24 Jun", type: "live" },
                { title: "Assessment deadline: Solar Inst.", date: "27 Jun", type: "deadline" },
                { title: "VR Kitchen session", date: "28 Jun", type: "vr" },
              ].map((event) => (
                <Link key={event.title} href="/calendar"
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 transition hover:border-[#1166c8]/20">
                  <span className="text-lg shrink-0">
                    {event.type === "live" ? "📹" : event.type === "deadline" ? "⏰" : "🥽"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">{event.title}</p>
                    <p className="text-[10px] text-muted">{event.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="premium-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-ink">Certificates</h3>
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">2 earned</span>
            </div>
            <div className="space-y-2">
              {[
                { course: "Digital Workplace Essentials", slug: "digital-workplace-essentials", date: "20 May 2026" },
                { course: "Career Readiness", slug: "career-readiness-accelerator", date: "12 Jun 2026" },
              ].map((cert) => (
                <Link key={cert.slug} href={`/certificates/${cert.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 transition hover:border-gold/30">
                  <div>
                    <p className="text-xs font-semibold text-ink">{cert.course}</p>
                    <p className="text-[10px] text-muted">{cert.date}</p>
                  </div>
                  <span className="text-xs font-semibold text-gold">PDF →</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
