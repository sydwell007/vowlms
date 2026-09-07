import { NextRequest, NextResponse } from "next/server";
import { bridgeGet } from "@/lib/bridge";
import { getLessonBySlug } from "@/lib/data";
import { readVowHumansLessonContextLang, verifyVowHumansLessonContextToken } from "@/lib/vowhumans-context-token";
import { THANDI_GUIDE_KEY } from "@/lib/thandi/config";
import { buildCourseDigest, buildSiteDigest, classifyThandiContextKey } from "@/lib/thandi/knowledge";

type ContextResource = {
  type: string;
  filename: string;
  serve_url?: string | null;
  file_url?: string | null;
  mime_type?: string | null;
  filesize?: number;
};

type ContextLessonResponse = {
  lesson: { slug: string; title: string; content?: string | null };
  module: { title: string };
  course: { title: string; academy_name?: string };
  resources?: ContextResource[];
};

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  return authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";
}

function plainText(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 12_000);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!verifyVowHumansLessonContextToken(bearerToken(request), slug)) {
    return NextResponse.json({ error: "Invalid or expired context token" }, { status: 401 });
  }

  const kind = classifyThandiContextKey(slug);
  const lang = readVowHumansLessonContextLang(bearerToken(request));
  // Advisory only — asks Thandi to try responding in this language, never a
  // guaranteed switch (VowHumans' own multilingual quality varies by
  // language and capability; see `src/lib/thandi/languages.ts`).
  const langPreface = lang
    ? `The learner has requested responses in ${lang}. Greet them and reply in ${lang} where you confidently can; if you are not confident in ${lang} for a given answer, say so honestly and continue in English rather than guessing.\n\n`
    : "";

  // Thandi asking about VowLMS generally, or about a specific course's page —
  // neither needs the bridge or an enrolment check: course-preview content is
  // already public, and the site digest is static, hand-authored copy.
  if (kind === "guide") {
    return NextResponse.json(
      {
        academy_name: "GoalVow Academy",
        course_title: "VowLMS",
        lesson_slug: THANDI_GUIDE_KEY,
        lesson_title: "Ask Thandi",
        module_title: "VowLMS site guide",
        lesson_text: langPreface + buildSiteDigest(),
        resource: null,
      },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  }
  if (kind === "course") {
    const digest = buildCourseDigest(slug);
    if (!digest) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        academy_name: "GoalVow Academy",
        course_title: digest.title,
        lesson_slug: slug,
        lesson_title: "Course guide",
        module_title: digest.title,
        lesson_text: langPreface + digest.text,
        resource: null,
      },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  }

  try {
    const data = await bridgeGet<ContextLessonResponse>(`/lessons/${slug}`, {
      noAuth: true,
    });
    const pdf = (data.resources ?? []).find(
      (resource) => resource.type === "pdf" && (resource.serve_url || resource.file_url),
    );

    return NextResponse.json(
      {
        academy_name: data.course.academy_name ?? "GoalVow Academy",
        course_title: data.course.title,
        lesson_slug: data.lesson.slug,
        lesson_title: data.lesson.title,
        module_title: data.module.title,
        lesson_text: langPreface + plainText(data.lesson.content ?? ""),
        resource: pdf
          ? {
              filename: pdf.filename,
              filesize: pdf.filesize ?? 0,
              mime_type: pdf.mime_type ?? "application/pdf",
              type: "pdf",
              url: pdf.serve_url || pdf.file_url,
            }
          : null,
      },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  } catch {
    const fallback = getLessonBySlug(slug);
    if (!fallback) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        academy_name: "GoalVow Academy",
        course_title: fallback.course.title,
        lesson_slug: fallback.lesson.slug,
        lesson_title: fallback.lesson.title,
        module_title: fallback.module.title,
        lesson_text: langPreface + plainText(fallback.lesson.content ?? ""),
        resource: null,
      },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  }
}
