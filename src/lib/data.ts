import {
  academies,
  analyticsEvents,
  courses,
  enrolledCourses,
  learningHubs,
  opportunities,
} from "@/data/seed-data";

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

  if (!academy) {
    return [];
  }

  return courses.filter((course) => course.academySlug === academy.slug);
}

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
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
  return undefined;
}

export function getAssessmentBySlug(slug: string) {
  for (const courseItem of courses) {
    const found = courseItem.assessments.find((assessment) => assessment.slug === slug);
    if (found) {
      return { assessment: found, course: courseItem };
    }
  }
  return undefined;
}

export function getVRPracticeBySlug(slug: string) {
  for (const courseItem of courses) {
    const found = courseItem.vrPractices.find((practice) => practice.slug === slug);
    if (found) {
      return { practice: found, course: courseItem };
    }
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
      { label: "Courses", value: String(courses.length), detail: "Published sample pathways" },
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
  if (amount === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
