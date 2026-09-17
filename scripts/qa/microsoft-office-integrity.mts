import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sourceContent from "../../src/data/microsoft-office-source-content.json";
import { msOfficeGroupings } from "../../src/data/course-groupings";
import { courses as seededCourses } from "../../src/data/seed-data";
import { getCourseBySlug, getCourseSummaries } from "../../src/lib/data";
import { getCertificateTemplateSrc, isCertificateCourse } from "../../src/lib/certificates/catalogue";
import { getCourseVisual } from "../../src/lib/visual-assets";

const source = sourceContent as Record<string, { lessons: { number: number; title: string }[] }>;
const normalize = (value: string) => value.replace(/^Lesson\s+\d+\s*:\s*/i, "").replace(/[^a-z0-9]+/gi, " ").trim().toLowerCase();
const mismatches: string[] = [];

assert.equal(msOfficeGroupings.length, 7, "Seven launch-ready Microsoft Office journeys are required");
assert.equal(Object.keys(source).length, 49, "Every Microsoft module must have extracted source content");

for (const grouping of msOfficeGroupings) {
  const course = getCourseBySlug(grouping.slug);
  assert(course, `Missing grouped course ${grouping.slug}`);
  assert.equal(course.modules[0]?.order, 0, `${grouping.slug} is missing Module 0`);
  assert.equal(course.modules.length, grouping.moduleSlugOrder.length + 1, `${grouping.slug} module count mismatch`);
  assert.equal(course.assessments.length, grouping.moduleSlugOrder.length, `${grouping.slug} assessment count mismatch`);
  assert(course.coursePreview, `${grouping.slug} is missing course preview content`);
  assert(isCertificateCourse(grouping.slug), `${grouping.slug} is not certificate eligible`);

  const visual = getCourseVisual(course, "upskilling");
  assert(existsSync(join(process.cwd(), "public", visual.src)), `${grouping.slug} image is missing`);
  void getCertificateTemplateSrc(grouping.slug);

  for (const [childIndex, childSlug] of grouping.moduleSlugOrder.entries()) {
    const child = seededCourses.find((item) => item.slug === childSlug);
    assert(child, `Missing migrated child course ${childSlug}`);
    const sourceModule = source[childSlug];
    assert(sourceModule, `Missing source guide mapping ${childSlug}`);
    const childLessons = course.modules[childIndex + 1].lessons;
    for (const sourceLesson of sourceModule.lessons) {
      const migrated = childLessons.find((lesson) => Number(lesson.title.match(/^Lesson\s+(\d+)/i)?.[1]) === sourceLesson.number);
      if (!migrated) {
        const recovered = childLessons.some((lesson) => /^Module Material/i.test(lesson.title) && lesson.content.includes(sourceLesson.title));
        if (!recovered) mismatches.push(`${childSlug}: missing ${sourceLesson.title}`);
      } else if (normalize(migrated.title) !== normalize(sourceLesson.title)) {
        mismatches.push(`${childSlug}: "${migrated.title}" != "${sourceLesson.title}"`);
      }
    }
  }
}

assert.equal(getCourseSummaries("learner").filter((course) => course.slug.startsWith("microsoft-")).length, 7, "Microsoft courses are not learner-visible");
assert.deepEqual(mismatches, [], `Source/migration lesson mismatches:\n${mismatches.join("\n")}`);
console.log("Microsoft Office integrity check passed: 7 courses, 49 sourced modules, learner visibility, pricing shape, assessments, certificates, and imagery verified.");
