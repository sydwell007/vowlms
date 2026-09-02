"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCourseStats } from "@/lib/course-content";
import type { Course } from "@/types/lms";

type EnrolledCourse = {
  courseSlug?: string;
  course_slug?: string;
  progress?: number | string;
  status?: string;
};

type CertificateState = "checking" | "ready" | "not-yet" | "unknown";

function totalLessonCount(course: Course) {
  return getCourseStats(course).lessonCount;
}

function readLocalAssessmentScore(course: Course): number | null {
  const assessmentSlug = course.assessments[0]?.slug;
  if (!assessmentSlug) return null;
  try {
    const attempts = JSON.parse(localStorage.getItem("vowlms_assessments") ?? "{}");
    const attempt = attempts[assessmentSlug];
    return typeof attempt?.score === "number" ? attempt.score : null;
  } catch {
    return null;
  }
}

export function ResultsPageClient({ course }: { course: Course }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [certificateState, setCertificateState] = useState<CertificateState>("checking");
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setAssessmentScore(readLocalAssessmentScore(course));
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

    fetch(`/api/certificates/generate?courseSlug=${encodeURIComponent(course.slug)}`, {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((res) => setCertificateState(res.ok ? "ready" : res.status === 404 ? "not-yet" : "unknown"))
      .catch(() => setCertificateState("unknown"));

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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Lessons"
              value={done !== null ? `${done}/${total}` : "—"}
              detail={progress !== null ? "Synced from your account" : "Sign in to see your progress"}
            />
            <MetricCard
              label="Assessment"
              value={assessmentScore !== null ? `${assessmentScore}%` : "—"}
              detail={assessmentScore !== null ? "Your last attempt on this device" : "Not yet taken on this device"}
            />
            {course.vrPractices[0] ? (
              <MetricCard label="VR practice" value="Preview" detail="Guided practice — not yet scored live" />
            ) : (
              <MetricCard label="VR practice" value="—" detail="Not offered for this course" />
            )}
            <MetricCard label="Rewards" value={`${course.rewards}`} detail="Points available for this course" />
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
            ) : (
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
