import { CourseCard } from "@/components/courses/CourseCard";
import { Section } from "@/components/ui/Section";
import { getCourses } from "@/lib/data";

export const metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  const courses = getCourses();

  return (
    <main>
      <Section
        tone="light"
        eyebrow="Course catalogue"
        title="Focused courses with assessment, VR, certificate, and rewards flow"
        description="The local build uses seeded courses across every academy so teams can demo the full learner pathway immediately."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Section>
    </main>
  );
}
