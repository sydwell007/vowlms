"use client";

import { Coins, Crown, Flame, Lock, ShieldCheck, Sparkles } from "lucide-react";
import type { Course } from "@/types/lms";
import { useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";
import { formatCurrency } from "@/lib/format";

type Props = { course: Course; accentColor: string };

export function CourseUnlockCard({ course, accentColor }: Props) {
  const {
    isPaidCourse,
    totalModules,
    state,
    pricing,
    paying,
    vowrBalance,
    canAffordVowr,
    savingsZar,
    payWithCash,
    payWithVowr,
  } = useCourseUnlockPurchase(course.slug, course.modules);

  const founding = pricing?.items[0]?.foundingActive ?? false;
  const foundingSlotsLeft = pricing?.items[0]?.foundingSlotsLeft ?? 0;
  const priceHeadline = pricing?.items[0] ?? null;

  if (!isPaidCourse || state === "unlocked" || state === "loading" || state === "not-enrolled") {
    return null;
  }

  return (
    <div
      id="course-unlock"
      className="scroll-mt-24 mt-5 overflow-hidden rounded-xl border-2 bg-white shadow-[0_18px_40px_rgba(6,17,31,0.14)]"
      style={{ borderColor: accentColor }}
    >
      <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: accentColor }}>
        <Lock aria-hidden="true" className="h-4 w-4 text-white" />
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white">Unlock the full course</p>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium leading-6 text-ink">
          You&apos;ve completed the free module. Unlock the remaining {totalModules - 1} module
          {totalModules - 1 === 1 ? "" : "s"}, final assessment, and certificate.
        </p>

        {founding ? (
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-800">
            <Flame aria-hidden="true" className="h-3.5 w-3.5" />
            Founding Learner price — {foundingSlotsLeft} left
          </div>
        ) : null}

        {priceHeadline ? (
          <div className="mt-4 flex items-baseline gap-2.5">
            <p className="text-3xl font-bold text-ink">{formatCurrency(pricing!.totalZar)}</p>
            {priceHeadline.standardPriceZar > priceHeadline.priceZar ? (
              <p className="text-sm font-semibold text-muted line-through">{formatCurrency(priceHeadline.standardPriceZar)}</p>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 h-8 w-32 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        )}
        {savingsZar > 0 ? <p className="mt-1 text-xs font-bold text-emerald-700">You save {formatCurrency(savingsZar)}</p> : null}

        <button
          type="button"
          onClick={payWithCash}
          disabled={paying !== null || !pricing}
          className="mt-4 w-full rounded-xl px-6 py-3 text-center text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)] transition hover:bg-[#e8b830] disabled:cursor-wait disabled:opacity-60"
          style={{ backgroundColor: "#f5c542" }}
        >
          {paying === "cash" ? "Redirecting to PayFast..." : `Pay ${pricing ? formatCurrency(pricing.totalZar) : ""} via PayFast`}
        </button>

        <div className="my-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={payWithVowr}
          disabled={paying !== null || !pricing || !canAffordVowr}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-center text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          <Coins aria-hidden="true" className="h-4 w-4" />
          {paying === "vowr" ? "Unlocking..." : `Unlock with ${pricing?.vowrPrice ?? "..."} VOWR`}
        </button>

        {pricing ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink/70">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" />
            Save {pricing.vowrDiscountPercent}% paying with VOWR
          </p>
        ) : null}

        {pricing && vowrBalance !== null && !canAffordVowr ? (
          <p className="mt-2 text-xs font-medium text-ink/70">
            You have {vowrBalance} VOWR — earn {Math.max(0, pricing.vowrPrice - vowrBalance)} more by completing lessons and
            assessments, or pay by card above.
          </p>
        ) : null}

        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink/70">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          Secure checkout via PayFast. Certificate issued the moment you complete the final assessment.
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink/70">
          <Crown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          One-time unlock — yours for life, no subscription.
        </p>
      </div>
    </div>
  );
}
