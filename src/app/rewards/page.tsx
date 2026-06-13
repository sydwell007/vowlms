import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Rewards",
};

export default function RewardsPage() {
  const rewards = [
    ["Lesson completion", "20 pts", "Learner completes a lesson and syncs progress."],
    ["Assessment pass", "80 pts", "Learner reaches the pass mark for a course assessment."],
    ["VR practice", "60 pts", "Learner records an applied simulation attempt."],
    ["Course completion", "250 pts", "Certificate is generated after full course completion."],
  ];

  return (
    <main>
      <Section
        tone="light"
        eyebrow="VowRewards"
        title="Reward events connected to learning progress"
        description="The reward layer is ready for real VowRewards API keys while local development uses safe placeholder events."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rewards.map(([title, points, description]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 card-shadow">
              <p className="text-3xl font-semibold text-[#1166c8]">{points}</p>
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
