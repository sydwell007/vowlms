import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCourses } from "@/lib/data";

export const metadata = {
  title: "Impact",
  description: "How GoalVow intends to measure learning access, completion evidence, and progression outcomes.",
};

const outcomeAreas = [
  {
    title: "Learning access",
    description: "Track enrolment, active participation, mobile access, learner support use, and course affordability without overstating reach.",
  },
  {
    title: "Completion evidence",
    description: "Measure completed lessons, assessment outcomes, Skills Practice records, and certificates from authorised platform data.",
  },
  {
    title: "Progression outcomes",
    description: "Measure verified movement into further learning, work, enterprise, mentoring, or other GoalVow opportunity pathways.",
  },
];

const focusAreas = [
  "Employment and workplace readiness",
  "Practical trade and service skills",
  "Food and hospitality enterprise",
  "School and family learning support",
  "Sport, wellness, and coaching pathways",
  "Business and professional learning",
];

export default function ImpactPage() {
  const publishedCourseCount = getCourses().length;

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Impact framework</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold sm:text-6xl">Measure outcomes with evidence</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow is preparing an evidence-led impact model across learning access, completion, Skills Practice, and progression. Verified outcome figures will be published only after reporting governance is approved.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Current platform" title="A measurable foundation">
        <div className="grid gap-5 md:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-7">
            <p className="text-4xl font-semibold text-[#1166c8]">{publishedCourseCount.toLocaleString()}</p>
            <p className="mt-2 text-sm font-semibold text-ink">Courses available in the current catalogue</p>
            <p className="mt-3 text-xs leading-5 text-muted">This count comes from the current VowLMS catalogue. Learner and outcome metrics are not published until verified.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {outcomeAreas.map((area) => (
              <article key={area.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-ink">{area.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Focus areas" title="Where the platform is designed to contribute">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <div key={area} className="rounded-lg border border-white/12 bg-white/8 px-5 py-4 text-sm font-semibold text-white">
              {area}
            </div>
          ))}
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Discuss a measurable learning programme</h2>
          <p className="mt-4 text-base text-white/70">Organisations can discuss funded learning, reporting requirements, learner privacy, and delivery options with GoalVow.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/support">Contact GoalVow</ButtonLink>
            <ButtonLink href="/ecosystem" variant="secondary">View ecosystem</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
