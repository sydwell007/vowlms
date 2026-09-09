import { Section } from "@/components/ui/Section";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { getCourseSummaries } from "@/lib/data";

export const metadata = {
  title: "Find My Path",
  description: "Tell VowLMS what you want to achieve and get matched to the right courses.",
  alternates: { canonical: "/find-my-path" },
};

export default function FindMyPathPage() {
  const courses = getCourseSummaries();
  return (
    <main>
      <section className="visual-hero hero-pathways py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Find my path</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold sm:text-6xl">
            What do you want to achieve?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            Tell us your goal and we'll match you to the right courses — no need to know which academy you need.
          </p>
        </div>
      </section>

      <Section tone="light">
        <OnboardingFlow courses={courses} />
      </Section>
    </main>
  );
}
