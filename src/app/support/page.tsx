import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Support · GoalVow Learner Support Systems",
  description: "Get support at every stage of your GoalVow journey — tutoring, mentoring, coaching, hub access, tools, and opportunities.",
};

const supportServices = [
  {
    icon: "🤝",
    title: "VowSupport",
    subtitle: "Tutoring, mentoring & coaching",
    desc: "Academic tutoring, career mentoring, study coaching, and registration support from GoalVow facilitators and partner organisations.",
    href: "/vowsupport",
    color: "#19c37d",
    items: ["1-on-1 tutoring", "Career mentoring", "Study coaching", "Registration help"],
  },
  {
    icon: "🏫",
    title: "Learning Hubs",
    subtitle: "In-person hybrid access",
    desc: "Community learning hubs across South Africa offering devices, internet, study rooms, printing, mentoring, and practical training environments.",
    href: "/learning-hubs",
    color: "#06b6d4",
    items: ["Device & internet access", "Study rooms", "Printing services", "Facilitator support"],
  },
  {
    icon: "🔧",
    title: "VowTools",
    subtitle: "Career readiness toolkit",
    desc: "CV builder, skill gap diagnostics, interview preparation guides, and productivity tools — all aligned to GoalVow academy pathways.",
    href: "/vowtools",
    color: "#f97316",
    items: ["CV builder", "Skill gap analysis", "Interview prep", "Productivity tools"],
  },
  {
    icon: "⭐",
    title: "VowRewards",
    subtitle: "Motivation & milestone tracking",
    desc: "Earn VowRewards points on every lesson, assessment, and course completion — redeem for SkillsShop credits, hub access, and ecosystem perks.",
    href: "/rewards",
    color: "#f5c542",
    items: ["Lesson rewards", "Assessment bonuses", "Course completion pts", "Redemption marketplace"],
  },
];

const faq = [
  { q: "How do I access VowSupport tutoring?", a: "VowSupport tutoring is available through your learner dashboard. Book a session with a GoalVow facilitator via the Support tab." },
  { q: "Where are the learning hubs?", a: "GoalVow has community learning hubs across South Africa. Visit the Learning Hubs page to find your nearest location and book a session." },
  { q: "Is support free for enrolled learners?", a: "Basic VowSupport, hub access, and VowTools are included for all active GoalVow learners. Premium coaching packages are available as add-ons." },
  { q: "Can I get help with registration?", a: "Yes — VowSupport includes registration assistance for all GoalVow academy enrolments, including document verification and payment queries." },
];

export default function SupportPage() {
  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#06b6d4]">Support systems</p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold sm:text-5xl">
            Every learner, fully supported
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            GoalVow wraps every learner in a support ecosystem — tutoring, mentoring, learning hubs, career tools, and rewards — so no one falls through the cracks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/vowsupport" variant="primary">Get support now</ButtonLink>
            <ButtonLink href="/learning-hubs" variant="secondary">Find a learning hub</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.vrPracticeLab}
            alt="GoalVow learning hub and support environment for guided practical learning"
            aspect="video"
          />
        </div>
      </section>

      {/* Support services */}
      <section className="gv-section-blue py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Support services</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {supportServices.map((s) => (
              <Link key={s.title} href={s.href}>
                <article className="gv-card h-full rounded-xl p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(30,58,138,0.1)]">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{s.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: s.color }}>{s.title}</h3>
                      <p className="text-xs font-medium text-muted">{s.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">{s.desc}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-xs text-ink">
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Frequently asked questions</h2>
          <div className="mt-6 flex flex-col gap-4">
            {faq.map((f) => (
              <div key={f.q} className="gv-card rounded-xl p-5">
                <p className="font-semibold text-ink">{f.q}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="gv-section-dark py-12 text-white">
        <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-6">
          <h2 className="text-2xl font-semibold">Need help right now?</h2>
          <p className="mt-3 text-sm text-white/66">Our support team is available via email, WhatsApp, and in-person at your nearest learning hub.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="mailto:support@goalvow.com" className="inline-flex items-center gap-2 rounded-lg bg-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0891b2]">
              Email support
            </a>
            <a href="https://wa.me/27839488894" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/14">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
