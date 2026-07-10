import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { getAcademies, getCourses } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Investors Hub",
  description: "A factual overview of the current GoalVow learning-platform foundation and decisions required for scale.",
};

const platformCase = [
  {
    title: "Connected learner journey",
    description: "Academy discovery, enrolment, learning, assessment, Skills Practice, certificates, rewards, support, and opportunities share one platform model.",
  },
  {
    title: "Hybrid delivery architecture",
    description: "A Next.js frontend connects to an Afrihost PHP API and MySQL deployment package, with a documented bridge contract and environment separation.",
  },
  {
    title: "Operational controls",
    description: "Role-aware APIs, payment confirmation rules, audit-ready deployment checks, and evidence-based reporting provide a foundation for controlled growth.",
  },
];

const roadmap = [
  {
    phase: "Current",
    title: "Platform validation",
    items: ["Complete production credential rotation", "Deploy schema hardening", "Verify role journeys", "Establish reporting baselines"],
  },
  {
    phase: "Next",
    title: "Programme operations",
    items: ["Confirm academy ownership", "Approve course publication workflow", "Pilot organisation cohorts", "Validate learner support model"],
  },
  {
    phase: "Later",
    title: "Evidence-led scale",
    items: ["Expand only from verified demand", "Publish audited outcome measures", "Evaluate new regions", "Add services after commercial validation"],
  },
];

const businessModels = [
  "Individual course fees",
  "Organisation-funded cohorts",
  "Learning-hub delivery",
  "Support and mentoring programmes",
  "Tools and learning-resource commerce",
  "Opportunity and ecosystem services",
];

export default function InvestorsPage() {
  const academies = getAcademies();
  const courses = getCourses();

  return (
    <main>
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">GoalVow Holdings</p>
            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
              A connected foundation for learning and progression
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
              This hub presents the current VowLMS platform foundation. Commercial forecasts, valuations, partnerships, accreditation, and outcome claims are intentionally excluded until approved evidence is available.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/support">Request a platform briefing</ButtonLink>
              <ButtonLink href="/ecosystem" variant="secondary">Explore the ecosystem</ButtonLink>
            </div>
          </div>
          <ImagePanel
            src={visualAssets.ecosystemHero}
            alt="GoalVow learning ecosystem with digital learning and Skills Practice pathways"
            priority
            aspect="video"
          />
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-4xl font-semibold text-[#1e3a8a]">{academies.length}</p>
            <p className="mt-1 text-sm font-semibold text-ink">Academy pathways represented</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-[#1e3a8a]">{courses.length.toLocaleString()}</p>
            <p className="mt-1 text-sm font-semibold text-ink">Courses in the current catalogue</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-[#1e3a8a]">6</p>
            <p className="mt-1 text-sm font-semibold text-ink">Moodle academy connections verified</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#06b6d4]">Platform case</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">What exists today</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {platformCase.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_14px_38px_rgba(6,17,31,0.05)]">
                <h3 className="text-lg font-semibold text-[#1e3a8a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gv-section-blue py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1e3a8a]">Commercial model</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">Models requiring validation</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              These are potential operating models, not revenue claims or forecasts. Pricing, margins, ownership, and regulatory treatment require business approval.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {businessModels.map((model) => (
              <div key={model} className="rounded-lg border border-[#1e3a8a]/12 bg-white px-5 py-4 text-sm font-semibold text-ink">
                {model}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f97316]">Controlled roadmap</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Scale after evidence</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {roadmap.map((phase) => (
              <article key={phase.phase} className="rounded-lg border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-[#1e3a8a]">{phase.phase}</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{phase.title}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                  {phase.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gv-section-dark py-14 text-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-between gap-6 px-5 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Request evidence, architecture, or due-diligence material</h2>
            <p className="mt-3 text-sm text-white/68">Use the verified GoalVow support channel and specify that your request concerns investment or partnership review.</p>
          </div>
          <a href={`mailto:${siteConfig.contact.email}?subject=GoalVow%20platform%20briefing`} className="shrink-0 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-[#06111f]">
            {siteConfig.contact.email}
          </a>
        </div>
      </section>

      <div className="bg-[#081626] py-5 text-center text-xs text-white/50">
        <Link href="/impact" className="transition hover:text-white">Review the impact measurement framework</Link>
      </div>
    </main>
  );
}
