import { NextResponse } from "next/server";
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
