"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Coins } from "lucide-react";
import type { InternationalGateway, useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";
import { formatMoney } from "@/lib/format";
import { VowrRedemptionSlider } from "@/components/courses/VowrRedemptionSlider";

type Props = {
  unlock: ReturnType<typeof useCourseUnlockPurchase>;
  accentColor: string;
  /** Tighter spacing for the lesson-sidebar panel vs. the full course-page card. */
  compact?: boolean;
};

const GATEWAY_LABEL: Record<InternationalGateway, string> = {
  payfast: "PayFast",
  paystack: "Paystack",
  paypal: "PayPal",
  lemonsqueezy: "Lemon Squeezy",
};

declare global {
  interface Window {
    paypal?: {
      Buttons(config: Record<string, unknown>): { render(container: HTMLElement): void };
    };
  }
}

const loadedPaypalCurrencies = new Set<string>();
function loadPaypalSdk(clientId: string, currency: string): Promise<void> {
  const key = `${clientId}:${currency}`;
  if (loadedPaypalCurrencies.has(key) && window.paypal) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
    script.async = true;
    script.onload = () => {
      loadedPaypalCurrencies.add(key);
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load PayPal"));
    document.body.appendChild(script);
  });
}

/**
 * The one adaptive "Pay Now" slot — same size/position regardless of which
 * gateway a learner's country routed them to, plus the VOWR toggle and an
 * inline "other payment options" fallback for when detection is wrong.
 * Shared by CourseEnrolCard (course page) and LessonUnlockPanel (lesson
 * sidebar) so all three checkout flows only ever live in one place.
 *
 * PayPal is the one unavoidable exception to "identical button element": its
 * SDK requires rendering its own branded button into a container rather than
 * being triggered from an arbitrary click — a real PayPal platform
 * requirement, not a design choice here. It still occupies the exact same
 * slot, size, and position as the PayFast/Paystack buttons.
 */
