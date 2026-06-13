import { AcademyCard } from "@/components/academies/AcademyCard";
import { Section } from "@/components/ui/Section";
import { getAcademies } from "@/lib/data";

export const metadata = {
  title: "Academies",
};

export default function AcademiesPage() {
  const academies = getAcademies();

  return (
    <main>
      <Section
        tone="light"
        eyebrow="Academies"
        title="GoalVow academy catalogue"
        description="Each academy includes seeded courses, clear learner audiences, and a focused pathway into practice, rewards, and opportunities."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => (
            <AcademyCard key={academy.slug} academy={academy} />
          ))}
        </div>
      </Section>
    </main>
  );
}
