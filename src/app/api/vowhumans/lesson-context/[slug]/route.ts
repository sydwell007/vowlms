import { NextRequest, NextResponse } from "next/server";
import { bridgeGet } from "@/lib/bridge";
import { getLessonBySlug } from "@/lib/data";
import { verifyVowHumansLessonContextToken } from "@/lib/vowhumans-context-token";

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
        lesson_text: plainText(data.lesson.content ?? ""),
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
        lesson_text: plainText(fallback.lesson.content ?? ""),
        resource: null,
      },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  }
}
