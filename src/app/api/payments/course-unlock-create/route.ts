import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || !Array.isArray(payload.parentSlugs) || payload.parentSlugs.some((s: unknown) => typeof s !== "string") || payload.parentSlugs.length === 0) {
    return badRequest("parentSlugs is required and must be a non-empty array of course slugs");
  }

  if (!isBridgeConfigured()) {
    return created({
      paymentId: `payfast-unlock-${Date.now()}`,
      provider: "payfast",
      mode: "dev-placeholder",
      configured: Boolean(process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY),
      parentSlugs: payload.parentSlugs,
      redirectUrl: "/pricing",
      nextStep: "Set BRIDGE_BASE_URL, PAYFAST_MERCHANT_ID, and PAYFAST_MERCHANT_KEY to enable live payments.",
    });
  }

  try {
    return created(
      await bridgePost("/payments/course-unlock-payfast-create", {
        parentSlugs: payload.parentSlugs,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/dashboard/learner`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/pricing`,
        notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/payments/payfast/notify`,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to create course unlock payment");
  }
}
