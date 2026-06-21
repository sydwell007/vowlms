import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";

export const metadata = { title: "About GoalVow — VowLMS" };

const milestones = [
  { year: "2022", event: "GoalVow Holdings founded in Cape Town with a mission to connect learning to livelihoods across South Africa." },
  { year: "2023", event: "Launched 6 GoalVow Academies on Moodle — Upskilling, Skills Training, Chef Academy, Schools, Business School, and University Online." },
  { year: "2024", event: "Onboarded first 1,000 learners. Launched VowRewards and early PlugConnect opportunity matching." },
  { year: "2025", event: "Expanded to 614 active courses across all 6 academies. Opened first three Learning Hubs in Cape Town." },
  { year: "2026", event: "Launched VowLMS — a premium, investor-grade learning platform purpose-built for GoalVow Holdings and the community it serves." },
];

const values = [
  { icon: "🎯", title: "Learning with purpose", description: "Every GoalVow course connects directly to employment, entrepreneurship, or further study. Learning at GoalVow is never just academic — it has a next step." },
  { icon: "🤝", title: "Community first", description: "GoalVow was built for South Africa's communities — working-class families, youth, small business owners, and anyone who needs a credible pathway forward." },
  { icon: "📈", title: "Measurable outcomes", description: "We track what matters: completions, certificates, VowRewards earned, and opportunity matches — not just enrolments." },
  { icon: "🌍", title: "Inclusive access", description: "PWA-first design, offline content, and community Learning Hubs ensure no learner is excluded by data costs or device limitations." },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">About GoalVow</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold sm:text-6xl">
            Building pathways from learning to livelihood across South Africa
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow Holdings is a South African ed-tech and ecosystem company connecting 614+ courses, 6 academies, and a growing network of Learning Hubs to real-world opportunities.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/courses">Browse courses</ButtonLink>
            <ButtonLink href="/academies" variant="secondary">View academies</ButtonLink>
          </div>
        </div>
      </section>

      {/* Mission */}
      <Section tone="light" eyebrow="Mission" title="Why GoalVow exists">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="premium-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-ink">Our mission</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              To make quality, verifiable, opportunity-linked learning accessible to every South African — regardless of their background, location, or device.
            </p>
            <p className="mt-4 text-base leading-7 text-muted">
              We believe a certificate should open a door. A completed course should produce income. Learning should mean something beyond a quiz score.
            </p>
          </div>
          <div className="premium-card-dark rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white">Our vision</h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              A South Africa where every community has access to world-class learning, every completion leads to an opportunity, and every learner is connected to the full GoalVow ecosystem of services and support.
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section eyebrow="Values" title="What we stand for">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <article key={v.title} className="premium-card rounded-xl p-6">
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="text-lg font-semibold text-ink">{v.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{v.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <section className="premium-section-dark py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Our journey</p>
          <h2 className="mt-3 text-3xl font-semibold">GoalVow milestones</h2>
          <div className="mt-10 space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6">
                <div className="shrink-0 w-16 text-right">
                  <span className="text-2xl font-bold text-gold">{m.year}</span>
                </div>
                <div className="flex-1 border-l border-white/20 pl-6 pb-6">
                  <p className="text-base leading-7 text-white/80">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GoalVow ecosystem */}
      <Section tone="light" eyebrow="The GoalVow ecosystem" title="More than just an LMS">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "VowLMS", description: "The central learning platform connecting all GoalVow academies and learning pathways.", href: "/" },
            { name: "VowRewards", description: "A rewards programme that turns learning milestones into real ecosystem value.", href: "/rewards" },
            { name: "PlugConnect", description: "An opportunity matching platform connecting learners to employers, gigs, and grants.", href: "/opportunities" },
            { name: "SkillsShop", description: "A marketplace for skills-based products, starter kits, and micro-enterprise tools.", href: "/opportunities" },
            { name: "VowSupport", description: "24/7 learner support, facilitator management, and community care services.", href: "/opportunities" },
            { name: "ChefOrder", description: "Food ordering and catering pathway for Chef Academy graduates.", href: "/academies/chef-academy" },
          ].map((s) => (
            <Link key={s.name} href={s.href} className="premium-card rounded-xl p-6 block hover:-translate-y-0.5 transition">
              <h3 className="text-lg font-semibold text-ink">{s.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="premium-section-dark py-14 text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Join the GoalVow community</h2>
          <p className="mt-4 text-base text-white/70">614 courses. 6 academies. Real certificates. Real opportunities.</p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/auth/signup">Create free account</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Contact us</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
