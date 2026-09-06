"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Check,
  ChevronDown,
  Clapperboard,
  GraduationCap,
  ListChecks,
  MessageSquareText,
  Rocket,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { CourseReviews } from "@/components/courses/CourseReviews";
import { CourseTrailer } from "@/components/courses/CourseTrailer";
import { getModuleOutcome, getModuleTopics } from "@/lib/course-content";
import { getLessonPreviewBlurb, withLessonNumber } from "@/lib/lesson-preview";
import type { Academy, Course } from "@/types/lms";

type Tab = "overview" | "curriculum" | "preview" | "teaching" | "reviews";
type PathwayKey = "employment" | "entrepreneurship" | "furtherStudy";

type Props = {
  course: Course;
  academy: Academy | undefined;
  accentColor: string;
};

const tabs: Array<{ id: Tab; label: string; icon: typeof ListChecks }> = [
  { id: "overview", label: "Overview", icon: ListChecks },
  { id: "curriculum", label: "Curriculum", icon: GraduationCap },
  { id: "preview", label: "Course Preview", icon: Clapperboard },
  { id: "teaching", label: "Teaching team", icon: UsersRound },
  { id: "reviews", label: "Reviews", icon: MessageSquareText },
];

const pathwayMeta: Array<{ key: PathwayKey; label: string; icon: typeof Briefcase; blurb: string }> = [
  { key: "employment", label: "Employment", icon: Briefcase, blurb: "Real jobs this course prepares you for" },
  { key: "entrepreneurship", label: "Entrepreneurship", icon: Rocket, blurb: "Business ideas you could start with this skill" },
  { key: "furtherStudy", label: "Further study", icon: GraduationCap, blurb: "Where to take this further" },
];

