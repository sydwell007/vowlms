import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "GoalVow Ecosystem · Connected Learning Services",
  description: "Explore the full GoalVow Holdings ecosystem — academies, learning hubs, VowSupport, VowRewards, VowTools, PlugConnect, SkillsShop, ChefOrder, and Innovation Labs.",
};

const pillars = [
  {
    icon: "🎓",
    name: "Academies",
    tagline: "6 connected academy catalogues",
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
    desc: "A proposed partner model for supported device access, facilitated study, and selected Skills Practice activities.",
    href: "/learning-hubs",
    status: "Planned",
    statusColor: "bg-amber-100 text-amber-700",
    color: "#06b6d4",
  },
  {
    icon: "🤝",
    name: "VowSupport",
    tagline: "Account, learning & registration help",
    desc: "A verified support route for access, registration, course, assessment, and partnership enquiries.",
    href: "/support",
    status: "Built-in",
    statusColor: "bg-emerald-100 text-emerald-700",
    color: "#19c37d",
  },
  {
    icon: "⭐",
    name: "VowRewards",
    tagline: "Rewards for eligible learning milestones",
    desc: "The platform records VowRewards events for configured lesson, assessment, course, and certificate milestones.",
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
    desc: "A planned consent-led route from learner-controlled evidence to confirmed employment, project, and enterprise opportunities.",
    href: "/opportunities",
    status: "Planned",
    statusColor: "bg-amber-100 text-amber-700",
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
    tagline: "Skills Practice research and development",
    desc: "A development pathway for safe simulations, future WebXR experiences, and evidence-led learning tools.",
    href: "/innovation-labs",
    status: "In development",
    statusColor: "bg-cyan-100 text-cyan-700",
    color: "#06b6d4",
  },
];

const platformFlow = [
  { from: "Learner enrols", to: "Account-owned enrolment", via: "Platform" },
  { from: "Activity accepted", to: "Progress updated", via: "Progress service" },
  { from: "Eligible milestone", to: "Reward event recorded", via: "Reward service" },
  { from: "Completion validated", to: "Certificate eligibility", via: "Certificate service" },
  { from: "Learner consents", to: "Future opportunity routing", via: "PlugConnect plan" },
  { from: "Practice submitted", to: "Skills Practice record", via: "Practice service" },
];

export default function EcosystemPage() {
  return (
    <main>
      {/* Hero */}
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            GoalVow Holdings
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            One platform.{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Connected services.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            VowLMS connects academy learning with support, rewards, Skills Practice, and carefully staged ecosystem services in one coherent learner journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/academies" variant="primary">Explore academies</ButtonLink>
            <ButtonLink href="/investors" variant="secondary">Investor overview</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.ecosystemHero}
            alt="GoalVow ecosystem connecting learning, VR practice, rewards, and opportunities"
            priority
            aspect="video"
          />
        </div>
      </section>

      {/* Journey flow */}
      <section className="border-b border-slate-100 bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#06b6d4]">How it flows</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">How learner records move through the platform</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platformFlow.map((flow) => (
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
            Start as a learner, explore a partnership, or review the current GoalVow platform foundation.
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
