import { ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeGet, bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getMockSession } from "@/lib/auth/mock-auth";

export async function GET() {
  if (!isBridgeConfigured()) {
    const session = getMockSession("learner");
    return ok({
      ...session.user,
      phone: "+27 82 123 4567",
      city: "Cape Town",
      country: "South Africa",
      bio: "GoalVow learner on the upskilling pathway.",
      preferredAcademy: "Upskilling Academy",
      emailNotifications: true,
      smsNotifications: false,
      language: "English",
      timezone: "Africa/Johannesburg",
    });
  }

  try {
    return ok(await bridgeGet("/user/profile"));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    return serverError("Failed to fetch profile");
  }
}

export async function PUT(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) return ok({ updated: false });

  if (!isBridgeConfigured()) {
    return ok({ updated: true, mode: "dev" });
  }

  try {
    return ok(await bridgePost("/user/profile", payload));
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    return serverError("Failed to update profile");
  }
}
