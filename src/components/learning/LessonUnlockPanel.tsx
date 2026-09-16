"use client";

import { forwardRef } from "react";
import { Loader2, Lock } from "lucide-react";
import { PaymentGatewaySection } from "@/components/courses/PaymentGatewaySection";
import { formatCurrency } from "@/lib/format";
import type { useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";

type Props = { unlock: ReturnType<typeof useCourseUnlockPurchase>; accentColor: string };

/**
 * Compact "buy the rest of this course" panel embedded directly in the
 * lesson-player sidebar — a learner who hits a locked module should never
 * have to leave the page they're learning on just to see the price and pay.
 * Takes the already-computed `useCourseUnlockPurchase` result as a prop
 * (rather than calling the hook itself) so the enrollment/price fetch runs
 * once per lesson page, shared with the locked-module labelling above it.
 */
export const LessonUnlockPanel = forwardRef<HTMLDivElement, Props>(function LessonUnlockPanel(
  { unlock, accentColor },
  ref,
) {
  const { isPaidCourse, state, confirmingPayment, pricing, pricingUnavailable } = unlock;

  if (!isPaidCourse || (state !== "free-only" && !confirmingPayment)) return null;

  const priceHeadline = pricing?.items[0] ?? null;

  if (confirmingPayment) {
    return (
      <div ref={ref} className="m-3 overflow-hidden rounded-xl bg-white shadow-[0_10px_28px_rgba(6,17,31,0.12)]">
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)` }} />
        <div className="flex items-center gap-2 p-3.5">
          <Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin" style={{ color: accentColor }} />
          <p className="text-xs font-bold" style={{ color: accentColor }}>Confirming your payment…</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="m-3 overflow-hidden rounded-xl bg-white shadow-[0_10px_28px_rgba(6,17,31,0.12)]">
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)` }} />
      <div className="p-3.5">
        <div className="flex items-center gap-1.5">
          <Lock aria-hidden="true" className="h-3.5 w-3.5" style={{ color: accentColor }} />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: accentColor }}>Unlock the full course</p>
        </div>

        {pricing ? (
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-lg font-bold text-ink">{formatCurrency(pricing.totalZar)}</p>
            {priceHeadline && priceHeadline.standardPriceZar > priceHeadline.priceZar ? (
              <p className="text-xs font-semibold text-muted line-through">{formatCurrency(priceHeadline.standardPriceZar)}</p>
            ) : null}
          </div>
        ) : pricingUnavailable ? (
          <p className="mt-2 text-xs font-semibold text-red-700">Pricing unavailable — try again shortly</p>
        ) : (
          <div className="mt-2 h-6 w-24 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        )}
        <p className="mt-0.5 text-xs font-medium text-ink/70">Unlocks every remaining module + certificate</p>

        <div className="mt-3">
          <PaymentGatewaySection unlock={unlock} accentColor={accentColor} compact />
        </div>
      </div>
    </div>
  );
});
