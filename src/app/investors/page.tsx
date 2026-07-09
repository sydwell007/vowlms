import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Investors Hub · GoalVow Holdings",
  description: "Invest in Africa's Learn-to-Earn ecosystem. GoalVow Holdings combines education, support, rewards, tools, hubs, and opportunity pathways into one defensible platform.",
};

const metrics = [
  { value: "614+", label: "Active courses", detail: "Across 6 academy verticals" },
  { value: "6", label: "Academy pathways", detail: "Upskilling, trades, culinary, school, business, university" },
  { value: "8", label: "Ecosystem verticals", detail: "Education + support + commerce" },
  { value: "2030", label: "Target year", detail: "National scale across SA" },
];

const investmentCase = [
  {
    title: "Platform, not a product",
    desc: "GoalVow is a multi-vertical ecosystem — education, support, rewards, tools, hubs, marketplaces, and opportunities — creating multiple revenue streams and compounding network effects.",
  },
  {
    title: "Scalable infrastructure",
    desc: "Production-grade Next.js + MySQL architecture, PHP REST API bridge, PWA-ready, Vercel-deployed. 614 courses across 6 academies live and growing.",
  },
  {
    title: "Community moat",
    desc: "Physical learning hubs create a ground-level distribution network that digital-only competitors cannot replicate quickly — a real, defensible community infrastructure advantage.",
  },
  {
    title: "Verified outcome tracking",
    desc: "Every learner journey produces verifiable data: assessment scores, certificate IDs, VowRewards points, and PlugConnect matches — investor-grade reporting ready.",
  },
  {
    title: "PayFast-ready monetisation",
    desc: "ZAR course payments, cohort licensing, subscription tiers, SkillsShop commerce, and ChefOrder food revenue — multiple monetisation rails from day one.",
  },
  {
    title: "ESG and impact credentials",
    desc: "GoalVow directly addresses youth unemployment and the digital divide in South Africa — strong positioning for government partnerships, NGO funding, and ESG-driven investors.",
  },
];

const roadmap = [
  { year: "2024–2025", title: "Platform foundation", items: ["614 courses migrated", "6 academies live", "PHP API bridge", "VowRewards system", "PWA mobile access"] },
  { year: "2026", title: "Ecosystem expansion", items: ["VowTools launch", "SkillsShop beta", "ChefOrder MVP", "Learning hub network", "PlugConnect v2"] },
  { year: "2027–2028", title: "Scale", items: ["Innovation Labs VR", "AI personalisation", "National hub network", "Government partnerships", "Corporate cohorts"] },
  { year: "2029–2030", title: "Pan-African", items: ["Multi-country rollout", "Continental employer network", "Degree pathway accreditation", "Series A positioning"] },
];

const businessModel = [
  { icon: "💰", revenue: "Course fees", model: "PayFast ZAR checkout per course or subscription bundle" },
  { icon: "🏢", revenue: "Corporate cohorts", model: "Employer-funded training packages for staff upskilling" },
  { icon: "🏛️", revenue: "Government programmes", model: "SETA-aligned cohort funding and youth employment grants" },
  { icon: "🛍️", revenue: "SkillsShop commerce", model: "Product bundles, kits, and tools with margin" },
  { icon: "🍳", revenue: "ChefOrder commission", model: "Transaction fees on food orders placed through the platform" },
  { icon: "🏫", revenue: "Hub memberships", model: "Monthly hub access fees for non-enrolled community members" },
];

export default function InvestorsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">GoalVow Holdings</p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Invest in the future of{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              learning, talent, and opportunity
            </span>{" "}
            in Africa
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
            GoalVow is a platform, not a single product. It combines education, support, rewards, tools, hubs, marketplaces, and opportunity pathways into one defensible ecosystem serving African learners at scale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:investors@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#f5c542] px-5 py-2.5 text-sm font-semibold text-[#06111f] transition hover:bg-[#e8b830]">
              Contact investor relations →
            </a>
            <ButtonLink href="/ecosystem" variant="secondary">Explore the ecosystem</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.ecosystemHero}
            alt="GoalVow learning ecosystem with digital learning, VR practice, rewards, and opportunity pathways"
            priority
            aspect="video"
          />
        </div>
      </section>

      {/* Key metrics */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-4xl font-bold text-[#1e3a8a]">{m.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{m.label}</p>
              <p className="mt-1 text-xs text-muted">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1e3a8a]">Vision & opportunity</p>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold text-ink">Africa&apos;s skills gap is the opportunity</h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                With 60%+ youth unemployment in South Africa and millions of young Africans without formal skills credentials, the demand for scalable, affordable, and verifiable skills training is enormous — and largely unmet by existing providers.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                GoalVow addresses this by building the infrastructure layer — academies, hubs, rewards, tools, and opportunities — that allows learners to move from no credentials to verified employment readiness in structured, measurable steps.
              </p>
            </div>
            <div className="space-y-4">
              {["South Africa: 32% unemployment rate", "Youth unemployment: 60%+", "Digital skills gap growing annually", "SETA funding: R15bn+ per year available", "Informal economy: 30% of GDP opportunity"].map((stat) => (
                <div key={stat} className="gv-card rounded-xl px-5 py-3 text-sm font-medium text-ink">
                  <span className="mr-2 text-[#1e3a8a] font-bold">→</span>{stat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment case */}
      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#06b6d4]">Investment case</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Why GoalVow Holdings</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {investmentCase.map((item) => (
              <article key={item.title} className="gv-card rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#1e3a8a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Business model */}
      <section className="gv-section-blue py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1e3a8a]">Business model</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">6 revenue streams, one platform</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessModel.map((b) => (
              <div key={b.revenue} className="gv-card rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="font-semibold text-ink">{b.revenue}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{b.model}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2030 Roadmap */}
      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#f97316]">2030 roadmap</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">The path to pan-African scale</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((phase) => (
              <div key={phase.year} className="gv-card rounded-xl p-6">
                <p className="text-sm font-bold text-[#1e3a8a]">{phase.year}</p>
                <h3 className="mt-1 text-base font-semibold text-ink">{phase.title}</h3>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Impact */}
      <section className="gv-section-dark py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Impact & ESG</p>
          <h2 className="mt-2 text-3xl font-semibold">Built for impact. Designed for scale.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66">
            GoalVow directly addresses youth unemployment, the digital skills divide, and community economic development in South Africa — with measurable, verifiable learner outcomes at every step.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["🎓", "Skills access", "Making quality skills education accessible to communities without premium school infrastructure"],
              ["🌍", "Digital inclusion", "Physical learning hubs reduce the digital divide — offline PWA ensures no learner is left behind by connectivity"],
              ["💼", "Economic mobility", "PlugConnect, ChefOrder, and VowTools create direct pathways from learning to legitimate income and entrepreneurship"],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="rounded-xl border border-white/12 bg-white/6 p-6">
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-3 text-base font-semibold">{title as string}</h3>
                <p className="mt-2 text-sm text-white/62">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1e3a8a]">Get in touch</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Ready to invest in GoalVow?</h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            For investment inquiries, partnership proposals, impact reporting, and financial due diligence requests — contact our investor relations team directly.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a href="mailto:investors@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a8a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1e40af]">
              investors@goalvow.com →
            </a>
            <a href="tel:+27632706787" className="text-sm text-muted hover:text-ink">+27 63 270 6787</a>
            <Link href="/ecosystem" className="text-sm text-[#06b6d4] hover:underline font-semibold">
              View full ecosystem map →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
