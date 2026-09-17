"use client";

import { Check, Eye, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { PaymentGatewaySection } from "@/components/courses/PaymentGatewaySection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";
import { formatCurrency } from "@/lib/format";
import type { Course } from "@/types/lms";

type Props = {
  course: Course;
  accentColor: string;
  adminPreview?: boolean;
  previewHref?: string;
};

/**
 * One combined enrol + unlock card. Free Module 1 is always the one obvious
 * primary action, and the full unlock pricing/Pay/VOWR section renders right
 * below it immediately — a learner never has to enrol first to see or act on
 * the price, since course-unlock-payfast-create.php / unlock-with-vowr.php
 * both create the enrollment rows themselves as part of granting access.
 * Swaps to a short success line once the course is actually unlocked.
 */
export function CourseEnrolCard({ course, accentColor, adminPreview = false, previewHref }: Props) {
  const unlock = useCourseUnlockPurchase(course.slug, course.modules);
  const { isPaidCourse, totalModules, state, confirmingPayment, pricing, pricingUnavailable, savingsZar } = unlock;

  const priceHeadline = pricing?.items[0] ?? null;
  const remainingModules = Math.max(totalModules - 1, 1);

  return (
    <div id="course-unlock" className="scroll-mt-24 overflow-hidden rounded-xl text-ink shadow-[0_28px_64px_rgba(6,17,31,0.32)]" style={{ backgroundColor: "white" }}>
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)` }} />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
          {adminPreview ? "Admin preview" : isPaidCourse ? "Start free — Module 1" : "Enrol now"}
        </p>
        {!isPaidCourse ? <p className="mt-2.5 text-4xl font-bold text-ink">{formatCurrency(course.price)}</p> : null}
        {course.price > 0 ? <p className="mt-1 text-xs text-muted">{adminPreview ? "Launch price" : "One-time payment through PayFast"}</p> : null}
        <div className={isPaidCourse ? "mt-3" : "mt-4"}>
          {adminPreview && previewHref ? (
            <ButtonLink href={previewHref} variant="ink" className="w-full gap-2">
              <Eye aria-hidden="true" className="h-4 w-4" /> Preview course
            </ButtonLink>
          ) : (
            <EnrollButton course={course} />
          )}
        </div>
      </div>

      {isPaidCourse && !adminPreview ? (
        <div className="border-t-2" style={{ borderColor: `${accentColor}22` }}>
          {state === "unlocked" ? (
            <div className="flex items-center gap-2.5 px-5 py-4" style={{ backgroundColor: `${accentColor}0d` }}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: accentColor }}>
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-bold" style={{ color: accentColor }}>Full course unlocked</p>
            </div>
          ) : confirmingPayment ? (
            <div className="flex items-center gap-2.5 px-5 py-4" style={{ backgroundColor: `${accentColor}0d` }}>
              <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-200" style={{ borderTopColor: accentColor }} aria-hidden="true" />
              <p className="text-sm font-bold" style={{ color: accentColor }}>Confirming your payment…</p>
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
              {savingsZar > 0 ? <p className="mt-1 text-xs font-bold text-emerald-700">You save {formatCurrency(savingsZar)}</p> : null}

              <div className="mt-3">
                <PaymentGatewaySection unlock={unlock} accentColor={accentColor} />
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink/70">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                Secure checkout. Certificate issued the moment you complete the final assessment.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
