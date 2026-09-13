"use client";

import { CalendarClock, Check, Coins, Crown, Flame, Lock, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";
import { formatCurrency } from "@/lib/format";
import { formatCourseDurationWeeks } from "@/lib/course-content";
import type { Course } from "@/types/lms";

type Props = { course: Course; accentColor: string; totalMinutes: number };

/**
 * One combined enrol + unlock card. Free Module 1 is always the headline and
 * the only thing that matters before a learner has started — the paid
 * "unlock everything" pitch is folded into the SAME card as a clearly
 * secondary section, so there's only ever one obvious next button to press:
 * enrol first, then (once in) unlock. Replaces what used to be two stacked
 * white cards (a plain enrol box + a separate CourseUnlockCard).
 */
export function CourseEnrolCard({ course, accentColor, totalMinutes }: Props) {
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
    savingsZar,
    payWithCash,
    payWithVowr,
  } = unlock;

  const founding = pricing?.items[0]?.foundingActive ?? false;
  const foundingSlotsLeft = pricing?.items[0]?.foundingSlotsLeft ?? 0;
  const priceHeadline = pricing?.items[0] ?? null;
  const showUnlockSection = isPaidCourse && (state === "free-only" || state === "unlocked");

  return (
    <div id="course-unlock" className="scroll-mt-24 overflow-hidden rounded-xl text-ink shadow-[0_28px_64px_rgba(6,17,31,0.32)]" style={{ backgroundColor: "white" }}>
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)` }} />
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
          {isPaidCourse ? "Start free — Module 1" : "Enrol now"}
        </p>
        <p className="mt-3 text-4xl font-bold text-ink">{formatCurrency(course.price)}</p>
        {course.price > 0 ? <p className="mt-1 text-xs text-muted">One-time payment through PayFast</p> : null}
        {isPaidCourse ? (
          <p className="mt-1.5 text-sm leading-6 text-muted">
            No card, no commitment — jump straight into the first module and see if this course is right for you.
          </p>
        ) : null}
        <div className="mt-5"><EnrollButton course={course} /></div>

        <div className="mt-5 flex items-center gap-2.5 text-sm text-muted">
          <CalendarClock aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>Learn at your own pace</span>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Duration</p>
          <p className="text-sm font-semibold text-ink">{formatCourseDurationWeeks(totalMinutes)}</p>
        </div>
      </div>

      {isPaidCourse ? (
        <div className="border-t-2" style={{ borderColor: `${accentColor}22` }}>
          {!showUnlockSection ? (
            <div className="p-6" style={{ backgroundColor: `${accentColor}0a` }}>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: accentColor }}>
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                What's next after Module 1
              </p>
              <p className="mt-2 text-sm leading-6 text-ink">
                Love it? Unlock the remaining {Math.max(totalModules - 1, 1)} modules, final assessment, and certificate
                {pricing ? (
                  <>
                    {" "}
                    for <span className="font-bold">{formatCurrency(pricing.totalZar)}</span> — or{" "}
                    <span className="font-bold">{pricing.vowrPrice} VOWR</span>.
                  </>
                ) : (
                  "."
                )}
              </p>
              {founding ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <Flame aria-hidden="true" className="h-3.5 w-3.5" /> Founding Learner pricing — {foundingSlotsLeft} spots left
                </p>
              ) : null}
            </div>
          ) : state === "unlocked" ? (
            <div className="p-6" style={{ backgroundColor: `${accentColor}0d` }}>
              <p className="flex items-center gap-2 text-sm font-bold" style={{ color: accentColor }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: accentColor }}>
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
                Full course unlocked
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Every module, the final assessment, and your certificate are open. Keep learning below.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Lock aria-hidden="true" className="h-4 w-4" style={{ color: accentColor }} />
                <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
                  Unlock the full course
                </p>
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-ink">
                You&apos;ve completed the free module — great start. Unlock the remaining {Math.max(totalModules - 1, 1)}{" "}
                module{totalModules - 1 === 1 ? "" : "s"}, final assessment, and certificate to finish what you started.
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
              ) : pricingUnavailable ? (
                <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-red-700">
                  <TriangleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Pricing is temporarily unavailable. Please try again shortly.
                </p>
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
                {paying === "cash" ? "Redirecting to PayFast..." : pricing ? `Pay ${formatCurrency(pricing.totalZar)} via PayFast` : pricingUnavailable ? "Unavailable — try again" : "Loading price…"}
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
                {paying === "vowr" ? "Unlocking..." : pricing ? `Unlock with ${pricing.vowrPrice} VOWR` : pricingUnavailable ? "Unavailable — try again" : "Loading price…"}
              </button>

              {pricing ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink/70">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" />
                  Save {pricing.vowrDiscountPercent}% paying with VOWR
                </p>
              ) : null}
              {pricing && vowrBalance !== null && !canAffordVowr ? (
                <p className="mt-2 text-xs font-medium text-ink/70">
                  You have {vowrBalance} VOWR — earn {Math.max(0, pricing.vowrPrice - vowrBalance)} more by completing lessons
                  and assessments, or pay by card above.
                </p>
              ) : null}

              <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink/70">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                Secure checkout via PayFast. Certificate issued the moment you finish the final assessment.
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink/70">
                <Crown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                One-time unlock — yours for life, no subscription.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
