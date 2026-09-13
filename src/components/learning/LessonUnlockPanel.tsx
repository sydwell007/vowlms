"use client";

import { forwardRef } from "react";
import { Lock } from "lucide-react";
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
  const { isPaidCourse, state, pricing, pricingUnavailable } = unlock;

  if (!isPaidCourse || state !== "free-only") return null;

  return (
    <div ref={ref} className="m-3 overflow-hidden rounded-xl border-2 bg-white shadow-[0_10px_28px_rgba(6,17,31,0.12)]" style={{ borderColor: accentColor }}>
      <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ backgroundColor: accentColor }}>
        <Lock aria-hidden="true" className="h-3.5 w-3.5 text-white" />
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white">Unlock the full course</p>
      </div>
      <div className="p-3.5">
        {pricing ? (
          <p className="text-lg font-bold text-ink">{formatCurrency(pricing.totalZar)}</p>
        ) : pricingUnavailable ? (
          <p className="text-xs font-semibold text-red-700">Pricing unavailable — try again shortly</p>
        ) : (
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        )}
        <p className="mt-0.5 text-xs font-medium text-ink/70">Unlocks every remaining module + certificate</p>

        <div className="mt-3">
          <PaymentGatewaySection unlock={unlock} accentColor={accentColor} compact />
        </div>
      </div>
    </div>
  );
});
