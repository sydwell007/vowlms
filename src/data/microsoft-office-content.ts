import sourceContent from "@/data/microsoft-office-source-content.json";
import type { Lesson } from "@/types/lms";

type SourceLesson = { number: number; title: string; content: string };
type SourceModule = { guide: string; overview: string; lessons: SourceLesson[] };

const modules = sourceContent as Record<string, SourceModule>;

function sourceNote(guide: string) {
  return `<aside><strong>Source-aligned learning:</strong> This lesson is adapted from the supplied Microsoft courseware student guide (${guide}) and organised for the VowLMS learning experience.</aside>`;
}

export function enrichMicrosoftOfficeLessons(childSlug: string, lessons: Lesson[]): Lesson[] {
  const source = modules[childSlug];
  if (!source) return lessons;

  const migratedLessonNumbers = new Set(
    lessons
      .map((lesson) => Number(lesson.title.match(/^Lesson\s+(\d+)\s*:/i)?.[1]))
      .filter((number) => Number.isFinite(number)),
  );
  const recoveredSourceLessons = source.lessons
    .filter((lesson) => !migratedLessonNumbers.has(lesson.number))
    .map((lesson) => `<h2>${lesson.title}</h2>${lesson.content}`)
    .join("");
  const lessonList = `<ol>${source.lessons.map((lesson) => `<li>${lesson.title}</li>`).join("")}</ol>`;
  return lessons.map((lesson) => {
    if (lesson.type !== "text") return lesson;

    const match = lesson.title.trim().match(/^Lesson\s+(\d+)\s*:/i);
    if (match) {
      const sourceLesson = source.lessons.find((item) => item.number === Number(match[1]));
      if (sourceLesson) return { ...lesson, title: sourceLesson.title, content: `${sourceLesson.content}${sourceNote(source.guide)}` };
    }

    if (/^Learning Outcome/i.test(lesson.title)) {
      return { ...lesson, content: `<h2>Module purpose and outcomes</h2>${source.overview}<h2>Lessons in this module</h2>${lessonList}${sourceNote(source.guide)}` };
    }
    if (/^Module Material/i.test(lesson.title)) {
      return { ...lesson, content: `<h2>Your guided module brief</h2>${source.overview}<h2>Learning sequence</h2>${lessonList}${recoveredSourceLessons ? `<h2>Recovered source lesson</h2><p>This source lesson was absent from the original Moodle migration, so it is included here to keep the curriculum complete without changing existing progress identifiers.</p>${recoveredSourceLessons}` : ""}<p>Complete each lesson in order, practise in the relevant Office application, and retain your working files as evidence of applied learning.</p>${sourceNote(source.guide)}` };
    }
    if (/^Summary/i.test(lesson.title)) {
      return { ...lesson, content: `<h2>Module review</h2><p>You have worked through the following source-aligned skills:</p>${lessonList}<h2>Professional application</h2><p>Reopen your practice files, correct anything that did not work as expected, and complete one final task without step-by-step guidance before attempting the assessment.</p>${sourceNote(source.guide)}` };
    }
    return lesson;
  });
}

export function isMicrosoftOfficeModule(childSlug: string) {
  return childSlug in modules;
}
