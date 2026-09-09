import { allGroupings } from "@/data/course-groupings";
import { getAcademyBySlug, getCourseBySlug, getParentGroupSlug } from "@/lib/data";
import { getCourseVisual } from "@/lib/visual-assets";
import type { DashboardMetric } from "@/types/lms";

export type RawDashboardEnrollment = {
  id?: string;
  courseSlug?: string;
  course_slug?: string;
  courseTitle?: string;
  course_title?: string;
  description?: string;
  academyName?: string;
  academy_name?: string;
  academySlug?: string;
  academy_slug?: string;
  progress?: number | string;
  status?: string;
  nextLessonSlug?: string;
  next_lesson_slug?: string;
  enrolledAt?: string;
  enrolled_at?: string;
};

export type DashboardCourse = {
  courseSlug: string;
  courseTitle: string;
  description: string;
  academyName: string;
  academyCategory: string;
  progress: number;
  status: string;
  nextLessonSlug?: string;
  moduleCount: number;
  completedModules: number;
  imageSrc: string;
  imageAlt: string;
};

export type RawLearnerDashboard = {
  metrics?: DashboardMetric[];
  enrolledCourses?: RawDashboardEnrollment[];
  [key: string]: unknown;
};

function enrollmentSlug(enrollment: RawDashboardEnrollment) {
  return enrollment.courseSlug ?? enrollment.course_slug ?? "";
}

function enrollmentProgress(enrollment?: RawDashboardEnrollment) {
  const value = Number(enrollment?.progress ?? 0);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function lessonCount(courseSlug: string) {
  const course = getCourseBySlug(courseSlug);
  return Math.max(1, course?.modules.reduce((total, moduleItem) => total + moduleItem.lessons.length, 0) ?? 0);
}

function firstLessonSlug(courseSlug: string) {
  return getCourseBySlug(courseSlug)?.modules[0]?.lessons[0]?.slug;
}

function replaceMetric(metrics: DashboardMetric[], label: string, value: number) {
  const existing = metrics.find((metric) => metric.label.toLowerCase() === label.toLowerCase());
  const replacement = {
    label: existing?.label ?? label,
    value: String(value),
    detail: existing?.detail ?? "Verified account data",
  };

  return existing
    ? metrics.map((metric) => (metric === existing ? replacement : metric))
    : [replacement, ...metrics];
}

export function normaliseLearnerDashboard(raw: RawLearnerDashboard) {
  const enrollments = (raw.enrolledCourses ?? []).filter(
    (enrollment) => enrollmentSlug(enrollment) && enrollment.status !== "dropped" && enrollment.status !== "cancelled",
  );
  const grouped = new Map<string, RawDashboardEnrollment[]>();

  for (const enrollment of enrollments) {
    const childSlug = enrollmentSlug(enrollment);
    const parentSlug = getParentGroupSlug(childSlug) ?? childSlug;
    grouped.set(parentSlug, [...(grouped.get(parentSlug) ?? []), enrollment]);
  }

  const enrolledCourses: DashboardCourse[] = [...grouped].map(([courseSlug, records]) => {
    const grouping = allGroupings.find((candidate) => candidate.slug === courseSlug);
    const course = getCourseBySlug(courseSlug);
    const expectedSlugs = grouping?.moduleSlugOrder ?? [courseSlug];
    const recordsBySlug = new Map(records.map((record) => [enrollmentSlug(record), record]));
    let weightedProgress = 0;
    let totalLessons = 0;

    for (const childSlug of expectedSlugs) {
      const weight = lessonCount(childSlug);
      weightedProgress += enrollmentProgress(recordsBySlug.get(childSlug)) * weight;
      totalLessons += weight;
    }

    const progress = totalLessons ? Math.round(weightedProgress / totalLessons) : 0;
    const completedModules = expectedSlugs.filter((slug) => enrollmentProgress(recordsBySlug.get(slug)) >= 100).length;
    const nextChildSlug = expectedSlugs.find((slug) => enrollmentProgress(recordsBySlug.get(slug)) < 100);
    const nextRecord = nextChildSlug ? recordsBySlug.get(nextChildSlug) : undefined;
    const firstRecord = records[0];
    const academy = course ? getAcademyBySlug(course.academySlug) : undefined;
    const academyCategory = academy?.category ?? "upskilling";
    const courseTitle = course?.title ?? firstRecord.courseTitle ?? firstRecord.course_title ?? "Course";
    const visual = getCourseVisual({ slug: courseSlug, title: courseTitle }, academyCategory);

    return {
      courseSlug,
      courseTitle,
      description: course?.description ?? firstRecord.description ?? "Continue your learning journey.",
      academyName: academy?.name ?? firstRecord.academyName ?? firstRecord.academy_name ?? "GoalVow Academy",
      academyCategory,
      progress,
      status: progress === 100 ? "completed" : "active",
      nextLessonSlug:
        nextRecord?.nextLessonSlug ??
        nextRecord?.next_lesson_slug ??
        (nextChildSlug ? firstLessonSlug(nextChildSlug) : undefined),
      moduleCount: expectedSlugs.length,
      completedModules,
      imageSrc: visual.src,
      imageAlt: visual.alt,
    };
  });

  let metrics = (raw.metrics ?? []).map((metric) => ({
    ...metric,
    detail: metric.detail ?? "Verified account data",
  }));
  metrics = replaceMetric(metrics, "Courses enrolled", enrolledCourses.length);
  metrics = replaceMetric(metrics, "Completed", enrolledCourses.filter((course) => course.status === "completed").length);

  return { ...raw, metrics, enrolledCourses };
}
