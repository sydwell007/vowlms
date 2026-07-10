import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { getLearningHubs } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "Learning Hubs - VowLMS",
  description: "Review GoalVow's planned model for supported community learning access.",
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Active" },
  "partner-ready": { bg: "bg-blue-50", text: "text-blue-700", label: "Partner ready" },
  planned: { bg: "bg-amber-50", text: "text-amber-700", label: "Planned" },
};

const proposedCapabilities = [
  { title: "Supported access", detail: "A suitable venue, connectivity, and device-access model agreed with each partner." },
  { title: "Facilitated learning", detail: "Cohort or drop-in support defined by the academy programme and facilitator availability." },
  { title: "Skills Practice", detail: "Practical or simulated activities introduced only where equipment, supervision, and safety controls are approved." },
  { title: "Progress continuity", detail: "Learners use the same VowLMS account across personal and supported study environments." },
];

export default function LearningHubsPage() {
  const hubs = getLearningHubs();
  const partnershipSubject = encodeURIComponent("GoalVow Learning Hub interest");

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Learning Hubs</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">A partner model for supported community learning</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
              GoalVow is defining how approved venues could support device access, guided study, and selected Skills Practice activities.
            </p>
            <ButtonLink href="/support" className="mt-8">Discuss a hub partnership</ButtonLink>
          </div>
          <ImagePanel
            src={visualAssets.vrPracticeLab}
            alt="Concept image for a GoalVow supported learning and Skills Practice environment"
            aspect="video"
          />
        </div>
      </section>

      <Section
        tone="light"
        eyebrow="Published locations"
        title="Approved GoalVow Learning Hubs"
        description="Locations appear here only after the venue, operating partner, learner capacity, and services have been confirmed."
      >
        {hubs.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {hubs.map((hub) => {
              const style = STATUS_STYLE[hub.status] ?? STATUS_STYLE.planned;
              return (
                <article key={hub.id} className="premium-card flex flex-col gap-4 rounded-lg p-6">
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{hub.name}</h2>
                    <p className="mt-1 text-sm text-muted">{hub.location}</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{hub.focus}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="text-xl font-semibold text-ink">No hub locations are publicly confirmed yet</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">Partnership enquiries remain open while the operating and support model is validated.</p>
          </div>
        )}
      </Section>

      <section className="premium-section-dark py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-gold">Proposed capabilities</p>
          <h2 className="mt-3 text-center text-3xl font-semibold">What a confirmed hub could support</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {proposedCapabilities.map((capability) => (
              <div key={capability.title} className="premium-card-dark rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white">{capability.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/68">{capability.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section tone="light" eyebrow="Partner with us" title="Register interest in a community learning partnership">
        <div className="premium-card flex flex-col gap-6 rounded-lg p-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-muted">
            Community organisations, schools, libraries, and businesses can introduce their venue and intended learners. An enquiry does not represent approval or appointment as a GoalVow Learning Hub.
          </p>
          <a href={`mailto:${siteConfig.contact.email}?subject=${partnershipSubject}`} className="shrink-0 rounded-lg bg-[#06111f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2239]">
            Register interest
          </a>
        </div>
      </Section>
    </main>
  );
}
