import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getAcademies, getCourses } from "@/lib/data";

export const metadata = { title: "About GoalVow - VowLMS" };

const values = [
  { title: "Practical learning", description: "Course pathways are organised around knowledge learners can use in study, work, enterprise, and everyday life." },
  { title: "Evidence before claims", description: "Catalogue, progress, payment, and outcome information is published from traceable platform records." },
  { title: "Accessible by design", description: "VowLMS prioritises responsive pages, clear navigation, keyboard access, and efficient delivery for mobile learners." },
];

const ecosystem = [
  { name: "VowLMS", description: "Academy discovery, enrolment, lessons, assessments, progress, and certificate records.", href: "/" },
  { name: "VowRewards", description: "A rewards layer for eligible learning milestones recorded by the platform.", href: "/rewards" },
  { name: "PlugConnect", description: "The planned route from approved learner evidence to published opportunities.", href: "/opportunities" },
  { name: "VowSupport", description: "A clear support route for access, account, learning, and partnership enquiries.", href: "/support" },
  { name: "SkillsShop", description: "A planned marketplace for academy-aligned learning and enterprise resources.", href: "/skillsshop" },
  { name: "Innovation Labs", description: "The development pathway for Skills Practice, VR, and future learning tools.", href: "/innovation-labs" },
];

export default function AboutPage() {
  const courses = getCourses();
  const connectedAcademies = getAcademies().filter((academy) => academy.slug !== "sports-academy").length;

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">About GoalVow</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold sm:text-6xl">
            One learning platform for the GoalVow academy network
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
            VowLMS brings {courses.length.toLocaleString()} catalogue courses from {connectedAcademies} connected Moodle academies into a consistent discovery and learner experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/courses">Browse courses</ButtonLink>
            <ButtonLink href="/academies" variant="secondary">View academies</ButtonLink>
          </div>
        </div>
      </section>

      <Section tone="light" eyebrow="Purpose" title="Learning with a clear next step">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="premium-card rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-ink">Our mission</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Make useful learning easier to discover, complete, and carry forward through reliable progress records, support, rewards, and opportunity pathways.
            </p>
          </div>
          <div className="premium-card-dark rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white">Current platform foundation</h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              Six academy connections are verified. Sports Academy remains a planned pathway until its catalogue and delivery model are approved.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Principles" title="How VowLMS is being built">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="premium-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{value.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="light" eyebrow="GoalVow ecosystem" title="Connected services, introduced with evidence">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ecosystem.map((service) => (
            <Link key={service.name} href={service.href} className="premium-card block rounded-lg p-6 transition hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold text-ink">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{service.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <section className="premium-section-dark py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-semibold">Explore the academy network</h2>
          <p className="mt-4 text-base text-white/70">Compare current courses, delivery details, and prices before choosing a pathway.</p>
          <ButtonLink href="/courses" className="mt-8">Explore courses</ButtonLink>
        </div>
      </section>
    </main>
  );
}
