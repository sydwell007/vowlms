import { ok } from "@/lib/api/responses";
import { getLearningHubs } from "@/lib/data";

export async function GET() {
  return ok(getLearningHubs());
}
