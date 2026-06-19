"use client";

import { useState } from "react";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  type: "live-session" | "deadline" | "vr-session" | "orientation" | "cohort";
  date: string;
  time: string;
  host: string;
  academy: string;
  description: string;
  link?: string;
};

const events: Event[] = [
  {
    id: "e1",
    title: "Career Readiness — Live facilitator session",
    type: "live-session",
    date: "2026-06-24",
    time: "10:00 – 11:30 SAST",
    host: "Themba Nkosi",
    academy: "Upskilling Academy",
    description: "Interactive Q&A session covering CV building, interview skills, and PlugConnect opportunity matching.",
    link: "/lesson/career-readiness-accelerator-orientation",
  },
  {
    id: "e2",
    title: "Assessment deadline: Solar Installation Module 1",
    type: "deadline",
    date: "2026-06-27",
    time: "23:59 SAST",
    host: "System",
    academy: "Skills Training Academy",
    description: "Final submission deadline for the Solar Installation Foundations Module 1 knowledge check.",
    link: "/assessment/solar-installation-foundations-knowledge-check",
  },
  {
    id: "e3",
    title: "Chef Academy VR kitchen simulation — Group A",
    type: "vr-session",
    date: "2026-06-28",
    time: "14:00 – 15:30 SAST",
    host: "Chef Academy Facilitators",
    academy: "Chef Academy",
    description: "Supervised VR kitchen practice for food safety and prep discipline. Desktop version available for learners without headsets.",
    link: "/vr-practice/professional-chef-foundations-vr-studio",
  },
  {
    id: "e4",
    title: "Business School — Orientation cohort July 2026",
    type: "orientation",
    date: "2026-07-01",
    time: "09:00 – 10:00 SAST",
    host: "Refilwe Tau",
    academy: "Business School",
    description: "Orientation session for all new Business School enrollments. Covers the learning platform, facilitator introductions, and pathway to SkillsShop.",
  },
  {
    id: "e5",
    title: "University Online — New learner intake and skills assessment",
    type: "cohort",
    date: "2026-07-05",
    time: "11:00 – 12:30 SAST",
    host: "University Online Faculty",
    academy: "University Online",
    description: "Welcome session and digital skills baseline assessment for July 2026 University Online cohort.",
    link: "/academies/university-online",
  },
  {
    id: "e6",
    title: "GoalVow Platform update — PWA offline access announcement",
    type: "orientation",
    date: "2026-07-10",
    time: "All day",
    host: "GoalVow Tech Team",
    academy: "All academies",
    description: "Full offline access for text lessons goes live for all learners via the VowLMS PWA. Install from your browser's install prompt.",
  },
];

const typeStyles: Record<Event["type"], { color: string; label: string; icon: string }> = {
  "live-session": { color: "bg-[#1166c8]/10 text-[#1166c8] border-[#1166c8]/20", label: "Live session", icon: "📹" },
  "deadline": { color: "bg-red-100 text-red-700 border-red-200", label: "Deadline", icon: "⏰" },
  "vr-session": { color: "bg-purple-100 text-purple-700 border-purple-200", label: "VR session", icon: "🥽" },
  "orientation": { color: "bg-gold/15 text-yellow-700 border-yellow-200", label: "Orientation", icon: "🎓" },
  "cohort": { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Cohort", icon: "👥" },
};

export default function CalendarPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  // Group by month-year
  const grouped = filtered.reduce<Record<string, Event[]>>((acc, event) => {
    const d = new Date(event.date);
    const key = d.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <main className="premium-page">
      <section className="premium-section-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Academy</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Learning Calendar</h1>
          <p className="mt-4 text-lg text-white/72 max-w-2xl">
            Upcoming live sessions, assessment deadlines, VR practice sessions, cohort orientations, and platform events.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: "all", label: "All events" },
            { key: "live-session", label: "Live sessions" },
            { key: "deadline", label: "Deadlines" },
            { key: "vr-session", label: "VR sessions" },
            { key: "orientation", label: "Orientations" },
            { key: "cohort", label: "Cohorts" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === key ? "bg-[#06111f] text-white" : "border border-slate-200 bg-white text-muted hover:text-ink"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Events grouped by month */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <div key={month}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted mb-4">{month}</h2>
              <div className="space-y-3">
                {monthEvents.map((event) => {
                  const style = typeStyles[event.type];
                  const d = new Date(event.date);
                  return (
                    <article key={event.id} className="premium-card flex gap-4 rounded-2xl p-5 transition hover:border-[#1166c8]/20">
                      {/* Date */}
                      <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50 px-3 py-2 text-center min-w-[52px]">
                        <p className="text-xs font-semibold uppercase text-muted">{d.toLocaleDateString("en", { month: "short" })}</p>
                        <p className="text-2xl font-black text-ink">{d.getDate()}</p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.color}`}>
                            {style.icon} {style.label}
                          </span>
                          <span className="text-xs text-muted">{event.academy}</span>
                        </div>
                        <h3 className="font-semibold text-ink">{event.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-3">
                          <p className="text-xs text-muted">{event.time}</p>
                          <p className="text-xs text-muted">Host: {event.host}</p>
                        </div>
                        <p className="mt-2 text-xs text-muted leading-5">{event.description}</p>
                        {event.link && (
                          <Link href={event.link} className="mt-2 inline-block text-xs font-semibold text-[#1166c8] hover:underline">
                            Open →
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-lg font-semibold text-ink">No events in this category</p>
          </div>
        )}
      </div>
    </main>
  );
}
