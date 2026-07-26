import { Section } from "@/components/ui/Section";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata = {
  title: "Path Finder Quiz",
  description: "Answer 4 quick questions and get matched to the right GoalVow academy and courses.",
};

export default function QuizPage() {
  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Path finder</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold sm:text-6xl">
            Not sure where to start? Let's find out.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            Answer 4 quick questions and we'll recommend the GoalVow academy and courses that fit you best.
          </p>
        </div>
      </section>

      <Section tone="light">
        <OnboardingFlow initialStep="quiz" />
      </Section>
    </main>
  );
}
