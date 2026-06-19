"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lesson, Course, CourseModule } from "@/types/lms";

type Props = {
  lesson: Lesson;
  course: Course;
  module: CourseModule;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  allModules: CourseModule[];
  currentLessonSlug: string;
};

export function LessonPlayer({ lesson, course, module, prevLesson, nextLesson, allModules, currentLessonSlug }: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const assessment = course.assessments.find((a) => a.lessonSlug === lesson.slug);
  const vrPractice = course.vrPractices.find((v) => v.lessonSlug === lesson.slug);

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
    const courseProgress = progress[course.slug] ?? {};
    const completedLessons: string[] = courseProgress.completedLessons ?? [];
    setCompleted(completedLessons.includes(lesson.slug));
  }, [course.slug, lesson.slug]);

  function markComplete() {
    const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
    if (!progress[course.slug]) progress[course.slug] = { completedLessons: [], assessmentPassed: false };
    const completedLessons: string[] = progress[course.slug].completedLessons ?? [];
    if (!completedLessons.includes(lesson.slug)) {
      completedLessons.push(lesson.slug);
    }
    progress[course.slug].completedLessons = completedLessons;
    localStorage.setItem("vowlms_progress", JSON.stringify(progress));
    setCompleted(true);

    if (nextLesson) {
      setTimeout(() => router.push(`/lesson/${nextLesson.slug}`), 600);
    }
  }

  const allLessons = allModules.flatMap((m) => m.lessons);
  const completedSlugs = (() => {
    try {
      const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
      return (progress[course.slug]?.completedLessons ?? []) as string[];
    } catch { return []; }
  })();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbfe]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition">
            ← <span className="hidden sm:block">{course.title}</span><span className="sm:hidden">Course</span>
          </Link>
          <div className="mx-auto hidden max-w-xs truncate text-center text-sm font-semibold text-ink sm:block">
            {lesson.title}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-slate-50 lg:hidden"
          >
            ☰ Course
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-20 w-72 transform bg-white shadow-2xl transition-transform duration-200 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="border-b border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{course.title}</p>
              <h2 className="mt-1 text-sm font-semibold text-ink">{module.title}</h2>
            </div>
            <nav className="flex-1 p-3 space-y-4">
              {allModules.map((m) => (
                <div key={m.title}>
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Module {m.order}: {m.title}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {m.lessons.map((l) => {
                      const isCurrent = l.slug === currentLessonSlug;
                      const isDone = completedSlugs.includes(l.slug);
                      return (
                        <Link
                          key={l.slug}
                          href={`/lesson/${l.slug}`}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isCurrent ? "bg-[#06111f] text-white font-semibold" : "text-ink hover:bg-slate-50"}`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-white/20 text-white" : "bg-slate-100 text-muted"}`}>
                            {isDone ? "✓" : l.type === "assessment" ? "📝" : l.type === "vr-practice" ? "🥽" : "▸"}
                          </span>
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className={`text-[10px] shrink-0 ${isCurrent ? "text-white/60" : "text-muted"}`}>{l.durationMinutes}m</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-10 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-10">
            {/* Module breadcrumb */}
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">
              Module {module.order} · {module.title}
            </p>
            <h1 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-sm text-muted">{lesson.durationMinutes} min · {lesson.type === "vr-practice" ? "VR Practice" : lesson.type === "assessment" ? "Assessment" : "Text lesson"}</p>

            {/* Video area */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#071526] to-[#0d2239]">
              <div className="aspect-video flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-2xl backdrop-blur-sm">
                    ▶
                  </div>
                  <p className="text-sm font-semibold text-gold">Video lesson</p>
                  <p className="mt-2 text-xs text-white/60">Mux video integration · Coming soon</p>
                  <p className="mt-1 text-xs font-mono text-white/40 truncate max-w-[240px]">{lesson.videoUrl}</p>
                </div>
              </div>
            </div>

            {/* Lesson content */}
            <div className="mt-8 space-y-5">
              <div className="premium-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-ink mb-3">Lesson content</h2>
                <p className="text-base leading-8 text-slate-700">{lesson.content}</p>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  This lesson is part of the {course.title} course in the GoalVow Academy ecosystem.
                  Apply what you learn here directly to your practical skills pathway.
                </p>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Offline lesson text and saved progress sync are available as PWA features for learners at GoalVow Learning Hubs with limited connectivity.
                </p>
              </div>

              {/* Resources */}
              <div className="premium-card-soft rounded-xl p-5">
                <h3 className="text-sm font-semibold text-ink mb-3">Resources</h3>
                <div className="space-y-2">
                  {[
                    { name: "Lesson notes PDF", size: "142 KB", icon: "📄" },
                    { name: "Worksheet template", size: "38 KB", icon: "📋" },
                  ].map((resource) => (
                    <div key={resource.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{resource.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-ink">{resource.name}</p>
                          <p className="text-xs text-muted">{resource.size}</p>
                        </div>
                      </div>
                      <button className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-ink hover:bg-slate-200 transition">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                {assessment && (
                  <Link href={`/assessment/${assessment.slug}`}
                    className="rounded-lg bg-[#1166c8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d55b0]">
                    📝 Assessment
                  </Link>
                )}
                {vrPractice && (
                  <Link href={`/vr-practice/${vrPractice.slug}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50">
                    🥽 VR Practice
                  </Link>
                )}
              </div>

              <button
                onClick={markComplete}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${completed ? "bg-emerald-500 text-white cursor-default" : "bg-gold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] hover:bg-[#e8b830]"}`}
              >
                {completed ? "✓ Completed" : "Mark complete →"}
              </button>
            </div>

            {/* Prev / Next navigation */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8">
              {prevLesson ? (
                <Link href={`/lesson/${prevLesson.slug}`}
                  className="premium-card rounded-xl p-4 text-left transition hover:border-[#1166c8]/20">
                  <p className="text-xs font-semibold text-muted">← Previous</p>
                  <p className="mt-1 text-sm font-semibold text-ink truncate">{prevLesson.title}</p>
                </Link>
              ) : <div />}
              {nextLesson ? (
                <Link href={`/lesson/${nextLesson.slug}`}
                  className="premium-card rounded-xl p-4 text-right transition hover:border-[#1166c8]/20">
                  <p className="text-xs font-semibold text-muted">Next →</p>
                  <p className="mt-1 text-sm font-semibold text-ink truncate">{nextLesson.title}</p>
                </Link>
              ) : (
                <div className="premium-card-soft rounded-xl p-4 text-right">
                  <p className="text-xs font-semibold text-muted">Course complete</p>
                  <Link href={`/results/${course.slug}`} className="mt-1 text-sm font-semibold text-[#1166c8] hover:underline">
                    View results →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
