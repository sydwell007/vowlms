import manifestJson from "./upskilling-practices.json";
import type { Lesson, VRPractice } from "@/types/lms";

type PracticeManifest = {
  schemaVersion: string;
  generatedAt: string;
  summary: {
    courseCount: number;
    moduleCount: number;
    practiceCount: number;
    taskCount: number;
    status: string;
  };
  practices: VRPractice[];
};

export const upskillingPracticeManifest = manifestJson as PracticeManifest;
export const upskillingModulePractices = upskillingPracticeManifest.practices;

const practicesByCourseAndModule = new Map(
  upskillingModulePractices.map((practice) => [
    `${practice.courseSlug}:${practice.moduleOrder}`,
    practice,
  ]),
);

export function getUpskillingModulePractice(courseSlug: string, moduleOrder: number) {
  return practicesByCourseAndModule.get(`${courseSlug}:${moduleOrder}`);
}

export function createVRPracticeLesson(practice: VRPractice): Lesson {
  return {
    slug: practice.lessonSlug,
    title: practice.title,
    type: "vr-practice",
    content: practice.briefing ?? practice.scenario,
    hasAssessment: false,
    hasVRPractice: true,
    durationMinutes: practice.estimatedMinutes ?? 25,
  };
}

export function insertPracticeAfterAssessment(lessons: Lesson[], practice: VRPractice): Lesson[] {
  const practiceLesson = createVRPracticeLesson(practice);
  const withoutExisting = lessons.filter((lesson) => lesson.slug !== practiceLesson.slug);
  const assessmentIndex = withoutExisting.findIndex(
    (lesson) => lesson.slug === practice.assessmentLessonSlug || lesson.type === "assessment",
  );

  if (assessmentIndex < 0) return [...withoutExisting, practiceLesson];

  return [
    ...withoutExisting.slice(0, assessmentIndex + 1),
    practiceLesson,
    ...withoutExisting.slice(assessmentIndex + 1),
  ];
}
