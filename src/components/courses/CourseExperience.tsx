"use client";

import { useState } from "react";
import { BriefcaseBusiness, Check, GraduationCap, ListChecks, MessageSquareText, UsersRound } from "lucide-react";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { CourseReviews } from "@/components/courses/CourseReviews";
import type { Academy, Course } from "@/types/lms";

type Tab = "overview" | "curriculum" | "teaching" | "reviews";

type Props = {
  course: Course;
  academy: Academy | undefined;
  accentColor: string;
};

const tabs: Array<{ id: Tab; label: string; icon: typeof ListChecks }> = [
  { id: "overview", label: "Overview", icon: ListChecks },
  { id: "curriculum", label: "Curriculum", icon: GraduationCap },
  { id: "teaching", label: "Teaching team", icon: UsersRound },
  { id: "reviews", label: "Reviews", icon: MessageSquareText },
];

export function CourseExperience({ course, academy, accentColor }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <section className="border-y border-slate-200 bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="scrollbar-none -mx-5 overflow-x-auto border-b border-slate-200 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" role="tablist" aria-label="Course information">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => {
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
                <BriefcaseBusiness aria-hidden="true" className="h-6 w-6" style={{ color: accentColor }} />
                <h2 className="mt-4 text-xl font-semibold text-ink">Opportunity pathways</h2>
                <ul className="mt-4 space-y-3">
                  {course.opportunityPathways.map((pathway) => (
                    <li key={pathway} className="text-sm leading-6 text-muted">{pathway}</li>
                  ))}
                </ul>
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
              <CourseCurriculum modules={course.modules} accentColor={accentColor} />
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
