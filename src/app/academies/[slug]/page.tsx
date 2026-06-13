import { notFound } from "next/navigation";
import { CourseCard } from "@/components/courses/CourseCard";
import { Section } from "@/components/ui/Section";
import { getAcademyBySlug, getCoursesByAcademy } from "@/lib/data";

export default async function AcademyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const academy = getAcademyBySlug(slug);

  if (!academy) {
    notFound();
  }

  const courses = getCoursesByAcademy(academy.slug);

  return (
    <main>
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{academy.category.replaceAll("-", " ")}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-6xl">{academy.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74">{academy.heroMessage}</p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/64">{academy.description}</p>
        </div>
      </section>
      <Section tone="light" title="Sample courses" description={academy.audience}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Section>
    </main>
  );
}
