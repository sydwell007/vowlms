import { badRequest, created } from "@/lib/api/responses";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.lessonSlug !== "string") {
    return badRequest("lessonSlug is required");
  }

  return created({
    progressId: `progress-${Date.now()}`,
    lessonSlug: payload.lessonSlug,
    completed: Boolean(payload.completed),
    syncState: "queued-for-database",
  });
}
