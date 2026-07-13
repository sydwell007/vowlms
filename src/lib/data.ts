import {
  academies as seededAcademies,
  courses as rawCourses,
} from "@/data/seed-data";
import {
  allGroupings,
  consumedSlugs,
  parentPlaceholderSlugs,
} from "@/data/course-groupings";
import type { Academy, Course, CourseModule, LearningHub, Opportunity } from "@/types/lms";

const sportsAcademy: Academy = {
  slug: "sports-academy",
  name: "Sports Academy",
  description:
    "Sport, wellness, coaching, and performance learning pathways. Course availability will be published after programme confirmation.",
  audience: "Athletes, coaches, clubs, schools, and wellness practitioners",
  category: "sports-academy",
  heroMessage: "Build knowledge for safer participation, stronger performance, and sustainable sport pathways.",
  sampleCourseSlugs: [],
};

const academies = [...seededAcademies, sportsAcademy];

/**
 * Build a flat map of slug → Course from the raw seed data.
 * Used by buildGroupedCourses() to look up child module courses.
 */
const rawCourseMap = new Map<string, Course>(rawCourses.map((c) => [c.slug, c]));

/**
 * Clean a Moodle module title for display as a CourseModule title.
 * Strips leading "Module N: " prefix and trims whitespace.
 */
function cleanModuleTitle(title: string): string {
  return title.replace(/^Module\s+\d+[:\s]+/i, "").trim();
}

/**
 * Assemble a parent Course from a grouping config.
 * Each child module-course becomes one CourseModule; its lessons are
 * flattened from all internal sub-sections (Foundation, Applied Practice, etc.).
 */
function buildParentCourse(grouping: typeof allGroupings[number]): Course {
  const modules: CourseModule[] = [];
  let totalRewards = 0;

  grouping.moduleSlugOrder.forEach((childSlug, idx) => {
    const child = rawCourseMap.get(childSlug);
    if (!child) return;

    // Flatten all lessons from every internal section of the child course
    const allLessons = child.modules.flatMap((m) => m.lessons);

    modules.push({
      title: cleanModuleTitle(child.title),
      order: idx + 1,
      lessons: allLessons,
    });

    totalRewards += child.rewards ?? 0;
  });

  // Collect assessments and VR practices from all child courses
  const assessments = grouping.moduleSlugOrder
    .map((s) => rawCourseMap.get(s))
    .filter(Boolean)
    .flatMap((c) => c!.assessments);

  const vrPractices = grouping.moduleSlugOrder
    .map((s) => rawCourseMap.get(s))
    .filter(Boolean)
    .flatMap((c) => c!.vrPractices);

  return {
    slug: grouping.slug,
    moodleId: null,
    title: grouping.title,
    academySlug: "upskilling-academy",
    description: grouping.description,
    level: grouping.level,
    duration: grouping.duration,
    price: 0,
    status: "published",
    modules,
    assessments,
    vrPractices,
    outcomes: grouping.outcomes,
    rewards: totalRewards || modules.length * 120,
    opportunityPathways: ["Employment", "Entrepreneurship", "Further study"],
  };
}

/**
 * Build the full course list:
 *  1. Parent grouped courses (A–T upskilling + MS Office).
 *  2. All remaining raw courses that are not child modules or placeholder stubs.
 *  3. Deduplicated by slug (first occurrence wins).
 */
function buildGroupedCourses(): Course[] {
  const parentCourses = allGroupings.map(buildParentCourse);

  // Slugs to remove from the flat list: consumed children + MS Office placeholder stubs
  const excluded = new Set([...consumedSlugs, ...parentPlaceholderSlugs]);

  const remaining = rawCourses.filter((c) => !excluded.has(c.slug));

  // Deduplicate by slug — first occurrence wins
  const seen = new Set<string>();
  const deduped: Course[] = [];
  for (const c of [...parentCourses, ...remaining]) {
    if (!seen.has(c.slug)) {
      seen.add(c.slug);
      deduped.push(c);
    }
  }

  return deduped;
}

export const courses: Course[] = buildGroupedCourses();

// ─── Public data access functions ─────────────────────────────────────────────

export function getAcademies() {
  return academies;
}

export function getAcademyBySlug(slug: string) {
  return academies.find((academy) => academy.slug === slug || academy.category === slug);
}

