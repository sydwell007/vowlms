import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = {
  title: "GoalVow Ecosystem · One Platform, Eight Verticals",
  description: "Explore the full GoalVow Holdings ecosystem — academies, learning hubs, VowSupport, VowRewards, VowTools, PlugConnect, SkillsShop, ChefOrder, and Innovation Labs.",
};

const pillars = [
  {
    icon: "🎓",
    name: "Academies",
    tagline: "6 structured learning pathways",
    desc: "Upskilling, Skills Training, Chef Academy, Private School, Business School, and University Online — all sharing one learner identity and reward system.",
    href: "/academies",
    status: "Live",
    statusColor: "bg-emerald-100 text-emerald-700",
    color: "#1e3a8a",
  },
  {
    icon: "🏫",
    name: "Learning Hubs",
    tagline: "Hybrid community access points",
    desc: "Physical hubs across South Africa providing devices, mentoring, printing, study rooms, and in-person practical training — reducing the digital divide.",
    href: "/learning-hubs",
    status: "Connected",
    statusColor: "bg-blue-100 text-blue-700",
    color: "#06b6d4",
  },
  {
    icon: "🤝",
    name: "VowSupport",
    tagline: "Tutoring, mentoring & registration help",
    desc: "End-to-end learner support covering academic tutoring, career mentoring, study coaching, and administrative registration assistance.",
    href: "/vowsupport",
    status: "Built-in",
    statusColor: "bg-emerald-100 text-emerald-700",
    color: "#19c37d",
  },
  {
    icon: "⭐",
    name: "VowRewards",
    tagline: "Rewards for every learning milestone",
    desc: "VowRewards points are earned for lessons, assessments, VR sessions, and course completions — redeemable across the full GoalVow ecosystem.",
    href: "/rewards",
    status: "Built-in",
    statusColor: "bg-emerald-100 text-emerald-700",
    color: "#f5c542",
  },
  {
    icon: "🔧",
    name: "VowTools",
    tagline: "Career tools for every learner",
    desc: "CV builder, skill gap diagnostics, interview preparation, and productivity tools to help learners turn their credentials into opportunities.",
    href: "/vowtools",
    status: "Coming soon",
    statusColor: "bg-amber-100 text-amber-700",
    color: "#f97316",
  },
  {
    icon: "🔗",
    name: "PlugConnect",
    tagline: "Jobs, internships & projects",
    desc: "Verified learner achievements are matched to employer requirements, freelance projects, and entrepreneurship opportunities in the PlugConnect network.",
    href: "/opportunities",
    status: "Connected",
    statusColor: "bg-blue-100 text-blue-700",
    color: "#8b5cf6",
  },
  {
    icon: "🛍️",
    name: "SkillsShop",
    tagline: "Academy-aligned product bundles",
    desc: "Learning kits, trade tools, kitchen equipment, uniform bundles, and digital subscriptions — all aligned to specific academy pathways and redeemable with VowRewards points.",
    href: "/skillsshop",
    status: "Coming soon",
    statusColor: "bg-amber-100 text-amber-700",
    color: "#06b6d4",
  },
  {
    icon: "🍳",
    name: "ChefOrder",
    tagline: "Chef business & food ordering platform",
    desc: "A dedicated food-ordering and chef-business marketplace that creates a commercial revenue pathway for Chef Academy graduates and culinary entrepreneurs.",
    href: "/cheforder",
    status: "Coming soon",
    statusColor: "bg-amber-100 text-amber-700",
    color: "#f97316",
  },
  {
    icon: "🔬",
    name: "Innovation Labs",
    tagline: "VR/AR simulations & AI support",
    desc: "WebXR-powered skill simulations, AI-driven learning personalisation, and R&D for next-generation education technology built by the GoalVow tech team.",
    href: "/innovation-labs",
    status: "In development",
    statusColor: "bg-cyan-100 text-cyan-700",
    color: "#06b6d4",
  },
];

const dataFlow = [
  { from: "Learner enrols", to: "Academy course", via: "Platform" },
  { from: "Lesson completed", to: "VowRewards +20pts", via: "Reward engine" },
  { from: "Assessment passed", to: "Certificate issued", via: "Verify system" },
  { from: "Certificate verified", to: "PlugConnect match", via: "Opportunity router" },
  { from: "Points earned", to: "SkillsShop credit", via: "Redemption layer" },
  { from: "VR session done", to: "Skill evidence logged", via: "Innovation Labs" },
];

export default function EcosystemPage() {
  return (
    <main>
      {/* Hero */}
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            GoalVow Holdings
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            One Platform.{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Eight Verticals.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            GoalVow Holdings is Africa&apos;s Learn → Practice → Apply ecosystem — connecting academies, support systems, rewards, tools, hubs, marketplaces, and opportunity pathways into one coherent learner journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/academies" variant="primary">Explore academies</ButtonLink>
            <ButtonLink href="/investors" variant="secondary">Investor overview</ButtonLink>
          </div>
        </div>
      </section>

      {/* Journey flow */}
      <section className="border-b border-slate-100 bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#06b6d4]">How it flows</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">The GoalVow data flywheel</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dataFlow.map((flow) => (
              <div key={flow.from} className="gv-card rounded-xl p-4">
                <p className="text-sm font-semibold text-ink">{flow.from}</p>
                <div className="my-2 flex items-center gap-2 text-xs text-muted">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{flow.via}</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <p className="text-sm font-semibold text-[#1e3a8a]">→ {flow.to}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All pillars */}
      <section className="gv-section-blue py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1e3a8a]">All verticals</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Every part of the ecosystem</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <Link key={p.name} href={p.href}>
                <article className="gv-card h-full rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(30,58,138,0.12)]">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{p.icon}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold" style={{ color: p.color }}>{p.name}</h3>
                  <p className="mt-1 text-xs font-medium text-muted">{p.tagline}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{p.desc}</p>
                  <p className="mt-4 text-xs font-semibold" style={{ color: p.color }}>Learn more →</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gv-section-dark py-16 text-white">
        <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-6">
          <h2 className="text-3xl font-semibold">Ready to explore GoalVow?</h2>
          <p className="mt-3 text-base text-white/66">
            Start as a learner, partner as an institution, or invest in Africa&apos;s most connected learning ecosystem.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/auth/signup" variant="primary">Create free account</ButtonLink>
            <ButtonLink href="/investors" variant="secondary">Investor hub</ButtonLink>
            <ButtonLink href="/support" variant="outline">Partner with us</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
