"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSession } from "@/lib/auth/useSession";
import type { DashboardMetric } from "@/types/lms";

type Enrollment = {
  courseSlug?: string;
  course_slug?: string;
  courseTitle?: string;
  course_title?: string;
  description?: string;
  academy_name?: string;
  progress: number;
  status: string;
  nextLessonSlug?: string;
  course?: { title?: string; description?: string };
};

type Certificate = {
  certificate_id?: string;
  course_name?: string;
  course_slug?: string;
};

type LearnerDashboard = {
  metrics: DashboardMetric[];
  enrolledCourses: Enrollment[];
  certificates?: Certificate[];
  rewardPoints?: number;
};

const loadingMetrics: DashboardMetric[] = [
  { label: "Courses enrolled", value: "-", detail: "Loading" },
  { label: "Completed", value: "-", detail: "Loading" },
  { label: "Certificates", value: "-", detail: "Loading" },
  { label: "Reward points", value: "-", detail: "Loading" },
];

const quickLinks = [
  { label: "Browse courses", href: "/courses" },
  { label: "Certificates", href: "/certificates" },
  { label: "VowRewards", href: "/rewards" },
  { label: "VowSupport", href: "/support" },
];

function normaliseDashboard(raw: LearnerDashboard): LearnerDashboard {
  return {
    ...raw,
    metrics: (raw.metrics ?? []).map((metric) => ({
      ...metric,
      detail: metric.detail ?? "Verified account data",
    })),
    enrolledCourses: raw.enrolledCourses ?? [],
  };
}

export default function LearnerDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<LearnerDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin?returnTo=/dashboard/learner");
      return;
    }
    if (session.status !== "authenticated") return;

    const controller = new AbortController();
    fetch("/api/dashboard/learner", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Dashboard could not be loaded.");
        setDashboard(normaliseDashboard(payload.data));
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Dashboard could not be loaded.");
      });

    return () => controller.abort();
  }, [session.status, router]);

  const userName = session.status === "authenticated" ? session.user.name : "";

  return (
    <DashboardShell
      role="learner"
      title={userName ? `Welcome back, ${userName}` : "Learner dashboard"}
      description="Continue learning, review verified progress, access certificates, and move into the wider GoalVow ecosystem."
      metrics={dashboard?.metrics.length ? dashboard.metrics : loadingMetrics}
    >
      {error ? (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error} <button type="button" onClick={() => window.location.reload()} className="ml-2 font-semibold underline">Retry</button>
        </div>
      ) : null}

      <nav aria-label="Learner shortcuts" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-[#1166c8]/35 hover:text-[#1166c8]">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Your courses</h2>
            <Link href="/courses" className="text-sm font-semibold text-[#1166c8] hover:underline">Browse courses</Link>
          </div>

          {!dashboard && !error ? (
            <div className="mt-4 h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
          ) : dashboard?.enrolledCourses.length ? (
            <div className="mt-4 space-y-4">
              {dashboard.enrolledCourses.map((item) => {
                const slug = item.courseSlug ?? item.course_slug ?? "";
                const title = item.course?.title ?? item.courseTitle ?? item.course_title ?? "Course";
                const description = item.course?.description ?? item.description;
                const continueHref = item.nextLessonSlug ? `/lesson/${item.nextLessonSlug}` : `/courses/${slug}`;
                return (
                  <article key={`${slug}-${title}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_14px_38px_rgba(6,17,31,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">{item.academy_name ?? "Enrolled course"}</p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">{title}</h3>
                    {description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{description}</p> : null}
                    <div className="mt-5"><ProgressBar value={Number(item.progress) || 0} /></div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <ButtonLink href={continueHref} variant="ink">{item.progress > 0 ? "Continue learning" : "Open course"}</ButtonLink>
                      <ButtonLink href={`/courses/${slug}`} variant="outline">Course details</ButtonLink>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <h3 className="text-lg font-semibold text-ink">No enrolled courses yet</h3>
              <p className="mt-2 text-sm text-muted">Choose a course that fits your next learning goal.</p>
              <ButtonLink href="/courses" variant="ink" className="mt-5 inline-flex">Browse courses</ButtonLink>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink">Certificates</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {dashboard?.certificates?.length
                ? `${dashboard.certificates.length} certificate record${dashboard.certificates.length === 1 ? "" : "s"} available.`
                : "Completed, eligible courses will appear here."}
            </p>
            <Link href="/certificates" className="mt-4 inline-block text-sm font-semibold text-[#1166c8] hover:underline">View certificates</Link>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink">Need help?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Get help with access, course progress, assessments, or your next step.</p>
            <Link href="/support" className="mt-4 inline-block text-sm font-semibold text-[#1166c8] hover:underline">Open VowSupport</Link>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
