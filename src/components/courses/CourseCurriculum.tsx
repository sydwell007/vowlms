"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  Glasses,
  GraduationCap,
  LayoutGrid,
  List,
  Milestone,
  Play,
  type LucideIcon,
} from "lucide-react";
import type { CourseModule } from "@/types/lms";
import {
  formatDuration,
  getModuleDescription,
  getModuleOutcome,
  getModuleStats,
} from "@/lib/course-content";
import { getModuleImageSrc } from "@/lib/module-images";

type Props = {
  modules: CourseModule[];
  accentColor?: string;
  courseSlug?: string;
};

const LESSON_ICON: Record<string, LucideIcon> = {
  "vr-practice": Glasses,
  assessment: ClipboardCheck,
  video: Play,
  text: FileText,
};

export function CourseCurriculum({ modules, accentColor = "#1166c8", courseSlug }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [view, setView] = useState<"list" | "tiles">("list");
  const allOpen = expanded.size === modules.length;

  function toggle(order: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
  }

  function toggleAll() {
    setExpanded(allOpen ? new Set() : new Set(modules.map((m) => m.order)));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div
          className="relative inline-flex w-44 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold sm:w-48 sm:text-sm"
          role="group"
          aria-label="Module view"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-transform duration-300 ease-out ${view === "tiles" ? "translate-x-full" : "translate-x-0"}`}
            style={{ backgroundColor: accentColor }}
          />
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors ${view === "list" ? "text-white" : "text-muted hover:text-ink"}`}
          >
            <List aria-hidden="true" className="h-3.5 w-3.5" /> List
          </button>
          <button
            type="button"
            onClick={() => setView("tiles")}
            aria-pressed={view === "tiles"}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors ${view === "tiles" ? "text-white" : "text-muted hover:text-ink"}`}
          >
            <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" /> Tiles
          </button>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="text-sm font-semibold transition hover:opacity-80"
          style={{ color: accentColor }}
        >
          {allOpen ? "Collapse all modules" : "Expand all modules"}
        </button>
      </div>

      <div className={view === "tiles" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
        {modules.map((moduleItem) => {
          const isOpen = expanded.has(moduleItem.order);
          const stats = getModuleStats(moduleItem);
          const description = getModuleDescription(moduleItem);
          const outcome = getModuleOutcome(moduleItem);
          const panelId = `module-panel-${moduleItem.order}`;
          const moduleImageSrc = courseSlug ? getModuleImageSrc(courseSlug, moduleItem.order) : null;

          const statChips = (
            <>
              <span className="flex items-center gap-1.5"><BookOpen aria-hidden="true" className="h-3.5 w-3.5" /> {stats.lessonCount} lesson{stats.lessonCount === 1 ? "" : "s"}</span>
              <span className="flex items-center gap-1.5"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> {formatDuration(stats.totalMinutes)}</span>
              {stats.hasAssessment ? <span className="flex items-center gap-1.5"><ClipboardCheck aria-hidden="true" className="h-3.5 w-3.5" /> Assessment</span> : null}
              {stats.hasVRPractice ? <span className="flex items-center gap-1.5"><Glasses aria-hidden="true" className="h-3.5 w-3.5" /> VR practice</span> : null}
            </>
          );

          return (
            <article
              key={moduleItem.title}
              className={`premium-card overflow-hidden rounded-lg ${view === "tiles" ? "flex flex-col" : ""}`}
            >
              {view === "tiles" ? (
                <button
                  type="button"
                  onClick={() => toggle(moduleItem.order)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group block w-full text-left"
                >
                  <span className="relative block aspect-[3/2] w-full overflow-hidden bg-slate-100">
                    {moduleImageSrc ? (
                      <Image
                        src={moduleImageSrc}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
                      >
                        <Milestone aria-hidden="true" className="h-14 w-14 text-white/30" />
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-300 group-hover:from-black/85" />
                    <span
                      className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] shadow-sm"
                      style={{ color: accentColor }}
                    >
                      Module {moduleItem.order}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-4">
                      <span className="line-clamp-2 text-base font-semibold leading-tight text-white sm:text-lg">
                        {moduleItem.title}
                      </span>
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <span className="line-clamp-3 text-sm leading-6 text-muted">{description}</span>
                    <span className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-medium text-muted">{statChips}</span>
                    <span
                      className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold"
                      style={{ color: accentColor }}
                    >
                      {isOpen ? "Hide lessons" : "View lessons"}
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(moduleItem.order)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group flex w-full items-stretch text-left transition hover:bg-[#f5f9ff]"
                >
                  <span className="relative w-24 shrink-0 overflow-hidden bg-slate-100 sm:w-52">
                    {moduleImageSrc ? (
                      <Image
                        src={moduleImageSrc}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 208px, 96px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: `${accentColor}18`, color: accentColor }}
                      >
                        <Milestone aria-hidden="true" className="h-6 w-6 sm:h-8 sm:w-8" />
                      </span>
                    )}
                  </span>

                  <div className="flex min-w-0 flex-1 items-start gap-3 p-5 sm:gap-5 sm:p-6">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
                        Module {moduleItem.order}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-ink sm:text-xl">{moduleItem.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-muted">{statChips}</div>
                    </div>

                    <ChevronDown
                      className={`mt-1 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              )}

              {/* Smooth CSS-only accordion (grid-template-rows trick) */}
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6">
                    <p className="mb-4 flex items-start gap-2 text-sm text-ink">
                      <GraduationCap aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accentColor }} />
                      <span><span className="font-semibold">You&apos;ll be able to:</span> {outcome}</span>
                    </p>
                    <div className="space-y-2">
                      {moduleItem.lessons.map((lesson) => {
                        const LessonIcon = LESSON_ICON[lesson.type] ?? FileText;
                        return (
                          <div
                            key={lesson.slug}
                            className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-sm font-medium text-ink last:border-b-0"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <LessonIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                              <span>{lesson.title}</span>
                            </div>
                            <span className="shrink-0 text-xs text-muted">{lesson.durationMinutes} min</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-xs text-muted">
                      Enrol to unlock these lessons and start learning.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
