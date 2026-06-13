import { ok } from "@/lib/api/responses";
import { getAdminDashboard } from "@/lib/data";

export async function GET() {
  return ok(getAdminDashboard());
}
