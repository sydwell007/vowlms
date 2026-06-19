import { notFound } from "next/navigation";
import { getLessonBySlug } from "@/lib/data";
import { LessonPlayer } from "@/components/learning/LessonPlayer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getLessonBySlug(slug);
  return { title: result?.lesson.title ?? "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getLessonBySlug(slug);

  if (!result) notFound();

  const { lesson, course, module } = result;

  // Build flat lesson list for prev/next navigation
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <LessonPlayer
      lesson={lesson}
      course={course}
      module={module}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      allModules={course.modules}
      currentLessonSlug={slug}
    />
  );
}
