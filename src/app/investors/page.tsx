import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";

export const metadata = { title: "Investors Hub — GoalVow Holdings" };

const metrics = [
  { value: "614", label: "Active courses", detail: "Across 6 GoalVow academies" },
  { value: "6", label: "Academy verticals", detail: "Upskilling, trades, culinary, school, business, university" },
  { value: "5+", label: "Learning hubs", detail: "Community access points across SA" },
  { value: "9+", label: "Ecosystem integrations", detail: "Rewards, opportunities, payments, video, storage" },
];

const strengths = [
  {
    title: "Scalable course infrastructure",
    description: "614 courses across 6 academy verticals, powered by a production-grade Next.js + PostgreSQL architecture deployable at national scale.",
  },
  {
    title: "Verified outcome tracking",
    description: "Every learner journey produces verifiable data: assessment scores, certificate IDs, VowRewards points, and PlugConnect opportunity matches.",
  },
  {
    title: "Community learning hubs",
    description: "Physical access points reduce the digital divide and create on-the-ground facilitator networks ready for government and NGO partnerships.",
  },
  {
    title: "Ecosystem flywheel",
    description: "VowLMS, VowRewards, PlugConnect, SkillsShop, VowTools, and ChefOrder form a closed-loop ecosystem that increases learner lifetime value.",
  },
  {
    title: "PayFast-ready monetisation",
    description: "Course payments, subscriptions, and cohort licensing are all wired for PayFast ZAR processing — ready for first revenue day one.",
  },
  {
    title: "Mobile-first PWA architecture",
    description: "Full offline capability, service worker, and manifest — reaching learners in low-connectivity areas without requiring native app distribution.",
  },
];

export default function InvestorsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Holdings</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold sm:text-6xl">
            Investors Hub
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow Holdings is building South Africa's most connected learning and livelihood ecosystem — with verifiable outcomes, community infrastructure, and an expanding digital services network.
          </p>
          <a
            href="mailto:investors@goalvow.com"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] transition hover:bg-gold/90"
          >
            Contact investor relations →
          </a>
        </div>
      </section>

      {/* Key metrics */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-4xl font-bold text-[#1166c8]">{m.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{m.label}</p>
              <p className="mt-1 text-xs text-muted">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment strengths */}
      <Section tone="light" eyebrow="Investment thesis" title="Why GoalVow Holdings">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {strengths.map((s) => (
            <article key={s.title} className="premium-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{s.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <section className="premium-section-dark py-16 text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Get in touch</p>
          <h2 className="mt-3 text-3xl font-semibold">Investor relations</h2>
          <p className="mt-4 text-base text-white/70">
            For investment inquiries, partnership proposals, and financial reporting requests, contact our investor relations team.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a href="mailto:investors@goalvow.com" className="text-gold hover:underline font-semibold">investors@goalvow.com</a>
            <a href="tel:+27632706787" className="text-white/70 hover:text-white text-sm">+27 63 270 6787</a>
          </div>
        </div>
      </section>
    </main>
  );
}
