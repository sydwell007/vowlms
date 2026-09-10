import { notFound, redirect } from "next/navigation";
import { createHmac } from "node:crypto";
import { getAcademyBySlug, getChildModuleOrder, getCourseBySlug, getEnrollableCourseSlugs, getLessonBySlug, getParentGroupSlug } from "@/lib/data";
import { getModuleImageSrc } from "@/lib/module-images";
import { getCourseVisual } from "@/lib/visual-assets";
import { LessonPlayer } from "@/components/learning/LessonPlayer";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { hasActiveCourseEnrollment } from "@/lib/course-access";
import { normalizeVowHumanPresenter } from "@/lib/vowhumans";
import type { Course, CourseModule, Lesson } from "@/types/lms";
import type { LessonResource } from "@/components/learning/LessonPlayer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getLessonBySlug(slug);
  return {
    title: result?.lesson.title ?? "Lesson",
    robots: { index: false, follow: false },
  };
}

// ── Bridge response types ─────────────────────────────────────────────────────

type BridgeResource = {
  id: string;
  type: "pdf" | "video" | "audio" | "image" | "other";
  filename: string;
  content_hash: string | null;
  file_url: string | null;
  serve_url: string | null;
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
    media_url: string | null;
    duration_minutes: number;
    position: number;
    module_id: string;
    vowhuman_enabled?: boolean | number | string;
    vowhuman_embed_url?: string | null;
    vowhuman_presenter_name?: string | null;
    vowhuman_intro?: string | null;
    vowhuman_placement?: string | null;
    vowhuman_role?: string | null;
    vowhuman_expertise?: string | null;
    vowhuman_camera_enabled?: boolean | number | string;
    vowhuman_microphone_enabled?: boolean | number | string;
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
// Moodle embeds video/audio/image URLs via pluginfile.php (regular or
// webservice variant). Both require a Moodle browser session / token.
// We rewrite src= AND href= attributes server-side to go through
// serve.php Mode C so PHP proxies them server-to-server (no login needed).
function signedServeUrl(
  bridgeBase: string,
  selector: { hash?: string; id?: string; url?: string },
  filename: string,
) {
  const secret = process.env.RESOURCE_SIGNING_SECRET ?? "";
  if (!bridgeBase || !secret) return "";

  const [kind, value] = selector.hash
    ? ["hash", selector.hash]
    : selector.id
      ? ["id", selector.id]
      : ["url", selector.url ?? ""];
  if (!value) return "";

  const expires = Math.floor(Date.now() / 1000) + 60 * 60;
  const signature = createHmac("sha256", secret)
    .update(`${kind}:${value}|${expires}`)
    .digest("hex");
  const query = new URLSearchParams({
    [kind]: value,
    name: filename,
    expires: String(expires),
    sig: signature,
  });

  return `${bridgeBase.replace(/\/$/, "")}/files/serve?${query}`;
}

function rewriteMoodleUrls(html: string, bridgeBase: string): string {
  if (!html || !bridgeBase) return html;
  const base = bridgeBase.replace(/\/$/, "");
  return html.replace(
    /\b(src|href)="(https?:\/\/[^"]*\/(?:webservice\/)?pluginfile\.php\/[^"]*)"/gi,
    (_, attr: string, moodleUrl: string) => {
      const clean = moodleUrl
        .replace(/([?&])forcedownload=\d+&?/g, "$1")
        .replace(/[?&]$/, "");
      // Extract filename from the URL path for correct MIME guessing
      const pathPart = clean.split("?")[0];
      const filename = decodeURIComponent(pathPart.split("/").pop() ?? "file");
      const serveUrl = signedServeUrl(base, { url: clean }, filename || "file");
      return serveUrl ? `${attr}="${serveUrl}"` : `${attr}="${clean}"`;
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
    return signedServeUrl(bridgeBase, { hash: r.content_hash }, r.filename);
  }

  if (r.id) {
    return signedServeUrl(bridgeBase, { id: r.id }, r.filename);
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
  if (d.lesson.media_url) {
    videoUrl = d.lesson.media_url;
  } else if (d.lesson.video_hash) {
    videoUrl = signedServeUrl(bridgeBase, { hash: d.lesson.video_hash }, "video.mp4") || undefined;
  } else if (d.lesson.video_url) {
    const rawVideo = d.lesson.video_url;
    // Moodle pluginfile.php URLs require a session — proxy through serve.php Mode C
    if (/pluginfile\.php/i.test(rawVideo) && bridgeBase) {
      const pathPart = rawVideo.split("?")[0];
      const name = decodeURIComponent(pathPart.split("/").pop() ?? "video.mp4") || "video.mp4";
      videoUrl = signedServeUrl(bridgeBase, { url: rawVideo }, name) || undefined;
    } else {
      videoUrl = rawVideo;
    }
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
    vowHuman: normalizeVowHumanPresenter(d.lesson),
  };

  // The bridge's `all_modules` are the course's own internal Moodle sections
  // (e.g. "Foundation", "Applied Practice 2", "Applied Practice 3") — pure
  // authoring structure with no meaning to a learner, since this course IS
  // already "one module" from the parent-course grouping's point of view.
  // Flatten them into a single continuous lesson list so the sidebar never
  // shows "modules nested inside a module".
  const flatLessons: Lesson[] = d.all_modules.flatMap((m) =>
    m.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      type: (l.type as Lesson["type"]) ?? "text",
      content: "",
      hasAssessment: l.type === "assessment",
      hasVRPractice: l.type === "vr-practice",
      durationMinutes: l.duration_minutes ?? 10,
    })),
  );

  // The bridge doesn't expose a child course's position within its parent
  // grouping at all — resolve it ourselves from course-groupings.ts so the
  // module banner and "Module N:" labels show the real number, not always 1.
  const moduleOrder = getChildModuleOrder(d.course.slug) ?? 1;

  const courseModule: CourseModule = {
    // Keep the real "Module N:" prefix — it's the learner's only visible cue
    // for which numbered module of the parent course they're in, since the
    // bridge doesn't separately expose that ordering.
    title: d.course.title,
    order: moduleOrder,
    lessons: flatLessons,
  };

  const resolvedCourseSlug = getParentGroupSlug(d.course.slug) ?? d.course.slug;
  const parentCourse = getCourseBySlug(resolvedCourseSlug);
  const allModules: CourseModule[] = parentCourse?.modules ?? [courseModule];
  const currentModule = allModules.find((moduleItem) =>
    moduleItem.lessons.some((moduleLesson) => moduleLesson.slug === currentSlug),
  ) ?? courseModule;

  const course = {
    ...(parentCourse ?? {
      slug: d.course.slug,
      title: d.course.title,
      moodleId: null,
      academySlug: d.course.academy_slug,
      description: "",
      level: (d.course.level as Course["level"]) ?? "Foundation",
      duration: "",
      price: d.course.price ?? 0,
      status: "published" as Course["status"],
      outcomes: [],
      rewards: 0,
      opportunityPathways: { employment: [], entrepreneurship: [], furtherStudy: [] },
    }),
    // Progress remains linked to the imported child course in PHP while the
    // learner sees the complete parent-course curriculum.
    slug: d.course.slug,
    modules: allModules,
    assessments: parentCourse?.assessments ?? (isAssessment
      ? [{ slug: currentSlug, lessonSlug: currentSlug, title: lesson.title, passMark: 70, questions: [] }]
      : []),
    vrPractices: parentCourse?.vrPractices ?? (isVR
      ? [{ slug: currentSlug, lessonSlug: currentSlug, title: lesson.title, scenario: "", skillsPracticed: [], scorePlaceholder: 0 }]
      : []),
  } satisfies Course;

  const navigationLessons = allModules.flatMap((moduleItem) => moduleItem.lessons);
  const currentIndex = navigationLessons.findIndex((moduleLesson) => moduleLesson.slug === currentSlug);
  const prevLesson: Lesson | null = currentIndex > 0 ? navigationLessons[currentIndex - 1] : null;
  const nextLesson: Lesson | null = currentIndex >= 0 && currentIndex < navigationLessons.length - 1
    ? navigationLessons[currentIndex + 1]
    : null;

  // Build resource URLs server-side so BRIDGE_BASE_URL stays server-only
  const resources: LessonResource[] = (d.resources ?? [])
    .reduce<LessonResource[]>((acc, r) => {
      const url = r.serve_url || buildServeUrl(r);
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

  // The bridge always returns the child Moodle course's own slug (e.g.
  // "marketing-fundamentals"), which has no reachable /courses or /results
  // page of its own — child slugs are consumed into their parent grouping
  // (e.g. "marketing") and excluded from the visible course list. Every
  // "back to course" / "view results" link must resolve to the parent.
  // Real module banner image where one exists (the 20 curated Upskilling
  // courses); every other module — every other academy, and any Upskilling
  // module without a specific image — falls back to its course/academy's
  // real curated visual, so every module gets a real image, never a blank.
  const academy = getAcademyBySlug(d.course.academy_slug);
  const moduleImageSrc =
    getModuleImageSrc(resolvedCourseSlug, currentModule.order) ??
    getCourseVisual({ slug: resolvedCourseSlug, title: d.course.title }, academy?.category ?? "upskilling").src;

  return {
    lesson,
    module: currentModule,
    course,
    allModules,
    prevLesson,
    nextLesson,
    resources,
    resolvedCourseSlug,
    moduleImageSrc,
    academyCategory: academy?.category ?? "upskilling",
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticResult = getLessonBySlug(slug);

  // Module 0 is native VowLMS orientation content rather than a Moodle row.
  // Serve it from the grouped course model while enforcing the same enrolment
  // gate as the imported learning modules.
  if (staticResult?.module.order === 0) {
    const { lesson, course, module: courseModule } = staticResult;
    if (isBridgeConfigured()) {
      try {
        const hasAccess = await hasActiveCourseEnrollment(getEnrollableCourseSlugs(course.slug));
        if (!hasAccess) redirect(`/courses/${course.slug}?enrolment=required`);
      } catch (error) {
        if (error instanceof BridgeError && error.status === 401) {
          redirect(`/auth/signin?returnTo=${encodeURIComponent(`/lesson/${slug}`)}`);
        }
        throw error;
      }
    }
    const allLessons = course.modules.flatMap((moduleItem) => moduleItem.lessons);
    const currentIndex = allLessons.findIndex((moduleLesson) => moduleLesson.slug === slug);
    const academy = getAcademyBySlug(course.academySlug);
    return <LessonPlayer
      lesson={lesson}
      course={course}
      module={courseModule}
      prevLesson={currentIndex > 0 ? allLessons[currentIndex - 1] : null}
      nextLesson={currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null}
      allModules={course.modules}
      currentLessonSlug={slug}
      resources={[]}
      courseSlugForNav={course.slug}
      moduleImageSrc={getModuleImageSrc(course.slug, 0) ?? getCourseVisual(course, academy?.category ?? "upskilling").src}
      academyCategory={academy?.category ?? "upskilling"}
    />;
  }

  // When bridge is configured, fetch from PHP (real content + resources)
  if (isBridgeConfigured()) {
    let bridgeProps: ReturnType<typeof bridgeToProps> | null = null;
    try {
      const data = await bridgeGet<BridgeLessonResponse>(`/lessons/${slug}`, { noAuth: true });
      if (data?.lesson) {
        bridgeProps = bridgeToProps(data, slug);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "production") throw error;
    }

    if (bridgeProps) {
      let hasAccess = false;
      try {
        hasAccess = await hasActiveCourseEnrollment([bridgeProps.course.slug]);
      } catch (error) {
        if (error instanceof BridgeError && error.status === 401) {
          redirect(`/auth/signin?returnTo=${encodeURIComponent(`/lesson/${slug}`)}`);
        }
        throw error;
      }

      if (!hasAccess) {
        redirect(`/courses/${bridgeProps.resolvedCourseSlug}?enrolment=required`);
      }

      return (
        <LessonPlayer
          lesson={bridgeProps.lesson}
          course={bridgeProps.course}
          module={bridgeProps.module}
          prevLesson={bridgeProps.prevLesson}
          nextLesson={bridgeProps.nextLesson}
          allModules={bridgeProps.allModules}
          currentLessonSlug={slug}
          resources={bridgeProps.resources}
          courseSlugForNav={bridgeProps.resolvedCourseSlug}
          moduleImageSrc={bridgeProps.moduleImageSrc}
          academyCategory={bridgeProps.academyCategory}
        />
      );
    }
  }

  // Static seed-data fallback (development / pre-DB)
  const result = staticResult;
  if (!result) notFound();

  const { lesson, course, module: courseModule } = result;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const staticAcademy = getAcademyBySlug(course.academySlug);
  const staticModuleImageSrc =
    getModuleImageSrc(course.slug, courseModule.order) ??
    getCourseVisual(course, staticAcademy?.category ?? "upskilling").src;

  return (
    <LessonPlayer
      lesson={lesson}
      course={course}
      module={courseModule}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      allModules={course.modules}
      currentLessonSlug={slug}
      moduleImageSrc={staticModuleImageSrc}
      academyCategory={staticAcademy?.category ?? "upskilling"}
      courseSlugForNav={course.slug}
      resources={[]}
    />
  );
}
