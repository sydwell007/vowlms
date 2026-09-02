import type { Course, CourseModule, Lesson } from "@/types/lms";

/**
 * Title patterns for module scaffolding items — reading material, summaries,
 * ratings, certificates, intros — that are real curriculum entries but not
 * teaching lessons in their own right. Assessments are excluded separately by
 * `type` rather than title, since their wording varies ("Knowledge check",
 * "External Assessment", "Module Assessment: Test Your Knowledge", ...).
 * Deliberately a negative filter (exclude known scaffolding) rather than a
 * positive one (require "Lesson N:") — lesson-title conventions vary widely
 * across academies (e.g. Skills Training's "Theory Knowledge Module N: ...",
 * "Practical Skills Training Module N: ...").
 */
const NON_LESSON_TITLE_PATTERNS: RegExp[] = [
  /certificate/i,
  /reading material/i,
  /^module material/i,
  /^course material$/i,
  /^module summary$/i,
  /^course summary/i,
  /^summary$/i,
  /learning outcome/i,
  /^course (introduction|preview)/i,
  /entry requirements/i,
  /rate this module/i,
  /knowledge check/i,
  /course final exam/i,
  /^course project$/i,
];

/** True for a real teaching lesson — false for assessments and module scaffolding (see above). */
function isRealLesson(lesson: Lesson): boolean {
  if (lesson.type === "assessment") return false;
  const title = lesson.title.trim();
  return !NON_LESSON_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

export type ModuleStats = {
  lessonCount: number;
  totalMinutes: number;
  hasAssessment: boolean;
  hasVRPractice: boolean;
  hasCertificate: boolean;
};

export function getModuleStats(moduleItem: CourseModule): ModuleStats {
  const nonAssessment = moduleItem.lessons.filter((l) => l.type !== "assessment");
  const realLessons = moduleItem.lessons.filter(isRealLesson);
  // A handful of short trailing sections (e.g. just "Course introduction" + "Knowledge
  // check", or "Course Summary and Final Exam" + "Certificate of Completion") contain no
  // "Lesson N:"-style content at all — falling back to every non-assessment item there
  // avoids showing a nonsensical "0 lessons" for a module that clearly has content.
  const countedLessons = realLessons.length > 0 ? realLessons : nonAssessment;
  const lessonCount = countedLessons.length;
  const totalMinutes = countedLessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
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

export type PathwayStats = {
  courseCount: number;
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
};

/** Aggregate stats across every course in a Skill Pathway. */
export function getPathwayStats(courses: Course[]): PathwayStats {
  let moduleCount = 0;
  let lessonCount = 0;
  let totalMinutes = 0;

  for (const course of courses) {
    const stats = getCourseStats(course);
    moduleCount += stats.moduleCount;
    lessonCount += stats.lessonCount;
    totalMinutes += stats.totalMinutes;
  }

  return { courseCount: courses.length, moduleCount, lessonCount, totalMinutes };
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return "Self-paced";
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

const RECOMMENDED_WEEKLY_STUDY_MINUTES = 180;

export function formatCourseDurationWeeks(totalMinutes: number): string {
  const weeks = Math.max(1, Math.ceil(totalMinutes / RECOMMENDED_WEEKLY_STUDY_MINUTES));
  return `${weeks} week${weeks === 1 ? "" : "s"}`;
}

/** First few lessons with real topical content — used for auto-generated module copy and preview chips. */
export function getModuleTopics(moduleItem: CourseModule, max = 3): Lesson[] {
  return moduleItem.lessons
    .filter(isRealLesson)
    .filter((l) => !/^lesson\s*\d+\s*[:.-]?\s*$/i.test(l.title.trim()))
    .slice(0, max);
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