export function CourseExperience({ course, academy, accentColor }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [openPathway, setOpenPathway] = useState<PathwayKey | null>("employment");
  const [openOutlineModule, setOpenOutlineModule] = useState<number | null>(course.modules[0]?.order ?? null);

  // Course Preview is marketing/sales content only authored for the 20
  // Upskilling Academy courses today — the tab simply doesn't exist elsewhere.
  const visibleTabs = tabs.filter((tab) => tab.id !== "preview" || Boolean(course.coursePreview));

  return (
    <section className="border-y border-slate-200 bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="scrollbar-none -mx-5 overflow-x-auto border-b border-slate-200 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" role="tablist" aria-label="Course information">
          <div className="flex min-w-max gap-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`course-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`course-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative inline-flex min-h-12 items-center gap-2 px-4 text-sm font-semibold transition ${selected ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {tab.label}
                  {selected ? <span className="absolute inset-x-3 bottom-0 h-0.5" style={{ backgroundColor: accentColor }} /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-9">
          {activeTab === "overview" ? (
            <div id="course-panel-overview" role="tabpanel" aria-labelledby="course-tab-overview" className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Course outcomes</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">What you will learn</h2>
                <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {course.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}16`, color: accentColor }}>
                        <Check aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <p className="text-sm leading-6 text-muted">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="border-l-2 border-slate-200 pl-6">
                <h2 className="text-xl font-semibold text-ink">Opportunity pathways</h2>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  Click a pathway to see what {course.title} specifically leads to.
                </p>

                <div className="mt-4 space-y-2.5">
                  {pathwayMeta.map(({ key, label, icon: Icon, blurb }) => {
                    const items = course.opportunityPathways[key];
                    const isOpen = openPathway === key;
                    return (
                      <div key={key} className="overflow-hidden rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setOpenPathway(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          aria-controls={`pathway-panel-${key}`}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${accentColor}16`, color: accentColor }}
                            >
                              <Icon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-ink">{label}</span>
                              <span className="block truncate text-xs text-muted">{blurb}</span>
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-muted">
                              {items.length}
                            </span>
                            <ChevronDown
                              aria-hidden="true"
                              className={`h-4 w-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </span>
                        </button>

                        {isOpen ? (
                          <div id={`pathway-panel-${key}`} className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                            <ul className="space-y-2">
                              {items.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-muted">
                                  <span
                                    aria-hidden="true"
                                    className="mt-2.5 h-1 w-1 shrink-0 rounded-full"
                                    style={{ backgroundColor: accentColor }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                            {key === "employment" ? (
                              <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-muted">
                                Matching live roles from{" "}
                                <Link href="/opportunities" className="font-semibold underline underline-offset-2 hover:text-ink">
                                  PlugConnect
                                </Link>{" "}
                                are coming soon for this course.
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          ) : null}

          {activeTab === "curriculum" ? (
            <div id="course-panel-curriculum" role="tabpanel" aria-labelledby="course-tab-curriculum">
              <div className="mb-7 max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Curriculum</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">A clear path from start to completion</h2>
                <p className="mt-3 text-sm leading-6 text-muted">Open a module to preview its lessons. Enrolment unlocks the complete learning experience.</p>
              </div>
              <CourseCurriculum modules={course.modules} accentColor={accentColor} courseSlug={course.slug} />
            </div>
          ) : null}

          {activeTab === "preview" && course.coursePreview ? (
            <div id="course-panel-preview" role="tabpanel" aria-labelledby="course-tab-preview" className="space-y-12">
              <CourseTrailer course={course} academyCategory={academy?.category ?? "upskilling"} academyName={academy?.name} />

              <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Course description</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink">{course.title}</h2>
                  <p className="mt-4 text-base leading-7 text-muted">{course.description}</p>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Course purpose</p>
                  <p className="mt-2 text-base leading-7 text-ink">{course.coursePreview.purpose}</p>
                </div>

                <aside className="rounded-xl p-6" style={{ backgroundColor: `${accentColor}0d` }}>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                    <Sparkles aria-hidden="true" className="h-5 w-5" style={{ color: accentColor }} />
                    Why this course is worth your time
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {course.coursePreview.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6 text-ink">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                          <Check aria-hidden="true" className="h-3 w-3" />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Course outline</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">Everything you&apos;ll walk away with</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                  Open a module to see exactly what each lesson inside it teaches you.
                </p>

                <div className="mt-6 space-y-3">
                  {course.modules.map((moduleItem) => {
                    const isOpen = openOutlineModule === moduleItem.order;
                    const outcome = getModuleOutcome(moduleItem);
                    const lessons = getModuleTopics(moduleItem, moduleItem.lessons.length);
                    const panelId = `outline-panel-${moduleItem.order}`;

                    return (
                      <div key={moduleItem.title} className="overflow-hidden rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setOpenOutlineModule(isOpen ? null : moduleItem.order)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: accentColor }}>
                              Module {moduleItem.order}
                            </p>
                            <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">{moduleItem.title}</h3>
                            <p className="mt-1.5 text-sm leading-6 text-muted">
                              <span className="font-semibold text-ink">You&apos;ll be able to:</span> {outcome}
                            </p>
                          </div>
                          <ChevronDown
                            aria-hidden="true"
                            className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {isOpen ? (
                          <div id={panelId} className="space-y-2.5 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                            {lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.slug} className="flex items-start gap-2.5 text-sm leading-6">
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1 w-1 shrink-0 rounded-full"
                                  style={{ backgroundColor: accentColor }}
                                />
                                <p>
                                  <span className="font-semibold text-ink">{withLessonNumber(lesson.title, lessonIndex + 1)}</span>
                                  <span className="text-muted"> — {getLessonPreviewBlurb(lesson.title)}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "teaching" ? (
            <div id="course-panel-teaching" role="tabpanel" aria-labelledby="course-tab-teaching" className="grid gap-7 lg:grid-cols-[220px_1fr]">
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-[#06111f] text-white">
                <UsersRound aria-hidden="true" className="h-12 w-12" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>{academy?.name ?? "GoalVow Academy"}</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">Academy teaching team</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                  This course is delivered through the {academy?.name ?? "GoalVow Academy"} learning pathway. Your assigned facilitator and support contacts appear in your dashboard when your cohort or supported learning session is confirmed.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink">
                  <span>Structured lesson guidance</span>
                  <span>Assessment support</span>
                  <span>Progress visibility</span>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "reviews" ? (
            <div id="course-panel-reviews" role="tabpanel" aria-labelledby="course-tab-reviews">
              <CourseReviews courseSlug={course.slug} accentColor={accentColor} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
