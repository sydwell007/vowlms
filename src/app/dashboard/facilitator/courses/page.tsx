import Link from "next/link";
import { DashboardShell } from "@/components/dashboards/DashboardShell";
import { getCourses } from "@/lib/data";

export const metadata = { title: "My Courses | Facilitator" };

const learnerProgress = [
  { name: "Amina Mokoena", progress: 68, lastActive: "Today", course: "Career Readiness Accelerator", assessment: "87%", grade: "B+" },
  { name: "Sipho Dlamini", progress: 80, lastActive: "Yesterday", course: "Digital Workplace Essentials", assessment: "92%", grade: "A" },
  { name: "Zanele Mahlangu", progress: 45, lastActive: "3 days ago", course: "Digital Workplace Essentials", assessment: "Not attempted", grade: "—" },
  { name: "Mpho Modise", progress: 30, lastActive: "1 week ago", course: "Career Readiness Accelerator", assessment: "55%", grade: "F" },
  { name: "Nokwanda Zulu", progress: 60, lastActive: "2 days ago", course: "Career Readiness Accelerator", assessment: "76%", grade: "B" },
];

export default function FacilitatorCoursesPage() {
  const allCourses = getCourses().slice(0, 4);

  const metrics = [
    { label: "Assigned courses", value: "4", detail: "Active this term" },
    { label: "Total learners", value: "248", detail: "Across all courses" },
    { label: "Avg. assessment score", value: "76%", detail: "Latest cohort" },
    { label: "Completion rate", value: "32%", detail: "Courses fully finished" },
  ];

  return (
    <DashboardShell
      role="facilitator"
      title="My Courses"
      description="Manage your assigned courses, track learner progress, and review assessment performance."
      metrics={metrics}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Assigned courses</h2>
            <Link href="/dashboard/facilitator" className="text-sm font-medium text-[#1166c8] hover:underline">
              ← Dashboard
            </Link>
          </div>
          {allCourses.map((course) => {
            const enrolledCount = learnerProgress.filter((l) => l.course === course.title).length;
            const avgProgress = enrolledCount > 0
              ? Math.round(learnerProgress.filter((l) => l.course === course.title).reduce((acc, l) => acc + l.progress, 0) / enrolledCount)
              : 0;

            return (
              <article key={course.slug} className="premium-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1166c8]">{course.academySlug.replace(/-/g, " ")}</p>
                    <h3 className="mt-1 text-base font-semibold text-ink">{course.title}</h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shrink-0">Published</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="premium-card-soft rounded-lg p-3">
                    <p className="text-lg font-semibold text-ink">{enrolledCount || ((course.slug.length * 7) % 60) + 20}</p>
                    <p className="text-[10px] text-muted">Learners</p>
                  </div>
                  <div className="premium-card-soft rounded-lg p-3">
                    <p className="text-lg font-semibold text-ink">{avgProgress || 58}%</p>
                    <p className="text-[10px] text-muted">Avg progress</p>
                  </div>
                  <div className="premium-card-soft rounded-lg p-3">
                    <p className="text-lg font-semibold text-ink">82%</p>
                    <p className="text-[10px] text-muted">Pass rate</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/courses/${course.slug}/discussion`}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-slate-50">
                    Discussion
                  </Link>
                  <Link href={`/courses/${course.slug}/assignments`}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-slate-50">
                    Assignments
                  </Link>
                  <button className="rounded-md bg-[#1166c8]/10 px-3 py-1.5 text-xs font-semibold text-[#1166c8] transition hover:bg-[#1166c8]/20">
                    Grade learners
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Learner progress sidebar */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">Learner progress</h2>
          {learnerProgress.map((learner) => (
            <div key={learner.name} className="premium-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-black text-[#06111f]">
                  {learner.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{learner.name}</p>
                  <p className="text-[10px] text-muted truncate">{learner.course}</p>
                </div>
                <span className={`text-xs font-semibold shrink-0 ${learner.grade === "A" ? "text-emerald-600" : learner.grade === "F" ? "text-red-600" : learner.grade === "—" ? "text-muted" : "text-[#1166c8]"}`}>
                  {learner.grade}
                </span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-[#1166c8] to-[#20c7ff]" style={{ width: `${learner.progress}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between">
                <span className="text-[10px] text-muted">{learner.progress}% complete</span>
                <span className="text-[10px] text-muted">{learner.lastActive}</span>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </DashboardShell>
  );
}
