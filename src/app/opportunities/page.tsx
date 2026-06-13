import { Section } from "@/components/ui/Section";
import { getOpportunities } from "@/lib/data";

export const metadata = {
  title: "Opportunities",
};

export default function OpportunitiesPage() {
  const opportunities = getOpportunities();

  return (
    <main>
      <Section
        tone="light"
        eyebrow="PlugConnect pathways"
        title="Learning evidence connected to next steps"
        description="Employment, internship, supplier, study, and entrepreneurship surfaces are ready to connect to external ecosystem services."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {opportunities.map((opportunity) => (
            <article key={opportunity.id} className="premium-card rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{opportunity.type}</p>
              <h2 className="mt-3 text-2xl font-semibold">{opportunity.title}</h2>
              <p className="mt-2 text-sm font-medium text-muted">{opportunity.partner} | {opportunity.location}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{opportunity.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
