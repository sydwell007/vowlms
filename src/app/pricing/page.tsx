import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  const plans = [
    ["Starter learner", "Free", "Open access to selected upskilling pathways and learner dashboard."],
    ["Academy course", "From R299", "Paid short courses with assessments, certificates, and rewards."],
    ["Learning hub cohort", "Custom", "Facilitator-led cohorts, VR practice sessions, and partner reporting."],
  ];

  return (
    <main>
      <Section
        tone="light"
        eyebrow="Pricing"
        title="Simple subscription and course pricing placeholders"
        description="PayFast route handlers are prepared for future checkout sessions, subscriptions, and payment audit events."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map(([name, price, description]) => (
            <article key={name} className="premium-card rounded-xl p-6">
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="mt-4 text-4xl font-semibold text-[#1166c8]">{price}</p>
              <p className="mt-4 text-sm leading-6 text-muted">{description}</p>
              <ButtonLink href="/courses" variant="ink" className="mt-6 w-full">
                Choose plan
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
