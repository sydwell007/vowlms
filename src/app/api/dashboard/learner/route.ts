import { ok } from "@/lib/api/responses";
import { getLearnerDashboard } from "@/lib/data";

export async function GET() {
  return ok(getLearnerDashboard());
}
