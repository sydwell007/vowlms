import {
  academies,
  analyticsEvents,
  courses as rawCourses,
  enrolledCourses,
  learningHubs,
  opportunities,
} from "@/data/seed-data";
import {
  allGroupings,
  consumedSlugs,
  parentPlaceholderSlugs,
} from "@/data/course-groupings";
import type { Course, CourseModule } from "@/types/lms";

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

export function getVRPracticeBySlug(slug: string) {
  for (const courseItem of courses) {
    const found = courseItem.vrPractices.find((p) => p.slug === slug);
    if (found) return { practice: found, course: courseItem };
  }
  return undefined;
}

export function getLearnerDashboard() {
  return {
    learner: "Amina Mokoena",
    enrolledCourses: enrolledCourses.map((item) => ({
      ...item,
      course: getCourseBySlug(item.courseSlug),
      nextLesson: getLessonBySlug(item.nextLessonSlug)?.lesson,
    })),
    metrics: [
      { label: "Progress", value: "61%", detail: "Across active courses" },
      { label: "Rewards", value: "370", detail: "VowRewards points earned" },
      { label: "Certificates", value: "2", detail: "Ready for download" },
      { label: "Opportunities", value: "4", detail: "Matched through PlugConnect" },
    ],
  };
}

export function getFacilitatorDashboard() {
  return {
    name: "Facilitator Studio",
    metrics: [
      { label: "Assigned courses", value: "6", detail: "Across three academies" },
      { label: "Learners", value: "248", detail: "Active this month" },
      { label: "Assessment pass rate", value: "82%", detail: "Latest cohort average" },
      { label: "VR attempts", value: "156", detail: "Practice sessions logged" },
    ],
    focusCourses: courses.slice(0, 4),
  };
}

export function getEmployerDashboard() {
  return {
    name: "Employer Pipeline",
    metrics: [
      { label: "Verified learners", value: "96", detail: "Ready for review" },
      { label: "Completions", value: "41", detail: "This month" },
      { label: "Open opportunities", value: "7", detail: "Posting placeholders" },
      { label: "Certificates viewed", value: "118", detail: "Employer activity" },
    ],
    opportunities,
  };
}

export function getAdminDashboard() {
  return {
    name: "VowLMS Command Centre",
    metrics: [
      { label: "Academies", value: String(academies.length), detail: "GoalVow ecosystem pillars" },
      { label: "Courses", value: String(courses.length), detail: "Published pathways" },
      { label: "Learners", value: "1,284", detail: "Mock local analytics" },
      { label: "Revenue", value: "R 84k", detail: "PayFast-ready placeholder" },
      { label: "Completions", value: "312", detail: "Certificates issued" },
      { label: "Health", value: "99.9%", detail: "API and PWA checks" },
    ],
    analyticsEvents,
  };
}

export function getOpportunities() {
  return opportunities;
}

export function getLearningHubs() {
  return learningHubs;
}

export function formatCurrency(amount: number) {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
