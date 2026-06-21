import { Section } from "@/components/ui/Section";

export const metadata = { title: "Careers — GoalVow Holdings" };

const roles = [
  { title: "Senior Frontend Engineer", team: "Technology", location: "Remote (SA)", type: "Full-time", description: "Help build VowLMS and the broader GoalVow digital ecosystem with Next.js, TypeScript, and Tailwind." },
  { title: "LMS Content Developer", team: "Curriculum", location: "Cape Town / Remote", type: "Full-time", description: "Create engaging course content, assessments, and learning pathways for GoalVow Academy verticals." },
  { title: "Community Learning Hub Facilitator", team: "Operations", location: "Cape Town", type: "Full-time", description: "Run learner cohorts at GoalVow Learning Hubs — coaching, tracking progress, and supporting outcomes." },
  { title: "Business Development Manager", team: "Growth", location: "Cape Town", type: "Full-time", description: "Drive employer partnerships, government contracts, and ecosystem expansion for GoalVow Holdings." },
  { title: "Learner Success Specialist", team: "VowSupport", location: "Remote (SA)", type: "Full-time", description: "Support GoalVow learners via chat, email, and phone — resolving issues and celebrating completions." },
];

export default function CareersPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Careers</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">Work that matters. At GoalVow.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            Join a team building South Africa's most connected learning and livelihood ecosystem — where every role contributes to real community impact.
          </p>
        </div>
      </section>

      <Section tone="light" eyebrow="Open roles" title="Current opportunities at GoalVow">
        <div className="space-y-4">
          {roles.map((role) => (
            <article key={role.title} className="premium-card rounded-xl p-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]">{role.team}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-muted">{role.type}</span>
                  <span className="text-xs text-muted">📍 {role.location}</span>
                </div>
                <h3 className="text-xl font-semibold text-ink">{role.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{role.description}</p>
              </div>
              <div className="shrink-0">
                <a
                  href={`mailto:careers@goalvow.com?subject=Application: ${encodeURIComponent(role.title)}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50 hover:border-[#1166c8]/30"
                >
                  Apply →
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Don't see your role?</h2>
          <p className="mt-4 text-base text-white/70">Send a speculative application and tell us how you can contribute to GoalVow.</p>
          <a href="mailto:careers@goalvow.com" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] hover:bg-gold/90 transition">
            Send speculative application →
          </a>
        </div>
      </section>
    </main>
  );
}
