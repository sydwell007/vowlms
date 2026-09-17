import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import careerCourseData from "../../src/data/savva-career-courses.json";
import careerVisuals from "../../src/data/savva-career-visuals.json";
import { isLearnerVisibleUpskillingCourse } from "../../src/lib/upskilling-visibility";

type CourseRecord = {
  slug: string;
  title: string;
  status: string;
  price: number;
  modules: Array<{
    title: string;
    lessons: Array<{
      slug: string;
      type: string;
      content: string;
      vowHuman?: { enabled: boolean; presenterName: string; microphoneEnabled: boolean };
    }>;
  }>;
  assessments: Array<{ slug: string; passMark: number; questions: unknown[] }>;
};

const courses = careerCourseData as unknown as CourseRecord[];
const visualMap = careerVisuals as Record<string, { src: string; alt: string }>;

assert.equal(courses.length, 37, "Exactly 37 SAVVA career courses must be generated");
assert.equal(new Set(courses.map((course) => course.slug)).size, 37, "Course slugs must be unique");

for (const course of courses) {
  assert.equal(course.status, "draft", `${course.slug} must remain admin-only/draft`);
  assert.equal(isLearnerVisibleUpskillingCourse(course), false, `${course.slug} leaked into the learner allowlist`);
  assert.ok(course.price > 0, `${course.slug} needs a launch-ready price`);
  assert.ok(course.modules.length >= 2, `${course.slug} needs orientation and curriculum modules`);
  assert.match(course.modules[0].title, /^Module 0:/, `${course.slug} must begin with Module 0`);
  assert.ok(course.modules.every((module) => module.lessons.length > 0), `${course.slug} has an empty module`);
  assert.ok(course.assessments.length > 0, `${course.slug} needs a certificate-gating assessment`);
  assert.ok(course.assessments.every((assessment) => assessment.passMark >= 80 && assessment.questions.length >= 5));

  const lectureLessons = course.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.type === "text");
  assert.ok(lectureLessons.length > 0, `${course.slug} needs lecture lessons`);
  assert.ok(lectureLessons.every((lesson) => lesson.content.length >= 120), `${course.slug} has thin lesson content`);
  assert.ok(
    lectureLessons.every((lesson) => !/Enable captions|PIPEnterfullscreen|Make a selection to view student answers/i.test(lesson.content)),
    `${course.slug} contains publisher-player scaffolding`,
  );
  assert.ok(
    lectureLessons.every((lesson) => !/[âÃï]/.test(lesson.content)),
    `${course.slug} contains corrupted text encoding`,
  );
  assert.ok(lectureLessons.every((lesson) => lesson.vowHuman?.enabled && lesson.vowHuman.presenterName === "Thandi"));
  assert.ok(lectureLessons.every((lesson) => lesson.vowHuman?.microphoneEnabled));
  assert.ok(visualMap[course.slug]?.src, `${course.slug} needs a course visual`);
  assert.ok(
    existsSync(path.join(process.cwd(), "public", visualMap[course.slug].src.replace(/^\/images\//, "images/"))),
    `${course.slug} course visual is missing on disk`,
  );
}

console.log(`SAVVA career catalogue verified: ${courses.length} admin-only courses, ${courses.reduce((sum, course) => sum + course.modules.length, 0)} modules.`);
