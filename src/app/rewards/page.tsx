import { ButtonLink } from "@/components/ui/ButtonLink";
import { ImagePanel } from "@/components/ui/ImagePanel";
import { Section } from "@/components/ui/Section";
import { visualAssets } from "@/lib/visual-assets";

export const metadata = {
  title: "VowRewards — VowLMS",
};

const rewardEvents = [
  { icon: "📖", event: "Lesson completion", points: "20 pts", description: "Earn 20 points every time you complete a lesson and save your progress." },
  { icon: "✅", event: "Assessment pass", points: "80 pts", description: "Pass a course assessment at 70% or above and earn 80 VowRewards points." },
  { icon: "🥽", event: "VR practice session", points: "60 pts", description: "Log a completed VR simulation attempt to earn 60 points toward your reward balance." },
  { icon: "🏅", event: "Course completion", points: "250 pts", description: "Finish all modules and receive your certificate — 250 points added to your account." },
];

const rewardBenefits = [
  { icon: "🛍️", title: "SkillsShop credits", description: "Redeem VowRewards points for tools, materials, and starter kits on SkillsShop." },
  { icon: "🎯", title: "PlugConnect priority", description: "High reward balances increase your visibility in the PlugConnect employer matching pool." },
  { icon: "📣", title: "Community recognition", description: "Top earners appear on GoalVow community leaderboards and ambassador programmes." },
  { icon: "💼", title: "GoalVow ecosystem perks", description: "Discounts and early access across ChefOrder, VowTools, VowSupport, and more." },
];

export default function RewardsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">VowRewards</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
            Every lesson earns. Every completion counts.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            VowRewards turns your learning progress into tangible value — points that open doors across the GoalVow ecosystem.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/auth/signup">Start earning</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">Browse courses</ButtonLink>
          </div>
          </div>
          <ImagePanel
            src={visualAssets.dashboardExperience}
            alt="VowLMS dashboard showing rewards, certificates, progress, and learner milestones"
            aspect="video"
          />
        </div>
      </section>

      {/* How you earn */}
      <Section tone="light" eyebrow="How you earn" title="Four ways to build your reward balance">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rewardEvents.map((r) => (
            <article key={r.event} className="premium-card rounded-xl p-6">
              <div className="text-3xl mb-4">{r.icon}</div>
              <p className="text-3xl font-semibold text-[#1166c8]">{r.points}</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">{r.event}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{r.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* What you can do */}
      <Section eyebrow="What you can do" title="Redeem your points across the GoalVow ecosystem">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {rewardBenefits.map((b) => (
            <article key={b.title} className="premium-card-dark rounded-xl p-6">
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="text-lg font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/68">{b.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Sample earnings */}
      <Section tone="light" eyebrow="Example journey" title="How much can you earn?">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-semibold text-ink pr-8">Activity</th>
                <th className="pb-3 font-semibold text-ink pr-8">Points per action</th>
                <th className="pb-3 font-semibold text-ink pr-8">Example total (10 lessons)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Complete 10 lessons", "20 pts each", "200 pts"],
                ["Pass 1 assessment", "80 pts", "80 pts"],
                ["Complete 1 VR session", "60 pts", "60 pts"],
                ["Complete the course", "250 pts", "250 pts"],
                ["Total for one course", "", "590 pts"],
              ].map(([activity, per, total], i) => (
                <tr key={i} className={i === 4 ? "bg-gold/10 font-semibold" : ""}>
                  <td className="py-3 text-ink pr-8">{activity}</td>
                  <td className="py-3 text-muted pr-8">{per}</td>
                  <td className="py-3 font-semibold text-[#1166c8] pr-8">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/courses">Start earning rewards →</ButtonLink>
        </div>
      </Section>
    </main>
  );
}
