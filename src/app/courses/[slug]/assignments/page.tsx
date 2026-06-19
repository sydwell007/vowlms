"use client";

import { useState, use } from "react";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

type Assignment = {
  id: string;
  title: string;
  description: string;
  module: string;
  dueDate: string;
  maxScore: number;
  status: "pending" | "submitted" | "graded";
  score?: number;
  feedback?: string;
};

const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Career Readiness Action Plan",
    description: "Create a 2-page personal action plan covering your CV goals, target industries, and 3 interview preparation steps. Use the provided GoalVow template from the lesson resources.",
    module: "Foundation readiness",
    dueDate: "30 June 2026",
    maxScore: 100,
    status: "submitted",
    score: undefined,
    feedback: undefined,
  },
  {
    id: "a2",
    title: "PlugConnect Profile Draft",
    description: "Complete your PlugConnect learner profile draft by filling in your skills, experience, and preferred opportunity types. Submit a screenshot or exported PDF of the completed profile.",
    module: "Applied practice pathway",
    dueDate: "15 July 2026",
    maxScore: 100,
    status: "pending",
  },
  {
    id: "a3",
    title: "Mock Interview Recording (3 min)",
    description: "Record a 3-minute video of yourself answering two standard interview questions: 'Tell me about yourself' and 'What are your strengths?' Upload via the file upload below.",
    module: "Applied practice pathway",
    dueDate: "20 July 2026",
    maxScore: 100,
    status: "graded",
    score: 82,
    feedback: "Excellent eye contact and clear structure. Your 'Tell me about yourself' was concise. For improvement: slow down slightly during the strengths section and add a specific example.",
  },
];

const statusStyles = {
  pending: "bg-slate-100 text-slate-600",
  submitted: "bg-[#1166c8]/10 text-[#1166c8]",
  graded: "bg-emerald-100 text-emerald-700",
};

export default function AssignmentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [fileInputs, setFileInputs] = useState<Record<string, string>>({});

  async function submitAssignment(id: string) {
    setSubmitting(id);
    await new Promise((r) => setTimeout(r, 1000));
    setAssignments((as) => as.map((a) => a.id === id ? { ...a, status: "submitted" as const } : a));
    setSubmitting(null);
  }

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-muted">
          <Link href="/courses" className="hover:text-ink">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${slug}`} className="hover:text-ink">{course.title}</Link>
          <span>/</span>
          <span className="text-ink font-medium">Assignments</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Assignments</h1>
            <p className="mt-1 text-sm text-muted">{course.title} · {assignments.length} assignments</p>
          </div>
          <Link href={`/courses/${slug}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50">
            ← Back to course
          </Link>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total", value: assignments.length, color: "text-ink" },
            { label: "Submitted", value: assignments.filter((a) => a.status === "submitted" || a.status === "graded").length, color: "text-[#1166c8]" },
            { label: "Graded", value: assignments.filter((a) => a.status === "graded").length, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="premium-card rounded-xl p-4 text-center">
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {assignments.map((assignment) => (
            <article key={assignment.id} className="premium-card rounded-2xl p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[assignment.status]}`}>
                      {assignment.status}
                    </span>
                    <span className="text-xs text-muted">{assignment.module}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-ink">{assignment.title}</h2>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted">Due: {assignment.dueDate}</p>
                  <p className="text-xs font-semibold text-ink">{assignment.maxScore} marks</p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted">{assignment.description}</p>

              {/* Graded result */}
              {assignment.status === "graded" && assignment.score !== undefined && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-emerald-800">Facilitator feedback</p>
                    <p className="text-lg font-black text-emerald-700">{assignment.score}/{assignment.maxScore}</p>
                  </div>
                  <p className="text-xs leading-5 text-emerald-800">{assignment.feedback}</p>
                </div>
              )}

              {/* Submission form */}
              {assignment.status === "pending" && (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-ink mb-3">Submit your assignment</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-1">Upload file (PDF, DOCX, MP4 — max 50MB)</label>
                      <input type="file" accept=".pdf,.docx,.mp4,.png,.jpg"
                        onChange={(e) => setFileInputs((f) => ({ ...f, [assignment.id]: e.target.files?.[0]?.name ?? "" }))}
                        className="block text-xs text-muted file:mr-3 file:rounded-md file:border file:border-slate-200 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-1">Comments (optional)</label>
                      <textarea rows={2} placeholder="Add a note for your facilitator…"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-ink placeholder:text-muted focus:border-[#1166c8] focus:outline-none focus:ring-2 focus:ring-[#1166c8]/20 transition resize-none" />
                    </div>
                    <button
                      onClick={() => submitAssignment(assignment.id)}
                      disabled={submitting === assignment.id}
                      className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-[#06111f] shadow-sm transition hover:bg-[#e8b830] disabled:opacity-60"
                    >
                      {submitting === assignment.id ? "Submitting…" : "Submit assignment"}
                    </button>
                  </div>
                </div>
              )}

              {assignment.status === "submitted" && (
                <div className="mt-4 rounded-xl border border-[#1166c8]/20 bg-[#f0f7ff] p-4">
                  <p className="text-sm font-semibold text-[#1166c8]">✓ Submitted — awaiting facilitator review</p>
                  <p className="mt-1 text-xs text-muted">You&apos;ll receive a notification when your assignment is graded.</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
