import { ok, notFound, serverError } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { getLessonBySlug } from "@/lib/data";

type BridgeLessonResponse = {
  lesson: {
    id: string;
    slug: string;
    title: string;
    type: string;
    content: string | null;
    video_url: string | null;
    duration_minutes: number;
    position: number;
    module_id: string;
  };
  module: { id: string; title: string; position: number };
  course: {
    id: string;
    slug: string;
    title: string;
    academy_slug: string;
    academy_name: string;
    level: string;
    price: number;
    is_free: boolean;
  };
  all_modules: Array<{
    id: string;
    title: string;
    position: number;
    lessons: Array<{
      id: string;
      slug: string;
      title: string;
      type: string;
      duration_minutes: number;
      position: number;
    }>;
  }>;
  prev_lesson: { slug: string; title: string; duration_minutes: number } | null;
  next_lesson: { slug: string; title: string; duration_minutes: number } | null;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (isBridgeConfigured()) {
    try {
      const data = await bridgeGet<BridgeLessonResponse>(`/lessons/${slug}`, { noAuth: true });
      return ok(normalizeBridgeLesson(data));
    } catch {
      // Fall through to seed-data fallback
    }
  }

  const result = getLessonBySlug(slug);
  if (!result) return notFound("Lesson not found");

  const { lesson, course, module } = result;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.slug === slug);

  return ok({
    lesson: {
      slug: lesson.slug,
      title: lesson.title,
      type: lesson.type,
      content: lesson.content ?? "",
      videoUrl: lesson.videoUrl ?? null,
      hasAssessment: lesson.hasAssessment,
      hasVRPractice: lesson.hasVRPractice,
      durationMinutes: lesson.durationMinutes,
    },
    module: { title: module.title, order: module.order },
    course: {
      slug: course.slug,
      title: course.title,
      academySlug: course.academySlug,
    },
    allModules: course.modules.map((m) => ({
      title: m.title,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        type: l.type,
        durationMinutes: l.durationMinutes,
      })),
    })),
    prevLesson: idx > 0 ? pick(allLessons[idx - 1]) : null,
    nextLesson: idx < allLessons.length - 1 ? pick(allLessons[idx + 1]) : null,
  });
}

function pick(l: { slug: string; title: string; durationMinutes: number }) {
  return { slug: l.slug, title: l.title, durationMinutes: l.durationMinutes };
}

function normalizeBridgeLesson(d: BridgeLessonResponse) {
  const allLessons = d.all_modules.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.slug === d.lesson.slug);

  const isAssessment = d.lesson.type === "assessment";
  const isVR = d.lesson.type === "vr-practice";

  return {
    lesson: {
      slug: d.lesson.slug,
      title: d.lesson.title,
      type: d.lesson.type as "text" | "video" | "assessment" | "vr-practice",
      content: d.lesson.content ?? "",
      videoUrl: d.lesson.video_url ?? null,
      hasAssessment: isAssessment,
      hasVRPractice: isVR,
      durationMinutes: d.lesson.duration_minutes ?? 10,
    },
    module: { title: d.module.title, order: d.module.position },
    course: {
      slug: d.course.slug,
      title: d.course.title,
      academySlug: d.course.academy_slug,
      // Assessment/VR linked by slug convention — LessonPlayer uses these arrays
      assessments: isAssessment
        ? [{ slug: d.lesson.slug, lessonSlug: d.lesson.slug, title: d.lesson.title, passMark: 70, questions: [] }]
        : [],
      vrPractices: isVR
        ? [{ slug: d.lesson.slug, lessonSlug: d.lesson.slug, title: d.lesson.title, scenario: "", skillsPracticed: [], scorePlaceholder: 0 }]
        : [],
    },
    allModules: d.all_modules.map((m) => ({
      title: m.title,
      order: m.position,
      lessons: m.lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        type: l.type as "text" | "video" | "assessment" | "vr-practice",
        content: "",
        videoUrl: null,
        hasAssessment: l.type === "assessment",
        hasVRPractice: l.type === "vr-practice",
        durationMinutes: l.duration_minutes ?? 10,
      })),
    })),
    prevLesson: d.prev_lesson
      ? { ...d.prev_lesson, durationMinutes: d.prev_lesson.duration_minutes }
      : null,
    nextLesson: d.next_lesson
      ? { ...d.next_lesson, durationMinutes: d.next_lesson.duration_minutes }
      : null,
  };
}
