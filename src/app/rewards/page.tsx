import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "VowRewards - VowLMS",
  description: "Understand which verified VowLMS learning milestones currently create VowRewards records.",
};

const rewardEvents = [
  { event: "First lesson completion", points: "5 points", description: "Recorded once when an enrolled learner first completes an eligible lesson." },
  { event: "First assessment pass", points: "100 points", description: "Recorded once for the first passing attempt on an eligible assessment." },
  { event: "Certificate issued", points: "200 points", description: "Recorded when an eligible course certificate is first issued to the learner." },
];

export default function RewardsPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">VowRewards</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">Eligible milestones become accountable reward records</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
              VowLMS creates server-owned reward events for configured learning achievements and prevents repeat awards for the same milestone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/auth/signup">Create learner account</ButtonLink>
              <ButtonLink href="/courses" variant="secondary">Browse courses</ButtonLink>
            </div>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowLMS dashboard concept showing learner progress, certificates, and reward balance"
            aspect="video"
          />
        </div>
      </section>

      <Section tone="light" eyebrow="Current server rules" title="Milestones configured for VowRewards">
        <div className="grid gap-5 md:grid-cols-3">
          {rewardEvents.map((reward) => (
            <article key={reward.event} className="premium-card rounded-lg p-6">
              <p className="text-3xl font-semibold text-[#1166c8]">{reward.points}</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">{reward.event}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{reward.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Programme status" title="What learners can rely on now">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="premium-card-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white">Account-owned balance</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">The learner dashboard balance is calculated from reward events attached to the authenticated user.</p>
          </article>
          <article className="premium-card-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white">Idempotent milestones</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">Repeating a completed lesson or already-passed assessment does not create another first-achievement award.</p>
          </article>
          <article className="premium-card-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white">Redemption is not yet live</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">SkillsShop credits, discounts, priority matching, leaderboards, and cash-equivalent claims require approved rules and integration work.</p>
          </article>
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Learn with clear progress records</h2>
          <p className="mt-4 text-base text-white/70">Review each course&apos;s requirements before enrolment and track eligible achievements from your dashboard.</p>
          <ButtonLink href="/courses" className="mt-8">Explore courses</ButtonLink>
        </div>
      </section>
    </main>
  );
}
