import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { getSkillPathways, getSkillPathwayBySlug } from "@/lib/data";
import { getPathwayStats, formatDuration } from "@/lib/course-content";

export const metadata = {
  title: "Skill Pathways",
  description: "Curated GoalVow course curricula, grouped by the real workplace skill they build.",
  alternates: { canonical: "/learn/pathways" },
};

export default function SkillPathwaysPage() {
  const pathways = getSkillPathways();

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Learning · Skill Pathways</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">
            Build a skill, not just a certificate
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/74">
            Each pathway groups a handful of real GoalVow courses into a curated curriculum for one workplace skill.
            Complete every course in a pathway, and you have a concrete, CV-ready answer to
            &ldquo;what makes you competent at this?&rdquo;
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pathways.map((pathway) => {
            const result = getSkillPathwayBySlug(pathway.slug);
            const stats = result ? getPathwayStats(result.courses) : null;

            return (
              <Link
                key={pathway.slug}
                href={`/learn/pathways/${pathway.slug}`}
                className="premium-card flex h-full flex-col rounded-xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1166c8]/10 text-xl">
                  {pathway.icon}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-ink">{pathway.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{pathway.skillStatement}</p>
                {stats ? (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted">
                    <span>📚 {stats.courseCount} courses</span>
                    <span>⏱ {formatDuration(stats.totalMinutes)}</span>
                  </div>
                ) : null}
                <span className="mt-4 text-sm font-semibold text-[#1166c8]">View pathway →</span>
              </Link>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
