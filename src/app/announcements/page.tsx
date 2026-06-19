import Link from "next/link";

export const metadata = { title: "Announcements" };

const announcements = [
  {
    id: "ann-1",
    category: "Platform",
    title: "VowLMS v1.0 now live — welcome to the GoalVow Academy ecosystem",
    body: "We are proud to launch VowLMS as the official learning platform for GoalVow Holdings. All six academies — Upskilling, Skills Training, Chef Academy, Private School, Business School, and University Online — are now accessible from a single learner journey.",
    author: "GoalVow Academy Team",
    date: "19 June 2026",
    pinned: true,
    icon: "🎉",
  },
  {
    id: "ann-2",
    category: "Chef Academy",
    title: "New kitchen simulation module launching July 2026",
    body: "Chef Academy learners will have access to a new immersive kitchen simulation module featuring a WebXR-ready environment. The module covers mise en place, plating technique, and order flow. VR headset optional — full credit available on desktop.",
    author: "Chef Academy Facilitator Team",
    date: "15 June 2026",
    pinned: false,
    icon: "👨‍🍳",
  },
  {
    id: "ann-3",
    category: "VowRewards",
    title: "Double rewards points for all assessments — June 2026",
    body: "For the month of June, GoalVow is awarding 2× VowRewards points on all assessment completions. Log in, complete your pending assessments, and boost your rewards balance before 30 June 2026.",
    author: "VowRewards Team",
    date: "1 June 2026",
    pinned: false,
    icon: "⭐",
  },
  {
    id: "ann-4",
    category: "PlugConnect",
    title: "New employment pipeline: retail sector graduate intake",
    body: "PlugConnect has opened a new talent pipeline for Career Readiness Accelerator graduates. Employers are actively shortlisting learners with verified assessments and certificates. Log into the Opportunities page to see current matches.",
    author: "PlugConnect Partnership Team",
    date: "28 May 2026",
    pinned: false,
    icon: "🎯",
  },
  {
    id: "ann-5",
    category: "Learning Hubs",
    title: "Soweto Learning Hub now accepting facilitator applications",
    body: "The Soweto Learning Hub is accepting applications from qualified facilitators for July 2026 cohorts. Facilitate careers, trades, and business school courses in a supported in-person environment. Apply via the PlugConnect portal.",
    author: "Learning Hubs Coordinator",
    date: "22 May 2026",
    pinned: false,
    icon: "🏫",
  },
  {
    id: "ann-6",
    category: "Platform",
    title: "Offline access now available for all text lessons via PWA",
    body: "Learners who install the VowLMS progressive web app can now access saved lesson text offline. Progress syncs automatically when connectivity is restored. Ideal for Learning Hub sessions and low-bandwidth environments.",
    author: "GoalVow Tech Team",
    date: "10 May 2026",
    pinned: false,
    icon: "📱",
  },
  {
    id: "ann-7",
    category: "University Online",
    title: "University Online orientation cohort — July 2026 intake now open",
    body: "Register for the July 2026 orientation cohort for University Online Learning Skills. This free preparatory pathway gives you the study habits, research skills, and digital confidence to succeed in online tertiary programmes.",
    author: "University Online Faculty",
    date: "5 May 2026",
    pinned: false,
    icon: "🎓",
  },
];

const categoryColors: Record<string, string> = {
  "Platform": "bg-[#1166c8]/10 text-[#1166c8]",
  "Chef Academy": "bg-orange-100 text-orange-700",
  "VowRewards": "bg-yellow-100 text-yellow-700",
  "PlugConnect": "bg-emerald-100 text-emerald-700",
  "Learning Hubs": "bg-purple-100 text-purple-700",
  "University Online": "bg-indigo-100 text-indigo-700",
};

export default function AnnouncementsPage() {
  const pinned = announcements.filter((a) => a.pinned);
  const rest = announcements.filter((a) => !a.pinned);

  return (
    <main className="premium-page">
      <section className="premium-section-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Academy</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Announcements</h1>
          <p className="mt-4 text-lg text-white/72 max-w-2xl">
            Platform updates, academy news, double-reward periods, new opportunities, and learning hub events.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8 space-y-6">
        {pinned.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted flex items-center gap-1.5">
              <span>📌</span> Pinned
            </p>
            {pinned.map((a) => (
              <article key={a.id} className="premium-card rounded-2xl p-6 border-l-4 border-l-gold">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5 shrink-0">{a.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[a.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {a.category}
                      </span>
                      <span className="text-xs text-muted">{a.date}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-ink">{a.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{a.body}</p>
                    <p className="mt-3 text-xs text-muted">— {a.author}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Recent announcements</p>
          <div className="space-y-4">
            {rest.map((a) => (
              <article key={a.id} className="premium-card rounded-2xl p-6 transition hover:border-[#1166c8]/20">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5 shrink-0">{a.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[a.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {a.category}
                      </span>
                      <span className="text-xs text-muted">{a.date}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-ink">{a.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{a.body}</p>
                    <p className="mt-3 text-xs text-muted">— {a.author}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-muted">All GoalVow Academy announcements are archived here. Notification preferences can be managed in your <Link href="/profile" className="text-[#1166c8] hover:underline font-medium">profile settings</Link>.</p>
        </div>
      </div>
    </main>
  );
}
