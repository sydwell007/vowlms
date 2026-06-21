import { AcademyCard } from "@/components/academies/AcademyCard";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAcademies, getCourses } from "@/lib/data";

export const metadata = {
  title: "Academies — GoalVow LMS",
};

export default function AcademiesPage() {
  const academies = getAcademies();
  const courses = getCourses();

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">GoalVow Holdings</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">
            6 academies. {courses.length.toLocaleString()} courses. One platform.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">
            From workplace upskilling and culinary arts to university degrees — every GoalVow Academy delivers verified certificates, VowRewards points, and PlugConnect opportunity matching.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/courses">Browse all courses</ButtonLink>
            <ButtonLink href="/auth/signup" variant="secondary">Create account</ButtonLink>
          </div>
        </div>
      </section>

      {/* Academies grid */}
      <Section
        tone="light"
        eyebrow="Academy network"
        title="Choose your learning pathway"
        description="Each academy serves a distinct learner audience with purpose-built courses, facilitator support, and a direct route from completion to real-world opportunities."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => {
            const count = courses.filter((c) => c.academySlug === academy.slug).length;
            return (
              <AcademyCard key={academy.slug} academy={academy} courseCount={count} />
            );
          })}
        </div>
      </Section>

      {/* Why GoalVow */}
      <section className="premium-section-dark py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold text-center">Why GoalVow LMS</p>
          <h2 className="mt-4 text-center text-3xl font-semibold sm:text-4xl">
            Learning that leads to something real
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "🏅",
                title: "Verified certificates",
                description: "Every completed course generates a downloadable, shareable GoalVow certificate with a unique verification ID.",
              },
              {
                icon: "⭐",
                title: "VowRewards points",
                description: "Earn points for every lesson, assessment pass, VR practice session, and course completion — redeemable across the ecosystem.",
              },
              {
                icon: "🎯",
                title: "Opportunity matching",
                description: "Course completions route directly into PlugConnect for employment, internship, supplier, and entrepreneurship opportunities.",
              },
            ].map((item) => (
              <div key={item.title} className="premium-card-dark rounded-2xl p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
