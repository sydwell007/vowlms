import { ok } from "@/lib/api/responses";
import { getAcademies } from "@/lib/data";

export async function GET() {
  return ok(getAcademies());
}