export function getAcademyHref(categoryOrAcademy: { category: string } | string) {
  const category = typeof categoryOrAcademy === "string" ? categoryOrAcademy : categoryOrAcademy.category;
  return `/academies/${category}`;
}

export function getCourses() {
  return courses;
}

export function getCoursesByAcademy(academySlug: string) {
  const academy = getAcademyBySlug(academySlug);
  if (!academy) return [];
  return courses.filter((course) => course.academySlug === academy.slug);
}

export function getCourseBySlug(slug: string) {
  // Check grouped courses first
  const grouped = courses.find((c) => c.slug === slug);
  if (grouped) return grouped;
  // Fall back to raw (for deep lesson navigation on old module slugs)
  return rawCourseMap.get(slug);
}

export function getLessonBySlug(slug: string) {
  for (const courseItem of courses) {
    for (const moduleItem of courseItem.modules) {
      const found = moduleItem.lessons.find((item) => item.slug === slug);
      if (found) {
        return { lesson: found, course: courseItem, module: moduleItem };
      }
    }
  }
  // Fall back to raw courses for lessons inside consumed module-courses
  for (const courseItem of rawCourses) {
    for (const moduleItem of courseItem.modules) {
      const found = moduleItem.lessons.find((item) => item.slug === slug);
      if (found) {
        return { lesson: found, course: courseItem, module: moduleItem };
      }
    }
  }
  return undefined;
}

export function getAssessmentBySlug(slug: string) {
  for (const courseItem of courses) {
    const found = courseItem.assessments.find((a) => a.slug === slug);
    if (found) return { assessment: found, course: courseItem };
  }
  return undefined;
}

/**
 * Grouped "parent" courses (e.g. "business-ethics") only exist as a Next.js-side
 * construct — the real `courses` table only has the individual Moodle-migrated
 * child course rows (`grouping.moduleSlugOrder`). Enrolling must target those
 * real slugs, not the virtual parent slug, or the bridge returns "Course not found".
 */
export function getEnrollableCourseSlugs(courseSlug: string): string[] {
  const grouping = allGroupings.find((g) => g.slug === courseSlug);
  return grouping ? grouping.moduleSlugOrder : [courseSlug];
}

/** Reverse lookup: which grouped parent slug (if any) a real child course slug belongs to. */
export function getParentGroupSlug(childCourseSlug: string): string | null {
  const grouping = allGroupings.find((g) => g.moduleSlugOrder.includes(childCourseSlug));
  return grouping ? grouping.slug : null;
}

export function getVRPracticeBySlug(slug: string) {
  for (const courseItem of courses) {
    const found = courseItem.vrPractices.find((p) => p.slug === slug);
    if (found) return { practice: found, course: courseItem };
  }
  return undefined;
}

export function getLearnerDashboard() {
  return {
    learner: "Development learner",
    enrolledCourses: [],
    certificates: [],
    rewardPoints: 0,
    metrics: [
      { label: "Courses enrolled", value: "0", detail: "Development mode" },
      { label: "Completed", value: "0", detail: "Development mode" },
      { label: "Certificates", value: "0", detail: "Development mode" },
      { label: "Reward points", value: "0 pts", detail: "Development mode" },
    ],
  };
}

export function getFacilitatorDashboard() {
  return {
    name: "Development facilitator",
    metrics: [
      { label: "My courses", value: "0", detail: "Development mode" },
      { label: "Total learners", value: "0", detail: "Development mode" },
      { label: "Total enrolments", value: "0", detail: "Development mode" },
      { label: "Completions", value: "0", detail: "Development mode" },
    ],
    focusCourses: [] as Course[],
  };
}

export function getEmployerDashboard() {
  return {
    name: "Development organisation",
    metrics: [
      { label: "Opportunities posted", value: "0", detail: "Development mode" },
      { label: "Active listings", value: "0", detail: "Development mode" },
      { label: "Assigned learners", value: "Restricted", detail: "Consent required" },
      { label: "Skills evidence", value: "Restricted", detail: "Authorisation required" },
    ],
    opportunities: [] as Opportunity[],
  };
}

export function getOpportunities() {
  return [] as Opportunity[];
}

export function getLearningHubs() {
  return [] as LearningHub[];
}

export function formatCurrency(amount: number) {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
