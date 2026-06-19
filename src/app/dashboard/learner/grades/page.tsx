import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";

export const metadata = { title: "Grades & Results" };

const grades = [
  {
    course: "Career Readiness Accelerator",
    courseSlug: "career-readiness-accelerator",
    academy: "Upskilling Academy",
    assessments: [
      { title: "Knowledge Check", score: 87, passMark: 70, passed: true, attempts: 1, date: "12 June 2026" },
    ],
    overallProgress: 68,
    status: "In progress",
  },
  {
    course: "Small Business Launchpad",
    courseSlug: "small-business-launchpad",
    academy: "Business School",
    assessments: [
      { title: "Business Fundamentals Assessment", score: 55, passMark: 70, passed: false, attempts: 1, date: "5 June 2026" },
      { title: "Business Fundamentals Assessment", score: 78, passMark: 70, passed: true, attempts: 2, date: "9 June 2026" },
    ],
    overallProgress: 42,
    status: "In progress",
  },
  {
    course: "Digital Workplace Essentials",
    courseSlug: "digital-workplace-essentials",
    academy: "Upskilling Academy",
    assessments: [
      { title: "Digital Readiness Check", score: 91, passMark: 70, passed: true, attempts: 1, date: "20 May 2026" },
    ],
    overallProgress: 100,
    status: "Completed",
  },
];

export default function GradesPage() {
  const metrics = [
    { label: "Courses active", value: "2", detail: "Currently enrolled" },
    { label: "Avg. score", value: "75%", detail: "Across all assessments" },
    { label: "Pass rate", value: "75%", detail: "3 of 4 attempts passed" },
    { label: "Completed", value: "1", detail: "Courses fully done" },
  ];

  return (
    <DashboardShell
      role="learner"
      title="Grades & Results"
      description="Your assessment scores, attempts, and course completion status across all enrolled courses."
      metrics={metrics}
    >
      <div className="space-y-5">
        {grades.map((g) => (
          <article key={g.courseSlug} className="premium-card rounded-2xl p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">{g.academy}</p>
                <h2 className="mt-1 text-xl font-semibold text-ink">{g.course}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${g.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-[#1166c8]/10 text-[#1166c8]"}`}>
                  {g.status}
                </span>
                <span className="text-sm font-semibold text-ink">{g.overallProgress}% complete</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-[#1166c8] to-[#20c7ff] transition-all"
                style={{ width: `${g.overallProgress}%` }}
              />
            </div>

            {/* Assessments */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-3">Assessment results</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="pb-2 pr-4 text-xs font-semibold text-muted">Assessment</th>
                      <th className="pb-2 pr-4 text-xs font-semibold text-muted">Attempt</th>
                      <th className="pb-2 pr-4 text-xs font-semibold text-muted">Score</th>
                      <th className="pb-2 pr-4 text-xs font-semibold text-muted">Pass mark</th>
                      <th className="pb-2 pr-4 text-xs font-semibold text-muted">Result</th>
                      <th className="pb-2 text-xs font-semibold text-muted">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {g.assessments.map((a, i) => (
                      <tr key={i}>
                        <td className="py-3 pr-4 font-medium text-ink">{a.title}</td>
                        <td className="py-3 pr-4 text-muted">#{a.attempts}</td>
                        <td className="py-3 pr-4">
                          <span className={`font-semibold ${a.passed ? "text-emerald-600" : "text-red-600"}`}>{a.score}%</span>
                        </td>
                        <td className="py-3 pr-4 text-muted">{a.passMark}%</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {a.passed ? "Passed" : "Failed"}
                          </span>
                        </td>
                        <td className="py-3 text-muted text-xs">{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Link href={`/courses/${g.courseSlug}`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-slate-50">
                View course →
              </Link>
              {g.status === "Completed" && (
                <Link href={`/certificates/${g.courseSlug}`}
                  className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-[#06111f] shadow-sm transition hover:bg-[#e8b830]">
                  Download certificate
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
