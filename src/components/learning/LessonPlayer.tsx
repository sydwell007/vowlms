"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lesson, Course, CourseModule } from "@/types/lms";

export type LessonResource = {
  type: "pdf" | "video" | "audio" | "image" | "other";
  filename: string;
  url: string;
  filesize: number;
  mimeType?: string;
};

type Props = {
  lesson: Lesson;
  course: Course;
  module: CourseModule;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  allModules: CourseModule[];
  currentLessonSlug: string;
  resources?: LessonResource[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractYouTubeFromHtml(html: string): string | null {
  const m = html.match(/src=["']([^"']*(?:youtube|youtu\.be)[^"']*)["']/i);
  if (m) { const id = extractYouTubeId(m[1]); return id || null; }
  const m2 = html.match(/href=["']([^"']*(?:youtube\.com\/watch\?v=|youtu\.be\/)[^"']*)["']/i);
  if (m2) { const id = extractYouTubeId(m2[1]); return id || null; }
  return null;
}

type VideoInfo =
  | { type: "youtube"; ytId: string }
  | { type: "mp4"; url: string; mimeType?: string }
  | { type: "none" };

function getVideoInfo(lesson: Lesson, content: string, resources: LessonResource[]): VideoInfo {
  // 1. Uploaded video file (fastest — served from Moodle filedir via PHP)
  const vidResource = resources.find((r) => r.type === "video");
  if (vidResource?.url) {
    return { type: "mp4", url: vidResource.url, mimeType: vidResource.mimeType };
  }

  // 2. lesson.videoUrl — could be YouTube embed or uploaded-video serve URL
  const raw = lesson.videoUrl ?? "";
  if (raw && !raw.includes("placeholder") && !raw.includes("video.vowlms")) {
    // Uploaded video served via PHP (URL contains /files/serve?hash=)
    if (raw.includes("files/serve")) {
      return { type: "mp4", url: raw };
    }
    // YouTube
    const ytId = extractYouTubeId(raw);
    if (ytId) return { type: "youtube", ytId };
    // Already an embed URL
    const embedMatch = raw.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/);
    if (embedMatch) return { type: "youtube", ytId: embedMatch[1] };
    // Direct video file URL
    if (raw.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) return { type: "mp4", url: raw };
  }

  // 3. YouTube embed inside HTML content
  if (content) {
    const id = extractYouTubeFromHtml(content);
    if (id) return { type: "youtube", ytId: id };
  }

  return { type: "none" };
}

function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "#")
    .replace(
      /<iframe([^>]*)src=["']([^"']*)["']([^>]*)>/gi,
      (_m, pre, src, post) => {
        if (/youtube/.test(src)) {
          const clean = src
            .replace("www.youtube.com/embed/", "www.youtube-nocookie.com/embed/")
            .replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
          return `<iframe${pre}src="${clean}"${post} style="width:100%;aspect-ratio:16/9;border:0;" allowfullscreen>`;
        }
        return "";
      }
    );
}

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LessonPlayer({
  lesson, course, module, prevLesson, nextLesson,
  allModules, currentLessonSlug, resources = [],
}: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [activePdf, setActivePdf] = useState<LessonResource | null>(null);

  const assessment = course.assessments.find((a) => a.lessonSlug === lesson.slug);
  const vrPractice = course.vrPractices.find((v) => v.lessonSlug === lesson.slug);

  const content = lesson.content ?? "";
  const videoInfo = getVideoInfo(lesson, content, resources);

  // Remove YouTube iframes from HTML content (shown in video player above)
  const cleanContent = isHtmlContent(content)
    ? sanitizeHtml(content)
        .replace(/<iframe[^>]*src=["'][^"']*youtube[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi, "")
        .replace(/<iframe[^>]*src=["'][^"']*youtube[^"']*["'][^>]*>/gi, "")
    : content;

  const hasContent = cleanContent.replace(/<[^>]+>/g, "").trim().length > 0;
  const htmlContent = isHtmlContent(cleanContent);

  // Separate resource types
  const pdfResources = resources.filter((r) => r.type === "pdf");
  const audioResources = resources.filter((r) => r.type === "audio");
  const otherResources = resources.filter((r) => r.type === "other" || r.type === "image");

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
      const done: string[] = progress[course.slug]?.completedLessons ?? [];
      setCompletedSlugs(done);
      setCompleted(done.includes(lesson.slug));
    } catch { /* ignore */ }
  }, [course.slug, lesson.slug]);

  // Auto-open the first PDF if this lesson type is "resource"
  useEffect(() => {
    if (pdfResources.length > 0 && !hasContent && videoInfo.type === "none") {
      setActivePdf(pdfResources[0]);
    }
  }, [pdfResources, hasContent, videoInfo.type]);

  const markComplete = useCallback(async () => {
    const progress = JSON.parse(localStorage.getItem("vowlms_progress") ?? "{}");
    if (!progress[course.slug]) progress[course.slug] = { completedLessons: [], assessmentPassed: false };
    const done: string[] = progress[course.slug].completedLessons ?? [];
    if (!done.includes(lesson.slug)) done.push(lesson.slug);
    progress[course.slug].completedLessons = done;
    localStorage.setItem("vowlms_progress", JSON.stringify(progress));
    setCompleted(true);
    setCompletedSlugs([...done]);

    // Sync to bridge in background
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonSlug: lesson.slug, courseSlug: course.slug }),
    }).catch(() => {});

    if (nextLesson) {
      setTimeout(() => router.push(`/lesson/${nextLesson.slug}`), 600);
    }
  }, [course.slug, lesson.slug, nextLesson, router]);

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

        {sidebarOpen && (
          <div className="fixed inset-0 z-10 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-10">

            {/* Breadcrumb */}
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">
              Module {module.order} · {module.title}
            </p>
            <h1 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {lesson.durationMinutes} min · {lesson.type === "vr-practice" ? "VR Practice" : lesson.type === "assessment" ? "Assessment" : "Lesson"}
            </p>

            {/* ── VIDEO PLAYER ────────────────────────────────────────── */}
            {videoInfo.type === "youtube" && (
              <div className="mt-6 overflow-hidden rounded-2xl bg-black">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoInfo.ytId}?rel=0&modestbranding=1`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
              </div>
            )}

            {videoInfo.type === "mp4" && (
              <div className="mt-6 overflow-hidden rounded-2xl bg-black">
                <video
                  controls
                  preload="metadata"
                  className="w-full"
                  style={{ maxHeight: "540px" }}
                  title={lesson.title}
                >
                  <source src={videoInfo.url} type={videoInfo.mimeType ?? "video/mp4"} />
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {/* ── PDF VIEWER (inline embed) ────────────────────────────── */}
            {pdfResources.length > 0 && (
              <div className="mt-6 space-y-3">
                {/* PDF tab pills when multiple PDFs */}
                {pdfResources.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {pdfResources.map((r) => (
                      <button
                        key={r.url}
                        onClick={() => setActivePdf(r)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activePdf?.url === r.url ? "bg-[#1166c8] text-white" : "border border-slate-200 bg-white text-ink hover:bg-slate-50"}`}
                      >
                        📄 {r.filename}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active PDF embed */}
                {(activePdf ?? pdfResources[0]) && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                      <span className="text-xs font-semibold text-ink truncate">
                        📄 {(activePdf ?? pdfResources[0]).filename}
                      </span>
                      <a
                        href={(activePdf ?? pdfResources[0]).url}
                        download
                        className="ml-3 shrink-0 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-ink hover:bg-slate-200 transition"
                      >
                        Download
                      </a>
                    </div>
                    <iframe
                      src={(activePdf ?? pdfResources[0]).url + "#toolbar=1&navpanes=1&scrollbar=1"}
                      className="w-full border-0"
                      style={{ height: "640px" }}
                      title={(activePdf ?? pdfResources[0]).filename}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── TEXT / HTML CONTENT ──────────────────────────────────── */}
            {hasContent && (
              <div className="mt-8">
                <div className="premium-card rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-ink mb-4">Lesson content</h2>
                  {htmlContent ? (
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

            {/* ── AUDIO RESOURCES ─────────────────────────────────────── */}
            {audioResources.length > 0 && (
              <div className="mt-6 space-y-3">
                {audioResources.map((r) => (
                  <div key={r.url} className="premium-card rounded-xl p-4">
                    <p className="mb-2 text-xs font-semibold text-ink">🎵 {r.filename}</p>
                    <audio controls preload="metadata" className="w-full">
                      <source src={r.url} type={r.mimeType ?? "audio/mpeg"} />
                    </audio>
                  </div>
                ))}
              </div>
            )}

            {/* ── OTHER DOWNLOADABLE FILES ─────────────────────────────── */}
            {otherResources.length > 0 && (
              <div className="mt-6 premium-card-soft rounded-xl p-5">
                <h3 className="mb-3 text-sm font-semibold text-ink">Downloads</h3>
                <div className="space-y-2">
                  {otherResources.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      download
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-[#1166c8]/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📎</span>
                        <div>
                          <p className="text-sm font-medium text-ink">{r.filename}</p>
                          {r.filesize > 0 && <p className="text-xs text-muted">{formatBytes(r.filesize)}</p>}
                        </div>
                      </div>
                      <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-ink">Download</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── PLACEHOLDER when nothing to show ────────────────────── */}
            {!hasContent && videoInfo.type === "none" && pdfResources.length === 0 && (
              <>
                {lesson.type === "assessment" && (
                  <div className="mt-8 premium-card rounded-xl p-6 text-center">
                    <p className="text-3xl mb-3">📝</p>
                    <h2 className="text-lg font-semibold text-ink mb-2">Assessment</h2>
                    <p className="text-sm text-muted">Complete the assessment below to test your knowledge and earn points.</p>
                  </div>
                )}
                {lesson.type === "vr-practice" && (
                  <div className="mt-8 premium-card rounded-xl p-6 text-center">
                    <p className="text-3xl mb-3">🥽</p>
                    <h2 className="text-lg font-semibold text-ink mb-2">VR Practice</h2>
                    <p className="text-sm text-muted">Launch the VR simulation to practise your skills in a real-world scenario.</p>
                  </div>
                )}
                {lesson.type === "text" && (
                  <div className="mt-8 premium-card-soft rounded-xl p-6 text-center">
                    <p className="text-sm text-muted">Content is being loaded. Please check back shortly.</p>
                    <p className="mt-1 text-xs text-muted font-mono">{lesson.slug}</p>
                  </div>
                )}
              </>
            )}

            {/* ── ACTIONS ──────────────────────────────────────────────── */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                {assessment && (
                  <Link href={`/assessment/${assessment.slug}`}
                    className="rounded-lg bg-[#1166c8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d55b0]">
                    📝 Take Assessment
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

            {/* ── PREV / NEXT ──────────────────────────────────────────── */}
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
