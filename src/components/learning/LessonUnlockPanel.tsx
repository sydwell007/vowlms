"use client";

import { forwardRef } from "react";
import { Coins, Flame, Lock } from "lucide-react";
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
  const { isPaidCourse, state, pricing, paying, canAffordVowr, payWithCash, payWithVowr } = unlock;

  if (!isPaidCourse || state !== "free-only") return null;

  const founding = pricing?.items[0]?.foundingActive ?? false;

  return (
    <div ref={ref} className="m-3 overflow-hidden rounded-xl border-2 bg-white shadow-[0_10px_28px_rgba(6,17,31,0.12)]" style={{ borderColor: accentColor }}>
      <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ backgroundColor: accentColor }}>
        <Lock aria-hidden="true" className="h-3.5 w-3.5 text-white" />
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white">Unlock the full course</p>
      </div>
      <div className="p-3.5">
        {founding ? (
          <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.06em] text-amber-700">
            <Flame aria-hidden="true" className="h-3 w-3" /> Founding Learner price
          </p>
        ) : null}
        <p className="text-lg font-bold text-ink">{pricing ? formatCurrency(pricing.totalZar) : "..."}</p>
        <p className="mt-0.5 text-xs font-medium text-ink/70">Unlocks every remaining module + certificate</p>

        <button
          type="button"
          onClick={payWithCash}
          disabled={paying !== null || !pricing}
          className="mt-3 w-full rounded-lg px-4 py-2 text-center text-xs font-bold text-[#06111f] transition hover:bg-[#e8b830] disabled:cursor-wait disabled:opacity-60"
          style={{ backgroundColor: "#f5c542" }}
        >
          {paying === "cash" ? "Redirecting..." : "Pay via PayFast"}
        </button>
        <button
          type="button"
          onClick={payWithVowr}
          disabled={paying !== null || !pricing || !canAffordVowr}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 px-4 py-2 text-center text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          <Coins aria-hidden="true" className="h-3.5 w-3.5" />
          {paying === "vowr" ? "Unlocking..." : `${pricing?.vowrPrice ?? "..."} VOWR`}
        </button>
      </div>
    </div>
  );
});
