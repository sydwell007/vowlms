import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { getCourses } from "@/lib/data";

export const metadata = {
  title: "VR Practice",
};

export default function VRPracticeIndexPage() {
  const practices = getCourses().flatMap((course) =>
    course.vrPractices.map((practice) => ({
      courseTitle: course.title,
      ...practice,
    })),
  );

  return (
    <main>
      <Section
        tone="light"
        eyebrow="VR Practice"
        title="Simulation-ready practical learning spaces"
        description="Each academy can surface guided practice scenarios with facilitator scoring, future headset support, and connected learning evidence."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {practices.map((practice) => (
            <article key={practice.slug} className="premium-card flex h-full flex-col rounded-xl p-6 text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">{practice.courseTitle}</p>
              <h2 className="mt-3 text-2xl font-semibold">{practice.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted">{practice.scenario}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {practice.skillsPracticed.map((skill) => (
                  <span key={skill} className="rounded-full bg-[#e8f6ff] px-3 py-1 text-xs font-semibold text-[#1166c8]">
                    {skill}
                  </span>
                ))}
              </div>
              <ButtonLink href={`/vr-practice/${practice.slug}`} variant="ink" className="mt-6 self-start">
                Open scenario
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
