import { ok } from "@/lib/api/responses";
import { getCourses } from "@/lib/data";

export async function GET() {
  return ok(getCourses());
}
