import { badRequest, created, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.courseSlug !== "string") {
    return badRequest("courseSlug is required");
  }

  if (!isBridgeConfigured()) {
    return created({
      paymentId: `payfast-${Date.now()}`,
      provider: "payfast",
      mode: "dev-placeholder",
      configured: Boolean(process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY),
      courseSlug: payload.courseSlug,
      redirectUrl: "/pricing",
      nextStep: "Set BRIDGE_BASE_URL, PAYFAST_MERCHANT_ID, and PAYFAST_MERCHANT_KEY to enable live payments.",
    });
  }

  try {
    return created(
      await bridgePost("/payments/payfast-create", {
        courseSlug: payload.courseSlug,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/dashboard/learner`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/pricing`,
        notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/payments/payfast/notify`,
      }),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to create payment");
  }
}
