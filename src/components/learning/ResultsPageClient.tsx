"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCourseStats } from "@/lib/course-content";
import { allGroupings } from "@/data/course-groupings";
import { isCertificateCourse } from "@/lib/certificates/catalogue";
import type { Course } from "@/types/lms";

type EnrolledCourse = {
  courseSlug?: string;
  course_slug?: string;
  progress?: number | string;
  status?: string;
};

type AssessmentAttempt = { course_slug?: string; passed?: number | boolean; score?: number; attempted_at?: string };

type CertificateState = "checking" | "ready" | "not-yet" | "unknown" | "none";

function totalLessonCount(course: Course) {
  return getCourseStats(course).lessonCount;
}

/**
 * A course's assessments live on its real child courses, joined here by
 * child-course slug (assessment_attempts has no assessment slug of its own —
 * see public/php/api/assessments/history.php) — never localStorage, which
 * only ever reflected whatever device last took the assessment, not the
 * learner's real synced account state.
 */
async function fetchPassedAssessmentCount(course: Course): Promise<{ passed: number; total: number } | null> {
  const grouping = allGroupings.find((g) => g.slug === course.slug);
  const childSlugs = new Set(grouping?.moduleSlugOrder ?? [course.slug]);
  const total = course.assessments.length;
  if (total === 0) return null;

  const res = await fetch("/api/assessments/history", { cache: "no-store", credentials: "same-origin" });
  if (!res.ok) return null;
  const payload = await res.json();
  const attempts = (payload?.data?.attempts ?? []) as AssessmentAttempt[];

  // Keep only the most recent attempt per child course, since a retake
  // shouldn't be double-counted against `total`.
  const latestByChildCourse = new Map<string, AssessmentAttempt>();
  for (const attempt of attempts) {
    if (!attempt.course_slug || !childSlugs.has(attempt.course_slug)) continue;
    const existing = latestByChildCourse.get(attempt.course_slug);
    if (!existing || (attempt.attempted_at ?? "") > (existing.attempted_at ?? "")) {
      latestByChildCourse.set(attempt.course_slug, attempt);
    }
  }

  const passed = [...latestByChildCourse.values()].filter((a) => a.passed === 1 || a.passed === true).length;
  return { passed, total };
}

export function ResultsPageClient({ course }: { course: Course }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [certificateState, setCertificateState] = useState<CertificateState>("checking");
  const [assessmentSummary, setAssessmentSummary] = useState<{ passed: number; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPassedAssessmentCount(course)
      .then((result) => {
        if (!cancelled) setAssessmentSummary(result);
      })
      .catch(() => {
        if (!cancelled) setAssessmentSummary(null);
      });

    const controller = new AbortController();

    fetch("/api/dashboard/learner", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const enrolled = (payload?.data?.enrolledCourses ?? []) as EnrolledCourse[];
        const match = enrolled.find((item) => (item.courseSlug ?? item.course_slug) === course.slug);
        setProgress(match ? Number(match.progress) || 0 : 0);
      })
      .catch(() => setProgress(null));

    Promise.resolve().then(() => {
      if (cancelled) return;
      if (!isCertificateCourse(course.slug)) {
        // No certificate exists for this course at all — never claim one is
        // coming, unlike the generic "not-yet" state below.
        setCertificateState("none");
        return;
      }
      fetch(`/api/certificates/generate?courseSlug=${encodeURIComponent(course.slug)}`, {
        cache: "no-store",
        credentials: "same-origin",
        signal: controller.signal,
      })
        .then((res) => setCertificateState(res.ok ? "ready" : res.status === 404 ? "not-yet" : "unknown"))
        .catch(() => setCertificateState("unknown"));
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [course]);

  const total = totalLessonCount(course);
  const done = progress !== null ? Math.round((total * progress) / 100) : null;

  return (
    <main className="premium-page">
      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="premium-card rounded-xl p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Results</p>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-5xl">{course.title}</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Lessons"
              value={done !== null ? `${done}/${total}` : "—"}
              detail={progress !== null ? "Synced from your account" : "Sign in to see your progress"}
            />
            <MetricCard
              label="Assessment"
              value={assessmentSummary ? `${assessmentSummary.passed}/${assessmentSummary.total}` : "—"}
              detail={assessmentSummary ? "Synced from your account" : "Not yet taken"}
            />
            <MetricCard label="Rewards" value={`${course.rewards}`} detail="VOWR available for this course" />
          </div>
          <div className="mt-8">
            <ProgressBar value={progress ?? 0} label="Completion" />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {certificateState === "ready" ? (
              <ButtonLink href={`/certificates/${course.slug}`} variant="ink">
                View certificate
              </ButtonLink>
            ) : certificateState === "checking" ? (
              <span className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-muted">
                Checking certificate status…
              </span>
            ) : certificateState === "none" ? null : (
              <ButtonLink href={`/courses/${course.slug}`} variant="ink">
                Complete this course to unlock your certificate
              </ButtonLink>
            )}
            <ButtonLink href="/rewards" variant="outline">
              View rewards
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
