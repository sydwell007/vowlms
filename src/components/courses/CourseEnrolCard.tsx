"use client";

import { Check, Coins, Lock, TriangleAlert } from "lucide-react";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";
import { formatCurrency } from "@/lib/format";
import type { Course } from "@/types/lms";

type Props = { course: Course; accentColor: string };

/**
 * One combined, deliberately compact enrol + unlock card. Free Module 1 is
 * always the one obvious action — the paid "unlock everything" pitch folds
 * into the same card as a short secondary section (a one-line teaser before
 * enrolling, real Pay/VOWR buttons once enrolled, a short success line once
 * unlocked), never longer than a couple of short sentences so the card never
 * outgrows the hero banner it sits over.
 */
export function CourseEnrolCard({ course, accentColor }: Props) {
  const unlock = useCourseUnlockPurchase(course.slug, course.modules);
  const {
    isPaidCourse,
    totalModules,
    state,
    pricing,
    pricingUnavailable,
    paying,
    vowrBalance,
    canAffordVowr,
    payWithCash,
    payWithVowr,
  } = unlock;

  const priceHeadline = pricing?.items[0] ?? null;
  const showUnlockSection = isPaidCourse && (state === "free-only" || state === "unlocked");
  const remainingModules = Math.max(totalModules - 1, 1);

  return (
    <div id="course-unlock" className="scroll-mt-24 overflow-hidden rounded-xl text-ink shadow-[0_28px_64px_rgba(6,17,31,0.32)]" style={{ backgroundColor: "white" }}>
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)` }} />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
          {isPaidCourse ? "Start free — Module 1" : "Enrol now"}
        </p>
        {!isPaidCourse ? <p className="mt-2.5 text-4xl font-bold text-ink">{formatCurrency(course.price)}</p> : null}
        {course.price > 0 ? <p className="mt-1 text-xs text-muted">One-time payment through PayFast</p> : null}
        <div className={isPaidCourse ? "mt-3" : "mt-4"}><EnrollButton course={course} /></div>
      </div>

      {isPaidCourse ? (
        <div className="border-t-2" style={{ borderColor: `${accentColor}22` }}>
          {!showUnlockSection ? (
            <div className="px-5 py-4" style={{ backgroundColor: `${accentColor}0a` }}>
              <p className="text-sm leading-5 text-ink">
                Then unlock the rest{pricing ? (
                  <>
                    {" "}for <span className="font-bold">{formatCurrency(pricing.totalZar)}</span> or{" "}
                    <span className="font-bold">{pricing.vowrPrice} VOWR</span>
                  </>
                ) : null}.
              </p>
            </div>
          ) : state === "unlocked" ? (
            <div className="flex items-center gap-2.5 px-5 py-4" style={{ backgroundColor: `${accentColor}0d` }}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: accentColor }}>
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-bold" style={{ color: accentColor }}>Full course unlocked</p>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center gap-2">
                <Lock aria-hidden="true" className="h-4 w-4" style={{ color: accentColor }} />
                <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
                  Unlock the full course
                </p>
              </div>
              <p className="mt-1 text-sm leading-5 text-ink">
                {remainingModules} more module{remainingModules === 1 ? "" : "s"} + final assessment + certificate.
              </p>

              {priceHeadline ? (
                <div className="mt-2.5 flex items-baseline gap-2.5">
                  <p className="text-2xl font-bold text-ink">{formatCurrency(pricing!.totalZar)}</p>
                  {priceHeadline.standardPriceZar > priceHeadline.priceZar ? (
                    <p className="text-sm font-semibold text-muted line-through">{formatCurrency(priceHeadline.standardPriceZar)}</p>
                  ) : null}
                </div>
              ) : pricingUnavailable ? (
                <p className="mt-2.5 flex items-center gap-1.5 text-sm font-semibold text-red-700">
                  <TriangleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Pricing unavailable — try again shortly.
                </p>
              ) : (
                <div className="mt-2.5 h-7 w-32 animate-pulse rounded bg-slate-200" aria-hidden="true" />
              )}

              <button
                type="button"
                onClick={payWithCash}
                disabled={paying !== null || !pricing}
                className="mt-3 w-full rounded-lg px-6 py-2.5 text-center text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.3)] transition hover:bg-[#e8b830] disabled:cursor-wait disabled:opacity-60"
                style={{ backgroundColor: "#f5c542" }}
              >
                {paying === "cash" ? "Redirecting to PayFast..." : pricing ? `Pay ${formatCurrency(pricing.totalZar)} via PayFast` : pricingUnavailable ? "Unavailable — try again" : "Loading price…"}
              </button>

              <div className="my-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={payWithVowr}
                disabled={paying !== null || !pricing || !canAffordVowr}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 px-6 py-2.5 text-center text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                <Coins aria-hidden="true" className="h-4 w-4" />
                {paying === "vowr" ? "Unlocking..." : pricing ? `Unlock with ${pricing.vowrPrice} VOWR` : pricingUnavailable ? "Unavailable — try again" : "Loading price…"}
              </button>

              {pricing && vowrBalance !== null && !canAffordVowr ? (
                <p className="mt-1.5 text-xs font-medium text-ink/70">Need {Math.max(0, pricing.vowrPrice - vowrBalance)} more VOWR.</p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
