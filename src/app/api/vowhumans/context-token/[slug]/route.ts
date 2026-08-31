import { NextResponse } from "next/server";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { hasActiveCourseEnrollment } from "@/lib/course-access";
import { mintVowHumansLessonContextToken } from "@/lib/vowhumans-context-token";

const LESSON_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!LESSON_SLUG.test(slug)) {
    return NextResponse.json({ error: "Invalid lesson" }, { status: 400 });
  }

  if (isBridgeConfigured()) {
    try {
      const lesson = await bridgeGet<{ course: { slug: string } }>(`/lessons/${slug}`, { noAuth: true });
      if (!await hasActiveCourseEnrollment([lesson.course.slug])) {
        return NextResponse.json({ error: "An active course enrolment is required" }, { status: 403 });
      }
    } catch (error) {
      if (error instanceof BridgeError && error.status === 401) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      if (error instanceof BridgeError && error.status === 404) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Lesson access could not be verified" }, { status: 503 });
    }
  }

  const token = mintVowHumansLessonContextToken(slug);
  if (!token) {
    return NextResponse.json(
      { error: "AI lesson context is not configured" },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
