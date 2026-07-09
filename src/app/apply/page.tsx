import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Apply · Certificates, Opportunities & Entrepreneurship",
  description: "Apply your GoalVow skills through certificates, PlugConnect job matching, entrepreneurship support, and VowRewards ecosystem benefits.",
};

const applyPaths = [
  {
    icon: "🏅",
    title: "Verified Certificates",
    desc: "GoalVow certificates are issued per course with a unique verification ID. Share digitally with employers, upload to LinkedIn, or print at your nearest learning hub.",
    href: "/certificates",
    color: "#1e3a8a",
    badge: "Available",
  },
  {
    icon: "🔗",
    title: "PlugConnect Opportunities",
    desc: "Your verified achievements are matched to job listings, internships, freelance projects, and entrepreneurship opportunities in the PlugConnect employer network.",
    href: "/opportunities",
    color: "#8b5cf6",
    badge: "Connected",
  },
  {
    icon: "💼",
    title: "Entrepreneurship Support",
    desc: "GoalVow supports learner entrepreneurs with ChefOrder for culinary graduates, SkillsShop product pathways, and VowTools for business setup guidance.",
    href: "/innovation-labs",
    color: "#f97316",
    badge: "Ecosystem",
  },
  {
    icon: "⭐",
    title: "VowRewards Ecosystem",
    desc: "Your earned VowRewards points unlock SkillsShop credits, GoalVow ecosystem discounts, community recognition, and PlugConnect employer priority.",
    href: "/rewards",
    color: "#f5c542",
    badge: "Built-in",
  },
  {
    icon: "🔧",
    title: "VowTools for Career Readiness",
    desc: "Use the CV builder, skill gap diagnostics, and interview preparation tools to present your GoalVow credentials to employers with confidence.",
    href: "/vowtools",
    color: "#06b6d4",
    badge: "Coming soon",
  },
  {
    icon: "📊",
    title: "Verified Skill Portfolio",
    desc: "Your learner dashboard holds a complete record of completed courses, assessment scores, VR sessions, and certificates — a portable proof of capability.",
    href: "/dashboard/learner",
    color: "#19c37d",
    badge: "Live",
  },
];

const outcomeStats = [
  { value: "100%", label: "Digital certificates", detail: "Unique verification ID per certificate" },
  { value: "PlugConnect", label: "Job matching", detail: "Verified credential routing" },
  { value: "VowRewards", label: "Ecosystem value", detail: "Points redeemable across GoalVow" },
  { value: "6+", label: "Employer pathways", detail: "Per academy vertical" },
];

export default function ApplyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="gv-hero py-20 text-white md:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-orange-300">
            Step 3 of 3
          </div>
          <h1 className="mt-2 text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">Apply</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Certificates, portfolios, PlugConnect opportunities, entrepreneurship support, jobs, projects, and business growth — this is where your learning pays off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/opportunities" variant="primary">Browse opportunities</ButtonLink>
            <ButtonLink href="/dashboard/learner" variant="secondary">View my portfolio</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowLMS learner portfolio, rewards, certificates, and opportunity dashboard"
            priority
            aspect="video"
          />
        </div>
      </section>

      {/* Outcome stats */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {outcomeStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#1e3a8a]">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apply paths */}
      <section className="gv-section-blue py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">How GoalVow learners apply their skills</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {applyPaths.map((p) => (
              <Link key={p.title} href={p.href}>
                <article className="gv-card h-full rounded-xl p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(30,58,138,0.1)]">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{p.icon}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-muted">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold" style={{ color: p.color }}>{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{p.desc}</p>
                  <p className="mt-4 text-xs font-semibold" style={{ color: p.color }}>Explore →</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gv-section-dark py-14 text-white">
        <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-6">
          <h2 className="text-2xl font-semibold">Ready to apply your skills?</h2>
          <p className="mt-3 text-sm text-white/66">Complete a course, earn your certificate, and let GoalVow connect you to the right opportunity.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/auth/signup" variant="primary">Start for free</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">Browse courses</ButtonLink>
          </div>
        </div>
      </section>

      {/* L→P→A nav */}
      <section className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <Link href="/practice" className="text-left">
            <p className="text-xs text-muted">Previous step</p>
            <p className="text-base font-semibold text-ink hover:text-[#8b5cf6] transition">← 02 · Practice</p>
          </Link>
          <div className="text-center">
            <p className="text-xs text-muted">You are here</p>
            <p className="text-base font-bold text-[#f97316]">03 · Apply</p>
          </div>
          <Link href="/" className="text-right">
            <p className="text-xs text-muted">Start over</p>
            <p className="text-base font-semibold text-ink hover:text-[#1e3a8a] transition">GoalVow Home →</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
