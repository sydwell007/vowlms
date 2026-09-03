import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { PathwayCourseList } from "@/components/learning/PathwayCourseList";
import { getSkillPathwayBySlug } from "@/lib/data";
import { getPathwayStats, formatDuration } from "@/lib/course-content";
import { getServerRole } from "@/lib/auth/getServerRole";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = await getServerRole();
  const result = getSkillPathwayBySlug(slug, role);
  if (!result) return { title: "Skill Pathway", robots: { index: false, follow: false } };
  return {
    title: `${result.pathway.title} — Skill Pathway`,
    description: result.pathway.description,
    alternates: { canonical: `/learn/pathways/${result.pathway.slug}` },
  };
}

export default async function SkillPathwayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = await getServerRole();
  const result = getSkillPathwayBySlug(slug, role);

  if (!result) {
    notFound();
  }

  const { pathway, courses } = result;
  const stats = getPathwayStats(courses);
  const firstCourse = courses[0];

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
            <Link href="/learn/pathways" className="hover:text-white transition">Skill Pathways</Link>
            <span>/</span>
            <span className="text-white/80">{pathway.title}</span>
          </div>

          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            {pathway.icon}
          </span>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">{pathway.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gold">{pathway.skillStatement}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/74">{pathway.description}</p>
          <p className="mt-4 text-sm text-white/60">
            <span className="font-semibold text-white/80">Ideal for:</span> {pathway.idealFor}
          </p>

          {firstCourse ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/courses/${firstCourse.slug}`}>Start with course 1</ButtonLink>
              <ButtonLink href="/learn/pathways" variant="secondary">All pathways</ButtonLink>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 sm:grid-cols-4 lg:px-8">
          {[
            { label: "Courses", value: String(stats.courseCount) },
            { label: "Modules", value: String(stats.moduleCount) },
            { label: "Lessons", value: String(stats.lessonCount) },
            { label: "Total time", value: formatDuration(stats.totalMinutes) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-[#1166c8] sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section
        tone="light"
        eyebrow="Curriculum"
        title="Complete these courses, in order"
        description="Each course keeps its own real certificate on completion. Finishing every course below is how you build and can show this pathway's skill."
      >
        <PathwayCourseList
          courses={courses.map((c) => ({ slug: c.slug, title: c.title, level: c.level, duration: c.duration, price: c.price }))}
        />
      </Section>

      <Section title="Take this to your CV">
        <div className="premium-card-dark rounded-xl p-6">
          <p className="text-sm leading-7 text-white/80">
            GoalVow doesn&apos;t issue a separate certificate for the pathway itself — what you get is the real,
            individual certificate from every course above. Together, they&apos;re evidence you can list on a CV or
            LinkedIn profile: &ldquo;Completed the GoalVow {pathway.title} pathway — {stats.courseCount} courses covering{" "}
            {courses.map((c) => c.title).join(", ")}.&rdquo;
          </p>
        </div>
      </Section>
    </main>
  );
}
