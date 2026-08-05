// Content integrity check — imports the same runtime data the app uses, so results
// can never drift out of sync with a hardcoded course count.
import { pathToFileURL } from "node:url";
import { getCourses, getAcademies } from "../../src/lib/data.ts";

function run() {
  const courses = getCourses();
  const academies = getAcademies();

  const byAcademy = new Map();
  for (const course of courses) {
    byAcademy.set(course.academySlug, (byAcademy.get(course.academySlug) ?? 0) + 1);
  }

  const countsByAcademy = academies.map((academy) => ({
    academy: academy.name,
    slug: academy.slug,
    category: academy.category,
    courseCount: byAcademy.get(academy.slug) ?? 0,
  }));

  const emptyCourses = courses.filter(
    (c) => !c.title?.trim() || !c.description?.trim() || c.modules.length === 0,
  );

  const seenPerAcademy = new Map();
  const duplicates = [];
  for (const course of courses) {
    const key = `${course.academySlug}::${course.title.trim().toLowerCase()}`;
    if (seenPerAcademy.has(key)) {
      duplicates.push({ academySlug: course.academySlug, title: course.title, slugs: [seenPerAcademy.get(key), course.slug] });
    } else {
      seenPerAcademy.set(key, course.slug);
    }
  }

  const orphaned = courses.filter((c) => !academies.some((a) => a.slug === c.academySlug));

  const result = {
    totalCourses: courses.length,
    countsByAcademy,
    emptyCourses: emptyCourses.map((c) => c.slug),
    duplicateTitles: duplicates,
    orphanedCourses: orphaned.map((c) => c.slug),
    overallStatus: emptyCourses.length === 0 && duplicates.length === 0 && orphaned.length === 0 ? "PASS" : "FAIL",
  };

  return result;
}

const result = run();

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(result, null, 2));
  if (result.overallStatus !== "PASS") process.exitCode = 1;
}

export { run };