export function PaymentGatewaySection({ unlock, accentColor, compact = false }: Props) {
  const {
    pricing,
    pricingUnavailable,
    paying,
    vowrBalance,
    canAffordVowr,
    gateway,
    currency,
    amountCharged,
    conversionAvailable,
    reservation,
    payWithCash,
    payWithVowr,
    payWithPaystack,
    createPayPalOrder,
    capturePayPalOrder,
    payWithLemonSqueezy,
    setGatewayOverride,
  } = unlock;

  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gateway !== "paypal" || amountCharged === null) return;
    let cancelled = false;

    (async () => {
      setPaypalStatus("loading");
      try {
        const configRes = await fetch("/api/payments/gateway-config");
        const configPayload = await configRes.json();
        const clientId = configPayload?.data?.paypalClientId;
        if (!clientId) throw new Error("PayPal is not configured yet");
        if (cancelled) return;

        await loadPaypalSdk(clientId, currency);
        const container = paypalContainerRef.current;
        if (cancelled || !window.paypal || !container) return;

        container.innerHTML = "";
        window.paypal
          .Buttons({
            style: { layout: "horizontal", height: compact ? 38 : 45, tagline: false, label: "pay" },
            createOrder: () => createPayPalOrder(),
            onApprove: async (data: { orderID: string }) => {
              await capturePayPalOrder(data.orderID);
            },
          })
          .render(container);
        if (!cancelled) setPaypalStatus("ready");
      } catch {
        // PayPal not configured / SDK failed to load — the card falls back
        // to a disabled placeholder in the same slot rather than leaving a
        // silent empty gap; "Other payment options" still works normally.
        if (!cancelled) setPaypalStatus("unavailable");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gateway, currency, amountCharged, compact, createPayPalOrder, capturePayPalOrder]);

  const buttonClass = `w-full rounded-${compact ? "lg" : "xl"} px-6 ${compact ? "py-2.5" : "py-3"} text-center text-sm font-${compact ? "bold" : "semibold"} text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)] transition hover:bg-[#e8b830] disabled:cursor-wait disabled:opacity-60`;

  // A successful pricing response with conversionAvailable:false (no fresh
  // cached FX rate yet — e.g. the exchange-rate cron hasn't run) is a
  // distinct failure from pricingUnavailable (which means the fetch itself
  // never succeeded), but both mean the same thing to a learner: this
  // gateway can't be charged right now. Treated identically here so the
  // button never gets stuck on "Loading price…" forever.
  const priceUnavailable = pricingUnavailable || (pricing !== null && !conversionAvailable);

  // A hybrid partial-VOWR reservation only owes its own cash remainder — see
  // the identical estimate in useCourseUnlockPurchase.ts's payWithPaystack
  // (both derive from the same cached ZAR→currency ratio; the bridge
  // re-verifies the real converted amount server-side regardless).
  const displayAmountCharged =
    reservation && pricing && amountCharged !== null && pricing.totalZar > 0
      ? Math.round(((reservation.cashAmountZar / pricing.totalZar) * amountCharged) * 100) / 100
      : amountCharged;

  const primaryButtonLabel = priceUnavailable
    ? "Unavailable — try again"
    : !pricing || displayAmountCharged === null
      ? "Loading price…"
      : paying === "cash" || paying === "paystack" || paying === "lemonsqueezy"
        ? "Redirecting…"
        : `Pay ${formatMoney(displayAmountCharged, currency)} via ${gateway ? GATEWAY_LABEL[gateway] : ""}`;

  return (
    <div>
      <VowrRedemptionSlider unlock={unlock} accentColor={accentColor} compact={compact} />

      {priceUnavailable ? (
        <button type="button" disabled className={`${buttonClass} cursor-not-allowed opacity-60`} style={{ backgroundColor: "#f5c542" }}>
          {primaryButtonLabel}
        </button>
      ) : gateway === "payfast" ? (
        <button type="button" onClick={payWithCash} disabled={paying !== null || !pricing} className={buttonClass} style={{ backgroundColor: "#f5c542" }}>
          {primaryButtonLabel}
        </button>
      ) : gateway === "paystack" ? (
        <button type="button" onClick={payWithPaystack} disabled={paying !== null || !pricing} className={buttonClass} style={{ backgroundColor: "#f5c542" }}>
          {primaryButtonLabel}
        </button>
      ) : gateway === "lemonsqueezy" ? (
        <button type="button" onClick={payWithLemonSqueezy} disabled={paying !== null || !pricing} className={buttonClass} style={{ backgroundColor: "#f5c542" }}>
          {primaryButtonLabel}
        </button>
      ) : gateway === "paypal" && paypalStatus === "unavailable" ? (
        <button type="button" disabled className={`${buttonClass} cursor-not-allowed opacity-60`} style={{ backgroundColor: "#f5c542" }}>
          PayPal unavailable — try another option below
        </button>
      ) : gateway === "paypal" ? (
        <>
          <div ref={paypalContainerRef} className={paypalStatus === "loading" ? "hidden" : compact ? "min-h-[38px]" : "min-h-[45px]"} />
          {paypalStatus === "loading" ? (
            <div className={`${compact ? "h-9" : "h-11"} w-full animate-pulse rounded-lg bg-slate-200`} aria-hidden="true" />
          ) : null}
        </>
      ) : (
        <div className={`h-${compact ? "9" : "11"} w-full animate-pulse rounded-lg bg-slate-200`} aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={() => setShowOtherOptions((v) => !v)}
        className={`${compact ? "mt-2.5" : "mt-3"} flex w-full items-center justify-center gap-1 text-xs font-medium text-muted hover:text-ink`}
      >
        Other payment options
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${showOtherOptions ? "rotate-180" : ""}`} />
      </button>

      {showOtherOptions ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["payfast", "paystack", "paypal", "lemonsqueezy"] as const)
            .filter((g) => g !== gateway)
            .map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGatewayOverride(g);
                  setShowOtherOptions(false);
                }}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50"
              >
                {GATEWAY_LABEL[g]}
              </button>
            ))}

          {/* The full-price all-VOWR unlock — one alternative payment method
              among equals here, not a separate prominent CTA, so a learner
              scanning this card sees exactly one clear primary action plus a
              flat list of every other way to pay. */}
          <button
            type="button"
            onClick={() => {
              void payWithVowr();
              setShowOtherOptions(false);
            }}
            disabled={paying !== null || !pricing || !canAffordVowr}
            title={pricing && vowrBalance !== null && !canAffordVowr ? `Need ${Math.max(0, pricing.vowrPrice - vowrBalance).toLocaleString()} more VOWR` : undefined}
            className="flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Coins aria-hidden="true" className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
            {paying === "vowr" ? "Unlocking…" : pricing ? `${pricing.vowrPrice.toLocaleString()} VOWR` : "VOWR"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
