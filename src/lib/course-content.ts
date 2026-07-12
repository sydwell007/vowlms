import type { Course, CourseModule, Lesson } from "@/types/lms";

/** Lesson titles that don't carry real topic content — excluded from auto-generated "topics covered" copy. */
const NON_TOPIC_LESSON_TITLES = new Set([
  "learning outcome",
  "module reading material",
  "module summary",
  "rate this module",
]);

const MODULE_ICONS = ["🎯", "📘", "🧭", "🛠️", "💡", "🔑", "📈", "🧩", "⚙️", "🌱", "🧠", "🚀"];

export type ModuleStats = {
  lessonCount: number;
  totalMinutes: number;
  hasAssessment: boolean;
  hasVRPractice: boolean;
  hasCertificate: boolean;
};

export function getModuleStats(moduleItem: CourseModule): ModuleStats {
  const lessonCount = moduleItem.lessons.length;
  const totalMinutes = moduleItem.lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
  const hasAssessment = moduleItem.lessons.some((l) => l.type === "assessment");
  const hasVRPractice = moduleItem.lessons.some((l) => l.type === "vr-practice");
  const hasCertificate = moduleItem.lessons.some((l) => /certificate/i.test(l.title));
  return { lessonCount, totalMinutes, hasAssessment, hasVRPractice, hasCertificate };
}

export function getCourseStats(course: Course) {
  const moduleCount = course.modules.length;
  let lessonCount = 0;
  let totalMinutes = 0;
  let hasAssessment = false;
  let hasVRPractice = false;

  for (const moduleItem of course.modules) {
    const stats = getModuleStats(moduleItem);
    lessonCount += stats.lessonCount;
    totalMinutes += stats.totalMinutes;
    hasAssessment = hasAssessment || stats.hasAssessment;
    hasVRPractice = hasVRPractice || stats.hasVRPractice;
  }

  return { moduleCount, lessonCount, totalMinutes, hasAssessment, hasVRPractice };
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return "Self-paced";
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/** First few lessons with real topical content — used for auto-generated module copy and preview chips. */
export function getModuleTopics(moduleItem: CourseModule, max = 3): Lesson[] {
  return moduleItem.lessons
    .filter((l) => !NON_TOPIC_LESSON_TITLES.has(l.title.trim().toLowerCase()))
    .filter((l) => !/^lesson\s*\d+\s*[:.-]?\s*$/i.test(l.title.trim()))
    .slice(0, max);
}

export function getModuleIcon(index: number): string {
  return MODULE_ICONS[index % MODULE_ICONS.length];
}

/** Real `modules.description` when present, otherwise a readable auto-generated summary. */
export function getModuleDescription(moduleItem: CourseModule): string {
  if (moduleItem.description) return moduleItem.description;

  const { lessonCount, totalMinutes, hasAssessment, hasVRPractice } = getModuleStats(moduleItem);
  const topics = getModuleTopics(moduleItem, 3).map((l) =>
    l.title.replace(/^Lesson\s*\d+\s*[:.-]?\s*/i, "").trim(),
  );

  const topicPhrase = topics.length > 0 ? ` covering ${topics.join(", ")}` : "";
  const closer = hasAssessment
    ? " Wraps up with a knowledge-check assessment."
    : hasVRPractice
      ? " Includes hands-on VR practice."
      : "";

  return `${lessonCount} lesson${lessonCount === 1 ? "" : "s"} · about ${formatDuration(totalMinutes)}${topicPhrase}.${closer}`;
}

/** Real `modules.outcome` when present, otherwise an auto-generated "you'll be able to" line. */
export function getModuleOutcome(moduleItem: CourseModule): string {
  if (moduleItem.outcome) return moduleItem.outcome;
  return `Apply the core techniques of "${moduleItem.title}" with confidence in real workplace situations.`;
}
