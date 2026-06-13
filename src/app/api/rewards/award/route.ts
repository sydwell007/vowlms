import { badRequest, created } from "@/lib/api/responses";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.event !== "string") {
    return badRequest("event is required");
  }

  return created({
    rewardEventId: `reward-${Date.now()}`,
    event: payload.event,
    points: Number(payload.points ?? 20),
    integration: "vowrewards-placeholder",
  });
}
