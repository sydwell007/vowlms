"use client";

import { useState, useEffect, useCallback } from "react";
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractYouTubeFromHtml(html: string): string | null {
  // iframe src containing youtube
  const m = html.match(/src=["']([^"']*(?:youtube|youtu\.be)[^"']*)["']/i);
  if (m) { const id = extractYouTubeId(m[1]); return id ? id : null; }
  // href link to youtube
  const m2 = html.match(/href=["']([^"']*(?:youtube\.com\/watch\?v=|youtu\.be\/)[^"']*)["']/i);
  if (m2) { const id = extractYouTubeId(m2[1]); return id ? id : null; }
  return null;
}

function getVideoInfo(lesson: Lesson, content: string): { type: "youtube" | "video" | "none"; src: string | null } {
  const raw = lesson.videoUrl ?? "";

  // Skip placeholder values from seed data
  if (raw && !raw.includes("placeholder") && !raw.includes("video.vowlms")) {
    const ytId = extractYouTubeId(raw);
    if (ytId) return { type: "youtube", src: ytId };
    if (raw.match(/\.(mp4|webm|ogg)(\?|$)/i)) return { type: "video", src: raw };
    // Check if it's already an embed URL
    if (raw.includes("youtube-nocookie.com/embed/") || raw.includes("youtube.com/embed/")) {
      const id = extractYouTubeId(raw);
      if (id) return { type: "youtube", src: id };
    }
  }

  // Extract YouTube from content HTML
  if (content) {
    const id = extractYouTubeFromHtml(content);
    if (id) return { type: "youtube", src: id };
  }

  return { type: "none", src: null };
}

function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

/** Remove scripts and event handlers but keep YouTube iframes */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "#")
    .replace(
      /<iframe([^>]*)src=["']([^"']*)["']([^>]*)>/gi,
      (_match, pre, src, post) => {
        if (/youtube/.test(src)) {
          // Normalise to youtube-nocookie
          const clean = src
            .replace("www.youtube.com/embed/", "www.youtube-nocookie.com/embed/")
            .replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
          return `<iframe${pre}src="${clean}"${post} style="width:100%;aspect-ratio:16/9;border:0;" allowfullscreen>`;
        }
        return ""; // strip non-YouTube iframes
      }
    );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LessonPlayer({ lesson, course, module, prevLesson, nextLesson, allModules, currentLessonSlug }: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  const assessment = course.assessments.find((a) => a.lessonSlug === lesson.slug);
  const vrPractice = course.vrPractices.find((v) => v.lessonSlug === lesson.slug);

  const video = getVideoInfo(lesson, lesson.content ?? "");
  const hasHtml = isHtmlContent(lesson.content ?? "");
  const hasContent = (lesson.content ?? "").replace(/<[^>]+>/g, "").trim().length > 0;

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
      const done: string[] = progress[course.slug]?.completedLessons ?? [];
      setCompletedSlugs(done);
      setCompleted(done.includes(lesson.slug));
    } catch { /* ignore */ }
  }, [course.slug, lesson.slug]);

  const markComplete = useCallback(async () => {
    // Persist to localStorage immediately (offline-safe)
    const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
    if (!progress[course.slug]) progress[course.slug] = { completedLessons: [], assessmentPassed: false };
    const done: string[] = progress[course.slug].completedLessons ?? [];
    if (!done.includes(lesson.slug)) done.push(lesson.slug);
    progress[course.slug].completedLessons = done;
    localStorage.setItem("vowlms_progress", JSON.stringify(progress));
    setCompleted(true);
    setCompletedSlugs([...done]);

    // Sync to bridge in background (non-blocking)
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonSlug: lesson.slug, courseSlug: course.slug }),
    }).catch(() => { /* offline — localStorage is source of truth */ });

    if (nextLesson) {
      setTimeout(() => router.push(`/lesson/${nextLesson.slug}`), 600);
    }
  }, [course.slug, lesson.slug, nextLesson, router]);

  // Remove iframe/youtube from sanitized HTML since we show it in the video player above
  const cleanContent = hasHtml
    ? sanitizeHtml(lesson.content ?? "")
        .replace(/<iframe[^>]*src=["'][^"']*youtube[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi, "")
        .replace(/<iframe[^>]*src=["'][^"']*youtube[^"']*["'][^>]*>/gi, "")
    : lesson.content ?? "";

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
            <p className="mt-2 text-sm text-muted">{lesson.durationMinutes} min · {lesson.type === "vr-practice" ? "VR Practice" : lesson.type === "assessment" ? "Assessment" : "Lesson"}</p>

            {/* ── Video player ─────────────────────────────────────────── */}
            {video.type === "youtube" && (
              <div className="mt-6 overflow-hidden rounded-2xl bg-black">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.src}?rel=0&modestbranding=1`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
              </div>
            )}

            {video.type === "video" && (
              <div className="mt-6 overflow-hidden rounded-2xl bg-black">
                <video
                  src={video.src!}
                  controls
                  className="w-full"
                  style={{ maxHeight: "540px" }}
                  title={lesson.title}
                />
              </div>
            )}

            {/* ── Lesson content ───────────────────────────────────────── */}
            {hasContent && (
              <div className="mt-8 space-y-5">
                <div className="premium-card rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-ink mb-4">Lesson content</h2>
                  {hasHtml ? (
                    <div
                      className="lesson-html-content text-base leading-8 text-slate-700"
                      dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />
                  ) : (
                    <p className="text-base leading-8 text-slate-700">{cleanContent}</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Assessment / VR placeholder when no content ──────────── */}
            {!hasContent && lesson.type === "assessment" && (
              <div className="mt-8 premium-card rounded-xl p-6 text-center">
                <p className="text-3xl mb-3">📝</p>
                <h2 className="text-lg font-semibold text-ink mb-2">Assessment</h2>
                <p className="text-sm text-muted">Complete the assessment below to test your knowledge.</p>
              </div>
            )}

            {!hasContent && lesson.type === "vr-practice" && (
              <div className="mt-8 premium-card rounded-xl p-6 text-center">
                <p className="text-3xl mb-3">🥽</p>
                <h2 className="text-lg font-semibold text-ink mb-2">VR Practice</h2>
                <p className="text-sm text-muted">Launch the VR simulation to practice your skills.</p>
              </div>
            )}

            {!hasContent && video.type === "none" && lesson.type === "text" && (
              <div className="mt-8 premium-card-soft rounded-xl p-6">
                <p className="text-sm text-muted text-center">
                  Lesson content will appear here once the migration is complete.
                  <br />
                  <span className="text-xs">{lesson.slug}</span>
                </p>
              </div>
            )}

            {/* ── Actions ──────────────────────────────────────────────── */}
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

            {/* ── Prev / Next navigation ────────────────────────────────── */}
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
