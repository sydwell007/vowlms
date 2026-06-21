import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Pricing — VowLMS",
};

const plans = [
  {
    name: "Learner Free",
    price: "Free",
    description: "Start your learning journey with no cost.",
    features: [
      "Access to all free upskilling courses",
      "Learner dashboard and progress tracking",
      "Assessment attempts and results",
      "VowRewards points on completion",
      "GoalVow certificate on completion",
    ],
    cta: "Start free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Academy Course",
    price: "From R199",
    description: "Enrol in a single paid academy course with full access.",
    features: [
      "Full course access: all lessons and modules",
      "Interactive assessments with scoring",
      "VR practice sessions",
      "Verified digital certificate",
      "250 VowRewards points on completion",
      "PayFast secure ZAR payment",
    ],
    cta: "Browse courses",
    href: "/courses",
    highlight: true,
  },
  {
    name: "Learning Hub Cohort",
    price: "Custom",
    description: "Facilitator-led group cohorts for organisations and communities.",
    features: [
      "Bulk learner enrolments",
      "Facilitator dashboard and oversight",
      "VR session coordination",
      "Partner reporting and analytics",
      "Certificate and rewards bulk issuance",
      "Learning hub on-site support",
    ],
    cta: "Contact GoalVow",
    href: "mailto:support@goalvow.com",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Transparent pricing</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
            Start free. Grow with GoalVow.
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-lg leading-8 text-white/70">
            Free courses for every learner. Affordable paid courses with real certificates. Custom cohort pricing for communities and organisations.
          </p>
        </div>
      </section>

      {/* Plans */}
      <Section tone="light" eyebrow="Plans" title="Choose the right plan for you">
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-2xl p-7 ${plan.highlight ? "bg-[#06111f] text-white shadow-[0_32px_80px_rgba(6,17,31,0.22)] ring-1 ring-gold/40" : "premium-card text-ink"}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${plan.highlight ? "text-gold" : "text-[#1166c8]"}`}>{plan.name}</p>
              <p className={`mt-4 text-4xl font-bold ${plan.highlight ? "text-gold" : "text-ink"}`}>{plan.price}</p>
              <p className={`mt-2 text-sm ${plan.highlight ? "text-white/70" : "text-muted"}`}>{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? "text-white/80" : "text-muted"}`}>
                    <span className={`shrink-0 mt-0.5 font-bold ${plan.highlight ? "text-gold" : "text-[#1166c8]"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {plan.href.startsWith("mailto") ? (
                  <a
                    href={plan.href}
                    className={`flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition ${plan.highlight ? "bg-gold text-[#06111f] hover:bg-gold/90" : "border border-slate-200 bg-white text-ink hover:bg-slate-50"}`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <ButtonLink
                    href={plan.href}
                    className={`w-full justify-center ${plan.highlight ? "" : ""}`}
                    variant={plan.highlight ? undefined : "ink"}
                  >
                    {plan.cta}
                  </ButtonLink>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* PayFast trust section */}
      <section className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Secure ZAR payments powered by PayFast</h2>
              <p className="mt-2 text-sm text-muted max-w-lg">All paid courses are processed through PayFast — South Africa's trusted payment gateway. No hidden fees, no subscriptions unless you choose one.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              {["Visa & Mastercard", "EFT / Instant EFT", "Mobicred", "MoreTyme"].map((method) => (
                <span key={method} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-ink">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section tone="light" eyebrow="FAQ" title="Common questions">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Can I get a refund?", "Yes. If you're unsatisfied within 7 days of purchase and have not yet downloaded your certificate, contact support@goalvow.com for a full refund."],
            ["Do free courses include a certificate?", "Yes. All completed GoalVow courses — free or paid — generate a downloadable, verifiable GoalVow certificate."],
            ["How do I pay for a course?", "Click 'Enrol' on any paid course, sign in or create an account, and checkout via PayFast. Payment is one-time per course."],
            ["What are VowRewards?", "VowRewards points are earned for every lesson completed, assessment passed, VR session, and course finished. Points can be used across the GoalVow ecosystem."],
          ].map(([q, a]) => (
            <div key={q} className="premium-card rounded-xl p-6">
              <h3 className="font-semibold text-ink">{q}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{a}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
