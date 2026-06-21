import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Team — GoalVow Holdings" };

export default function TeamPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Our team</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">The people behind GoalVow</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            GoalVow Holdings is led by educators, technologists, and community builders committed to connecting learning to livelihood across South Africa.
          </p>
        </div>
      </section>
      <Section tone="light" eyebrow="Leadership" title="GoalVow leadership team">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Sydwell", role: "Founder & CEO", detail: "Visionary behind the GoalVow ecosystem — connecting 6 academies, 614 courses, and growing community learning infrastructure across South Africa.", initials: "SW" },
            { name: "Curriculum Team", role: "Academy Directors", detail: "Expert educators leading content development across Upskilling, Skills Training, Chef Academy, Schools, Business School, and University Online.", initials: "AT" },
            { name: "Technology Team", role: "Engineering & Platform", detail: "Full-stack engineers and UX designers building VowLMS, VowRewards, PlugConnect, and the broader GoalVow digital ecosystem.", initials: "TT" },
            { name: "Facilitator Network", role: "Community Facilitators", detail: "Trained GoalVow facilitators running learning hubs, cohorts, and learner support programmes across Cape Town and beyond.", initials: "FN" },
            { name: "Operations Team", role: "Growth & Partnerships", detail: "Business development and partnerships driving employer relationships, government contracts, and GoalVow ecosystem expansion.", initials: "OP" },
            { name: "Support Team", role: "VowSupport & Success", detail: "Learner success specialists providing 24/7 support across VowSupport channels for all GoalVow platform users.", initials: "SP" },
          ].map((member) => (
            <article key={member.name} className="premium-card rounded-xl p-7 flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#06111f] text-gold font-bold text-lg">
                {member.initials}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">{member.name}</h3>
                <p className="text-sm font-semibold text-[#1166c8]">{member.role}</p>
              </div>
              <p className="text-sm leading-6 text-muted flex-1">{member.detail}</p>
            </article>
          ))}
        </div>
      </Section>
      <section className="premium-section-dark py-14 text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Join the team</h2>
          <p className="mt-4 text-base text-white/70">We're always looking for educators, engineers, facilitators, and community champions to join GoalVow.</p>
          <ButtonLink href="/careers" className="mt-8">View open roles</ButtonLink>
        </div>
      </section>
    </main>
  );
}
