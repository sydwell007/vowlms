import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Skills Practice - VowLMS",
  description: "Explore current VowLMS practice previews and the planned GoalVow Skills Practice model.",
};

const practiceTypes = [
  {
    icon: "🏫",
    title: "Learning Hub model",
    desc: "Review the proposed partner model for supported access and selected practical activities. No public locations are confirmed yet.",
    href: "/learning-hubs",
    color: "#06b6d4",
  },
  {
    icon: "🥽",
    title: "Simulation previews",
    desc: "Use the current guided practice preview where a course includes one. Full WebXR simulation environments remain in development.",
    href: "/vr-practice",
    color: "#8b5cf6",
  },
  {
    icon: "👤",
    title: "Facilitated practical work",
    desc: "A planned workflow for approved, supervised tasks with clear evidence and assessment requirements.",
    href: "/vowsupport",
    color: "#19c37d",
  },
  {
    icon: "📋",
    title: "Account-owned practice records",
    desc: "Submitted practice attempts must belong to an enrolled learner and are stored separately from rewards and certificates.",
    href: "/dashboard/learner",
    color: "#1e3a8a",
  },
];

const vrScenarios = [
  { icon: "🍳", label: "Kitchen safety", academy: "Chef Academy" },
  { icon: "🤝", label: "Workplace ethics", academy: "Upskilling" },
  { icon: "💼", label: "Business negotiation", academy: "Business School" },
  { icon: "🧑‍🏫", label: "Teaching simulation", academy: "Private School" },
  { icon: "🔧", label: "Trade skill practice", academy: "Skills Training" },
  { icon: "📊", label: "Financial planning", academy: "University Online" },
];

export default function PracticePage() {
  return (
    <main>
      {/* Hero */}
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-purple-300">
            Step 2 of 3
          </div>
          <h1 className="mt-2 text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">Practice</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Explore the current practice-preview experience and the controls needed before simulations, facilitated tasks, or partner venues can produce trusted evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/vr-practice" variant="primary">Explore Skills Practice</ButtonLink>
            <ButtonLink href="/innovation-labs" variant="secondary">Development roadmap</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.vrPracticeLab}
            alt="Concept image for GoalVow Skills Practice and simulation development"
            priority
            aspect="video"
          />
        </div>
      </section>

      {/* Practice types */}
      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Ways to practice</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {practiceTypes.map((p) => (
              <Link key={p.title} href={p.href}>
                <article className="gv-card h-full rounded-xl p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(30,58,138,0.1)]">
                  <span className="text-4xl">{p.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold" style={{ color: p.color }}>{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{p.desc}</p>
                  <p className="mt-4 text-xs font-semibold" style={{ color: p.color }}>Explore →</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VR scenarios */}
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#06b6d4]">Innovation Labs</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Potential Skills Practice contexts</h2>
          <p className="mt-2 text-sm text-muted">These are design directions, not claims that a production simulation is available for every academy.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {vrScenarios.map((s) => (
              <div key={s.label} className="gv-card rounded-xl p-5 text-center">
                <span className="text-3xl">{s.icon}</span>
                <p className="mt-3 text-sm font-semibold text-ink">{s.label}</p>
                <p className="mt-1 text-xs text-muted">{s.academy}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            VR simulations are in development via{" "}
            <Link href="/innovation-labs" className="text-[#06b6d4] hover:underline font-semibold">
              GoalVow Innovation Labs
            </Link>.
          </p>
        </div>
      </section>

      {/* L→P→A nav */}
      <section className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <Link href="/learn" className="text-left">
            <p className="text-xs text-muted">Previous step</p>
            <p className="text-base font-semibold text-ink hover:text-[#1e3a8a] transition">← 01 · Learn</p>
          </Link>
          <div className="text-center">
            <p className="text-xs text-muted">You are here</p>
            <p className="text-base font-bold text-[#8b5cf6]">02 · Practice</p>
          </div>
          <Link href="/apply" className="text-right">
            <p className="text-xs text-muted">Next step</p>
            <p className="text-base font-semibold text-ink hover:text-[#f97316] transition">03 · Apply →</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
