import { ok } from "@/lib/api/responses";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import { getCourseBySlug } from "@/lib/data";
import { getModuleTopics } from "@/lib/course-content";

type BridgeLesson = {
  lesson: { title: string; type: string; media_url: string | null };
};

const MAX_CLIPS = 6;

/**
 * Real per-lesson videos live in the bridge's `lessons` table (`video_hash`/
 * `video_url`), signed on request by `public/php/api/lessons/index.php` —
 * completely separate from this app's static course catalogue (`seed-data.ts`),
 * which only ever holds a placeholder `videoUrl`. This route bridges that gap
 * for the Course Preview trailer: it picks one real lesson per module and
 * asks the bridge for its signed video, so the trailer can play genuine
 * lesson footage when it exists, and fall back to the module-image slideshow
 * when it doesn't (bridge not configured, or that lesson has no video yet).
 * `noAuth` matches `lessons/index.php`'s own contract — it requires only the
 * bridge key, not a learner session, since lesson content isn't gated.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isBridgeConfigured()) {
    return ok({ clips: [] });
  }

  const course = getCourseBySlug(slug);
  if (!course || course.academySlug !== "upskilling-academy" || !course.coursePreview) {
    return ok({ clips: [] });
  }

  const candidateSlugs = course.modules
    .map((moduleItem) => getModuleTopics(moduleItem, 1)[0]?.slug)
    .filter((lessonSlug): lessonSlug is string => Boolean(lessonSlug))
    .slice(0, MAX_CLIPS);

  const results = await Promise.allSettled(
    candidateSlugs.map((lessonSlug) => bridgeGet<BridgeLesson>(`/lessons/${lessonSlug}`, { noAuth: true })),
  );

  const clips = results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((data): data is BridgeLesson => Boolean(data?.lesson?.media_url))
    .map((data) => ({ src: data.lesson.media_url as string, title: data.lesson.title }));

  return ok({ clips });
}
