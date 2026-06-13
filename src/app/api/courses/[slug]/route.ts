import { ok } from "@/lib/api/responses";
import { getCourseBySlug } from "@/lib/data";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return Response.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  return ok(course);
}
