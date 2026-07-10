import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Careers - GoalVow Holdings" };

const interestAreas = [
  { title: "Education and facilitation", detail: "Curriculum, assessment, learner guidance, and academy delivery." },
  { title: "Technology and product", detail: "Web engineering, platform operations, accessibility, security, and learning experience." },
  { title: "Learner support", detail: "Account assistance, learner success, mentoring coordination, and service operations." },
  { title: "Partnerships", detail: "Organisation learning, community access, employment pathways, and ecosystem development." },
];

export default function CareersPage() {
  const subject = encodeURIComponent("GoalVow professional interest");

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Careers</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold sm:text-6xl">Build useful learning systems with GoalVow</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            There are no public vacancies confirmed on VowLMS today. New roles will appear here only after the position and application process are approved.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Professional interest" title="Areas we expect to grow">
        <div className="grid gap-5 md:grid-cols-2">
          {interestAreas.map((area) => (
            <article key={area.title} className="premium-card rounded-lg p-6">
              <h2 className="text-lg font-semibold text-ink">{area.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{area.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">Register professional interest</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Send a short introduction through the verified GoalVow support address. This is not an application to a currently open position.
          </p>
          <a href={`mailto:${siteConfig.contact.email}?subject=${subject}`} className="mt-5 inline-flex rounded-lg bg-[#06111f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2239]">
            Contact GoalVow
          </a>
        </div>
      </Section>
    </main>
  );
}
