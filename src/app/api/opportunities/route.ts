import { ok } from "@/lib/api/responses";
import { getOpportunities } from "@/lib/data";

export async function GET() {
  return ok(getOpportunities());
}
