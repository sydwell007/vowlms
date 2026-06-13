import { Section } from "@/components/ui/Section";
import { getLearningHubs } from "@/lib/data";

export const metadata = {
  title: "Learning Hubs",
};

export default function LearningHubsPage() {
  const hubs = getLearningHubs();

  return (
    <main>
      <Section
        tone="light"
        eyebrow="Learning hubs"
        title="Physical and digital access points"
        description="Learning hubs support mobile access, facilitator-led cohorts, VR simulation spaces, and community opportunity pathways."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {hubs.map((hub) => (
            <article key={hub.id} className="premium-card rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{hub.status}</p>
              <h2 className="mt-3 text-2xl font-semibold">{hub.name}</h2>
              <p className="mt-2 text-sm font-medium text-muted">{hub.location}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{hub.focus}</p>
              <p className="mt-5 text-sm font-semibold">{hub.capacity} learner capacity</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
