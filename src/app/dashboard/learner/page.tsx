"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLearnerDashboard } from "@/lib/data";
import { useSession } from "@/lib/auth/useSession";

const dashboardData = getLearnerDashboard();

const quickLinks = [
  { label: "Grades & results", href: "/dashboard/learner/grades", icon: "📊" },
  { label: "Announcements", href: "/announcements", icon: "📣" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Search courses", href: "/search", icon: "🔍" },
  { label: "Profile settings", href: "/profile", icon: "👤" },
  { label: "Learning hubs", href: "/learning-hubs", icon: "🏫" },
];

export default function LearnerDashboardPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const userName =
    session.status === "authenticated"
      ? session.user.name
      : session.status === "loading"
      ? ""
      : "";

  const isLoading = session.status === "loading";

  return (
    <DashboardShell
      role="learner"
      title={isLoading ? "Welcome back…" : `Welcome back, ${userName}`}
      description="Track active courses, next lessons, grades, rewards, certificates, and opportunities from your GoalVow learner dashboard."
      metrics={dashboardData.metrics}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Quick links */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="premium-card flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition hover:border-[#1166c8]/30"
              >
                <span className="text-xl">{link.icon}</span>
                <p className="text-[10px] font-semibold text-muted leading-3">{link.label}</p>
              </Link>
            ))}
          </div>

          {/* Enrolled courses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-ink">Enrolled courses</h2>
              <Link href="/courses" className="text-sm font-medium text-[#1166c8] hover:underline">
                Browse more →
              </Link>
            </div>
            {dashboardData.enrolledCourses.length === 0 ? (
              <div className="premium-card rounded-xl p-8 text-center">
                <p className="text-2xl mb-2">📚</p>
                <p className="font-semibold text-ink">No enrolled courses yet</p>
                <p className="mt-1 text-sm text-muted">Browse our 595 courses and start learning today.</p>
                <ButtonLink href="/courses" variant="ink" className="mt-4 inline-flex">
                  Browse courses
                </ButtonLink>
              </div>
            ) : (
              dashboardData.enrolledCourses.map((item) => (
                <article key={item.courseSlug} className="premium-card rounded-xl p-6 mb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1166c8]">
                    Enrolled course
                  </p>
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
                    <Link
                      href={`/courses/${item.courseSlug}/discussion`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
                    >
                      💬 Discussion
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          {/* Opportunity path */}
          <div className="premium-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-ink">Next opportunity path</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Complete a course, generate the certificate, collect rewards, then move into
              PlugConnect matching.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { step: "Enrol in a course", done: false },
                { step: "Complete lessons", done: false },
                { step: "Pass assessment", done: false },
                { step: "Generate certificate", done: false },
                { step: "Open PlugConnect match", done: false },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    item.done
                      ? "bg-emerald-50 text-emerald-700"
                      : "premium-card-soft text-ink"
                  }`}
                >
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
              <Link href="/calendar" className="text-xs font-medium text-[#1166c8] hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {[
                { title: "Live session: Career Readiness", date: "24 Jun", type: "live" },
                { title: "Assessment deadline: Solar Inst.", date: "27 Jun", type: "deadline" },
                { title: "VR Kitchen session", date: "28 Jun", type: "vr" },
              ].map((event) => (
                <Link
                  key={event.title}
                  href="/calendar"
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 transition hover:border-[#1166c8]/20"
                >
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
              <Link href="/certificates" className="text-xs font-medium text-[#1166c8] hover:underline">
                View all →
              </Link>
            </div>
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
              <p className="text-sm text-muted">Complete a course to earn your first certificate.</p>
              <Link href="/courses" className="mt-2 inline-block text-xs font-semibold text-[#1166c8] hover:underline">
                Browse courses →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
