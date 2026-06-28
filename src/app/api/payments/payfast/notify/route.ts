import { ok, serverError } from "@/lib/api/responses";
import { bridgePost, isBridgeConfigured } from "@/lib/bridge";

/**
 * PayFast ITN (Instant Transaction Notification) webhook.
 * PayFast POSTs form-encoded data to this URL after payment.
 * We forward it to the PHP bridge which verifies the signature
 * and updates the payment record in MySQL.
 */
export async function POST(request: Request) {
  const body = await request.text();

  if (!isBridgeConfigured()) {
    console.log("[PayFast ITN] Bridge not configured — logging payload:", body);
    return ok({ received: true, mode: "dev-placeholder" });
  }

  try {
    const result = await bridgePost<{ paymentId: string; status: string }>(
      "/payments/payfast-notify",
      { itnRaw: body },
      { noAuth: true },
    );
    return ok(result);
  } catch (e) {
    console.error("[PayFast ITN] Bridge error:", e);
    return serverError("ITN processing failed");
  }
}
