import { badRequest, created } from "@/lib/api/responses";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.courseSlug !== "string") {
    return badRequest("courseSlug is required");
  }

  return created({
    paymentId: `payfast-${Date.now()}`,
    provider: "payfast",
    mode: "placeholder",
    configured: Boolean(process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY),
    courseSlug: payload.courseSlug,
    redirectUrl: "/pricing",
    nextStep: "Sign PayFast payload and redirect to hosted payment page.",
  });
}
