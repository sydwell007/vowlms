import { courses, getCourseBySlug } from "@/lib/data";
import { getCoursePreviewContent } from "@/data/course-preview-content";
import { THANDI_GUIDE_KEY } from "@/lib/thandi/config";

export type ThandiContextKind = "lesson" | "course" | "guide";

/**
 * Classifies a Thandi context key without touching the bridge — used by both
 * the context-token route (to decide whether the enrolment gate applies) and
 * the lesson-context route (to decide what digest to build). A real lesson
 * slug is only ever confirmed later, in the existing bridge/local lookup —
 * this only needs to rule out "guide" and "course" first.
 */
export function classifyThandiContextKey(key: string): ThandiContextKind {
  if (key === THANDI_GUIDE_KEY) return "guide";
  if (getCourseBySlug(key)) return "course";
  return "lesson";
}

/**
 * Builds a rich, real digest of one course — title, why-it-matters copy,
 * benefits, level/duration, and the full module → lesson outline (the same
 * source data that powers the Course Preview tab) — so Thandi can speak to
 * exactly what a learner sees on that course's page.
 */
export function buildCourseDigest(slug: string): { title: string; text: string } | null {
  const course = getCourseBySlug(slug);
  if (!course) return null;

  const preview = course.coursePreview ?? getCoursePreviewContent(slug);
  const lines: string[] = [
    `Course: ${course.title}`,
    course.description,
  ];
  if (preview?.purpose) lines.push(`Why it matters: ${preview.purpose}`);
  if (preview?.benefits?.length) {
    lines.push(`Benefits of completing this course: ${preview.benefits.join("; ")}`);
  }
  lines.push(`Level: ${course.level}. Duration: ${course.duration}.`);
  if (course.outcomes.length) {
    lines.push(`By the end, learners can: ${course.outcomes.join("; ")}`);
  }
  lines.push("Module and lesson outline:");
  course.modules.forEach((module, index) => {
    lines.push(`Module ${index + 1}: ${module.title}`);
    module.lessons.forEach((lesson) => lines.push(`  - ${lesson.title}`));
  });
  if (course.vrPractices.length) {
    lines.push(`This course includes ${course.vrPractices.length} VR practice scenario(s).`);
  }
  lines.push(`Completing this course earns VOWR rewards on the learner's VowLMS wallet.`);

  return { title: course.title, text: lines.join("\n").slice(0, 12_000) };
}

/**
 * The general "know everything about VowLMS" digest, used whenever a learner
 * isn't on a specific lesson or course page (dashboard, catalogue, rewards,
 * certificates, etc.). Lists every real Upskilling Academy course by title
 * and description so Thandi can recommend or describe any of the 20 by name.
 */
export function buildSiteDigest(): string {
  const upskilling = courses.filter((c) => c.academySlug === "upskilling-academy");

  const lines: string[] = [
    "You are Thandi, the 24/7 AI tutor built into VowLMS, GoalVow's learning platform.",
    "VowLMS offers the Upskilling Academy: 20 short courses covering workplace, digital, wellbeing, and career-readiness skills. Each has modules, lessons, an assessment, and a certificate on completion.",
    "Learners browse the catalogue at /courses, open a course's Course Preview tab to see its purpose, benefits, and full module/lesson outline before enrolling, enrol, then work through Curriculum lessons, take assessments, and earn a certificate.",
    "VowRewards (VOWR) is VowLMS's own reward wallet: learners earn VOWR for real milestones (first lesson completed, first assessment passed, certificate issued) and can view balance, history, and redemption options at /rewards.",
    "Course pages also have a Reviews tab (real learner ratings) and a Teaching team tab.",
    "If a learner seems stuck on navigation, point them to: /dashboard (their progress), /courses (catalogue), /rewards (VOWR wallet), /certificates (earned certificates), or VowSupport (/support) for account issues Thandi can't resolve.",
    "The 20 Upskilling Academy courses are:",
    ...upskilling.map((c) => `- ${c.title}: ${c.description}`),
  ];

  return lines.join("\n").slice(0, 12_000);
}
