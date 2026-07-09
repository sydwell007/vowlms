import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAcademies, getCourses } from "@/lib/data";

export const metadata = {
  title: "Learn · GoalVow Academies",
  description: "Start learning across 6 GoalVow academies. 614+ courses in upskilling, trades, culinary, school, business, and university pathways.",
};

const studyModes = [
  { icon: "💻", title: "Online Self-Paced", desc: "Study at your own speed, on any device. Complete lessons, take assessments, and earn certificates on your schedule." },
  { icon: "🏫", title: "Learning Hub Access", desc: "Join a community learning hub for device access, mentoring, printing, and in-person guidance from facilitators." },
  { icon: "🎥", title: "Video Lessons", desc: "Watch expert-led video lessons embedded directly in the course flow — no external platform needed." },
  { icon: "📝", title: "Structured Assessments", desc: "Test your knowledge with multiple-choice and scenario assessments. Earn VowRewards on every pass." },
];

export default function LearnPage() {
  const academies = getAcademies();
  const courses = getCourses();

  return (
    <main>
      {/* Hero */}
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-cyan-300">
            Step 1 of 3
          </div>
          <h1 className="mt-2 text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Learn</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Structured online learning across 6 GoalVow academies. Guided pathways, video lessons, assessments, and flexible study environments designed for real-world outcomes.
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/50">
            <span>{courses.length}+ courses</span>
            <span>·</span>
            <span>{academies.length} academies</span>
            <span>·</span>
            <span>Earn VowRewards on every step</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/courses" variant="primary">Browse all courses</ButtonLink>
            <ButtonLink href="/catalogue" variant="secondary">Course catalogue</ButtonLink>
          </div>
        </div>
      </section>

      {/* Study modes */}
      <section className="border-y border-slate-100 bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">How you can study</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studyModes.map((m) => (
              <div key={m.title} className="gv-card rounded-xl p-5">
                <span className="text-3xl">{m.icon}</span>
                <h3 className="mt-3 text-sm font-semibold text-ink">{m.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academies */}
      <section className="gv-section-blue py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Choose your academy pathway</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {academies.map((a) => (
              <Link
                key={a.slug}
                href={`/academies/${a.slug}`}
                className="gv-card rounded-xl p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(30,58,138,0.1)]"
              >
                <h3 className="text-base font-semibold text-[#1e3a8a]">{a.name}</h3>
                <p className="mt-2 text-sm leading-5 text-muted">{a.description}</p>
                <p className="mt-4 text-xs font-semibold text-[#06b6d4]">Enrol now →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learn → Practice → Apply nav */}
      <section className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs text-muted">You are here</p>
            <p className="text-base font-bold text-[#1e3a8a]">01 · Learn</p>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <span className="text-muted">→</span>
          </div>
          <Link href="/practice" className="text-right">
            <p className="text-xs text-muted">Next step</p>
            <p className="text-base font-semibold text-ink hover:text-[#06b6d4] transition">02 · Practice →</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
