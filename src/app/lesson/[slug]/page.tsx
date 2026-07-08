import { notFound } from "next/navigation";
import { getLessonBySlug } from "@/lib/data";
import { LessonPlayer } from "@/components/learning/LessonPlayer";
import { bridgeGet, isBridgeConfigured } from "@/lib/bridge";
import type { Course, CourseModule, Lesson } from "@/types/lms";
import type { LessonResource } from "@/components/learning/LessonPlayer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getLessonBySlug(slug);
  return { title: result?.lesson.title ?? "Lesson" };
}

// ── Bridge response types ─────────────────────────────────────────────────────

type BridgeResource = {
  id: string;
  type: "pdf" | "video" | "audio" | "image" | "other";
  filename: string;
  content_hash: string | null;
  file_url: string | null;
  filesize: number;
  mime_type: string | null;
};

type BridgeLessonResponse = {
  lesson: {
    id: string;
    slug: string;
    title: string;
    type: string;
    content: string | null;
    video_url: string | null;
    video_hash: string | null;
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
  resources: BridgeResource[];
};

// ── Rewrite Moodle pluginfile URLs in lesson HTML ────────────────────────────
// Moodle embeds video/audio/image source URLs using pluginfile.php which
// requires a Moodle browser session. We rewrite them server-side to go
// through serve.php (Mode C) so the PHP proxy fetches them server-to-server.
function rewriteMoodleUrls(html: string, bridgeBase: string): string {
  if (!html || !bridgeBase) return html;
  const base = bridgeBase.replace(/\/$/, "");
  return html.replace(
    /\bsrc="(https?:\/\/[^"]*\/webservice\/pluginfile\.php\/[^"]*)"/gi,
    (_, moodleUrl: string) => {
      const clean = moodleUrl
        .replace(/([?&])forcedownload=\d+&?/g, "$1")
        .replace(/[?&]$/, "");
      const ext = clean.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "mp4";
      const name = encodeURIComponent(`media.${ext}`);
      return `src="${base}/files/serve?url=${encodeURIComponent(clean)}&name=${name}"`;
    }
  );
}

// ── Build file serve URL ───────────────────────────────────────────────────────
// All files go through the PHP proxy so we can:
//   - Strip X-Frame-Options (Moodle sends SAMEORIGIN, blocking iframes)
//   - Override Content-Disposition: attachment → inline (forcedownload=1 fix)
//   - Forward Range requests for video seeking
// Priority:
// 1. content_hash + bridgeBase → serve from filesystem via hash (fastest)
// 2. id + bridgeBase           → proxy from Moodle, stripping hostile headers
// 3. file_url                  → direct Moodle URL (last resort; likely blocked in iframes)
function buildServeUrl(r: BridgeResource): string {
  const bridgeBase = (process.env.BRIDGE_BASE_URL ?? "").replace(/\/$/, "");

  if (!bridgeBase) {
    // No bridge configured — direct URL is the only option
    return r.file_url ?? "";
  }

  if (r.content_hash) {
    return `${bridgeBase}/files/serve?hash=${r.content_hash}&name=${encodeURIComponent(r.filename)}`;
  }

  if (r.id) {
    return `${bridgeBase}/files/serve?id=${encodeURIComponent(r.id)}&name=${encodeURIComponent(r.filename)}`;
  }

  return r.file_url ?? "";
}

// ── Normalize bridge response → LessonPlayer props ────────────────────────────
function bridgeToProps(d: BridgeLessonResponse, currentSlug: string) {
  const isAssessment = d.lesson.type === "assessment";
  const isVR = d.lesson.type === "vr-practice";

  const bridgeBase = (process.env.BRIDGE_BASE_URL ?? "").replace(/\/$/, "");
  const rawContent = d.lesson.content ?? "";
  const content = rewriteMoodleUrls(rawContent, bridgeBase);

  // Determine video URL — prefer uploaded video (via serve.php) over YouTube embed
  let videoUrl: string | undefined;
  if (d.lesson.video_hash) {
    videoUrl = `${bridgeBase}/files/serve?hash=${d.lesson.video_hash}&name=video.mp4`;
  } else if (d.lesson.video_url) {
    videoUrl = d.lesson.video_url;
  }

  const lesson: Lesson = {
    slug: d.lesson.slug,
    title: d.lesson.title,
    type: (d.lesson.type as Lesson["type"]) ?? "text",
    content,
    videoUrl,
    hasAssessment: isAssessment,
    hasVRPractice: isVR,
    durationMinutes: d.lesson.duration_minutes ?? 10,
  };

  const module: CourseModule = { title: d.module.title, order: d.module.position, lessons: [] };

  const allModules: CourseModule[] = d.all_modules.map((m) => ({
    title: m.title,
    order: m.position,
    lessons: m.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      type: (l.type as Lesson["type"]) ?? "text",
      content: "",
      hasAssessment: l.type === "assessment",
      hasVRPractice: l.type === "vr-practice",
      durationMinutes: l.duration_minutes ?? 10,
    })),
  }));

  const course = {
    slug: d.course.slug,
    title: d.course.title,
    moodleId: null,
    academySlug: d.course.academy_slug,
    description: "",
    level: (d.course.level as Course["level"]) ?? "Foundation",
    duration: "",
    price: d.course.price ?? 0,
    status: "published" as Course["status"],
    modules: allModules,
    outcomes: [],
    rewards: 0,
    opportunityPathways: [],
    assessments: isAssessment
      ? [{ slug: currentSlug, lessonSlug: currentSlug, title: lesson.title, passMark: 70, questions: [] }]
      : [],
    vrPractices: isVR
      ? [{ slug: currentSlug, lessonSlug: currentSlug, title: lesson.title, scenario: "", skillsPracticed: [], scorePlaceholder: 0 }]
      : [],
  } satisfies Course;

  const prevLesson: Lesson | null = d.prev_lesson
    ? { slug: d.prev_lesson.slug, title: d.prev_lesson.title, type: "text", content: "", hasAssessment: false, hasVRPractice: false, durationMinutes: d.prev_lesson.duration_minutes ?? 10 }
    : null;

  const nextLesson: Lesson | null = d.next_lesson
    ? { slug: d.next_lesson.slug, title: d.next_lesson.title, type: "text", content: "", hasAssessment: false, hasVRPractice: false, durationMinutes: d.next_lesson.duration_minutes ?? 10 }
    : null;

  // Build resource URLs server-side so BRIDGE_BASE_URL stays server-only
  const resources: LessonResource[] = (d.resources ?? [])
    .reduce<LessonResource[]>((acc, r) => {
      const url = buildServeUrl(r);
      if (!url) return acc;
      acc.push({
        type: r.type,
        filename: r.filename,
        url,
        filesize: r.filesize ?? 0,
        mimeType: r.mime_type ?? undefined,
      });
      return acc;
    }, []);

  return { lesson, module, course, allModules, prevLesson, nextLesson, resources };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // When bridge is configured, fetch from PHP (real content + resources)
  if (isBridgeConfigured()) {
    try {
      const data = await bridgeGet<BridgeLessonResponse>(`/lessons/${slug}`, { noAuth: true });
      if (data?.lesson) {
        const props = bridgeToProps(data, slug);
        return (
          <LessonPlayer
            lesson={props.lesson}
            course={props.course}
            module={props.module}
            prevLesson={props.prevLesson}
            nextLesson={props.nextLesson}
            allModules={props.allModules}
            currentLessonSlug={slug}
            resources={props.resources}
          />
        );
      }
    } catch {
      // Fall through to static seed data
    }
  }

  // Static seed-data fallback (development / pre-DB)
  const result = getLessonBySlug(slug);
  if (!result) notFound();

  const { lesson, course, module } = result;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <LessonPlayer
      lesson={lesson}
      course={course}
      module={module}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      allModules={course.modules}
      currentLessonSlug={slug}
      resources={[]}
    />
  );
}
