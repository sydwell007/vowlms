import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";

export const metadata = { title: "Team - GoalVow Holdings" };

const operatingAreas = [
  { title: "Academy and curriculum", detail: "Course ownership, academic review, learning design, and delivery standards across each academy." },
  { title: "Platform and data", detail: "VowLMS engineering, security, integrations, data quality, and production operations." },
  { title: "Learner support", detail: "Account support, learning guidance, escalations, and accessible service pathways." },
  { title: "Partnerships and growth", detail: "Organisation programmes, ecosystem services, and evidence-led expansion." },
];

export default function TeamPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow stewardship</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold sm:text-6xl">Leadership with clear platform accountability</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow is founder-led. Additional leadership and governance profiles will be published after the organisation approves the public details.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Leadership" title="Founder and platform direction">
        <article className="premium-card max-w-2xl rounded-lg p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Founder and CEO</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Sydwell</h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Responsible for GoalVow&apos;s strategic direction, academy ecosystem, and the VowLMS platform programme.
          </p>
        </article>
      </Section>

      <Section eyebrow="Operating model" title="The functions behind VowLMS">
        <div className="grid gap-5 md:grid-cols-2">
          {operatingAreas.map((area) => (
            <article key={area.title} className="premium-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-ink">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{area.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Work with GoalVow</h2>
          <p className="mt-4 text-base text-white/70">Review the careers page for confirmed opportunities and professional-interest channels.</p>
          <ButtonLink href="/careers" className="mt-8">Careers and interest</ButtonLink>
        </div>
      </section>
    </main>
  );
}
