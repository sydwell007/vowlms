"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  Glasses,
  GraduationCap,
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

type Props = {
  modules: CourseModule[];
  accentColor?: string;
};

const LESSON_ICON: Record<string, LucideIcon> = {
  "vr-practice": Glasses,
  assessment: ClipboardCheck,
  video: Play,
  text: FileText,
};

export function CourseCurriculum({ modules, accentColor = "#1166c8" }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
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
      <div className="mb-5 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm font-semibold transition hover:opacity-80"
          style={{ color: accentColor }}
        >
          {allOpen ? "Collapse all modules" : "Expand all modules"}
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((moduleItem) => {
          const isOpen = expanded.has(moduleItem.order);
          const stats = getModuleStats(moduleItem);
          const description = getModuleDescription(moduleItem);
          const outcome = getModuleOutcome(moduleItem);
          const panelId = `module-panel-${moduleItem.order}`;

          return (
            <article key={moduleItem.title} className="premium-card overflow-hidden rounded-lg">
              <button
                type="button"
                onClick={() => toggle(moduleItem.order)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#f5f9ff] sm:p-6"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${accentColor}18`, color: accentColor }}
                >
                  <Milestone aria-hidden="true" className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
                    Module {moduleItem.order}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink sm:text-xl">{moduleItem.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-muted">
                    <span className="flex items-center gap-1.5"><BookOpen aria-hidden="true" className="h-3.5 w-3.5" /> {stats.lessonCount} lesson{stats.lessonCount === 1 ? "" : "s"}</span>
                    <span className="flex items-center gap-1.5"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> {formatDuration(stats.totalMinutes)}</span>
                    {stats.hasAssessment ? <span className="flex items-center gap-1.5"><ClipboardCheck aria-hidden="true" className="h-3.5 w-3.5" /> Assessment</span> : null}
                    {stats.hasVRPractice ? <span className="flex items-center gap-1.5"><Glasses aria-hidden="true" className="h-3.5 w-3.5" /> VR practice</span> : null}
                  </div>
                </div>

                <ChevronDown
                  className={`mt-1 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

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
