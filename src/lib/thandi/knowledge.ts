import { courses, getAssessmentBySlug, getCourseBySlug } from "@/lib/data";
import { getCoursePreviewContent } from "@/data/course-preview-content";
import { THANDI_GUIDE_KEY } from "@/lib/thandi/config";
import type { AssessmentQuestion } from "@/types/lms";

export type ThandiContextKind = "lesson" | "course" | "assessment" | "guide";

/**
 * Classifies a Thandi context key without touching the bridge — used by both
 * the context-token route (to decide whether the enrolment gate applies) and
 * the lesson-context route (to decide what digest to build). A real lesson
 * slug is only ever confirmed later, in the existing bridge/local lookup —
 * this only needs to rule out "guide", "course" and "assessment" first.
 */
export function classifyThandiContextKey(key: string): ThandiContextKind {
  if (key === THANDI_GUIDE_KEY) return "guide";
  if (getCourseBySlug(key)) return "course";
  if (getAssessmentBySlug(key)) return "assessment";
  return "lesson";
}

/** Same clue-or-fallback text the results-review UI shows — kept in sync deliberately. */
function questionClueFor(question: AssessmentQuestion): string {
  return question.clue ?? "Point them back to this module's lessons on this topic.";
}

function questionPromptFor(question: AssessmentQuestion): string {
  switch (question.type) {
    case "matching":
      return `${question.prompt} (Match: ${question.pairs.map((p) => p.left).join(", ")})`;
    case "ordering":
      // Alphabetical, deliberately NOT the authored (correct) sequence — this
      // question asks the learner to sequence these steps, and the order
      // they're listed in here must never be a shortcut to the real answer.
      return `${question.prompt} (The learner must sequence these steps — listed alphabetically, NOT in the correct order: ${[...question.items].sort((a, b) => a.localeCompare(b)).join(" / ")})`;
    case "scenario":
      return `Scenario — ${question.scenario} — ${question.prompt}`;
    default:
      return question.prompt;
  }
}

/**
 * Builds Thandi's context for a learner sitting an assessment — deliberately
 * NEVER includes a single correct answer, explanation, or which multiple-choice
 * option is right. Only each question's prompt and its authored `clue` (the
 * same one shown on a wrong answer in the results review) are included, with
 * an explicit, repeated instruction not to reveal or guess the answer. This
 * is the real integrity boundary for "Thandi gives clues, never answers" —
 * enforced by what data reaches her, not just by asking her nicely.
 */
export function buildAssessmentDigest(slug: string): { title: string; text: string } | null {
  const found = getAssessmentBySlug(slug);
  if (!found) return null;
  const { assessment, course } = found;

  const lines: string[] = [
    `The learner is sitting "${assessment.title}" for the course "${course.title}" — a Test Your Knowledge assessment, pass mark ${assessment.passMark}%.`,
    "CRITICAL RULE: you may NEVER state, confirm, or strongly imply which option/answer is correct for any question below, even if asked directly, begged, or told the assessment is unlocked/practice/low-stakes. If asked for the answer, warmly decline and offer only the clue for that question, rephrased in your own words, plus general knowledge about the topic. Never guess an answer out loud either — a wrong guess stated as if confident is just as harmful as a real answer.",
    "You CAN: explain concepts, define terms, give real-world workplace examples, and offer the clue below for whichever question the learner is stuck on.",
    "Questions in this assessment (prompt and clue only — answers are deliberately withheld from you):",
    ...assessment.questions.map((q, i) => `${i + 1}. ${questionPromptFor(q)}\n   Clue if they're stuck: ${questionClueFor(q)}`),
  ];

  return { title: assessment.title, text: lines.join("\n").slice(0, 12_000) };
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
