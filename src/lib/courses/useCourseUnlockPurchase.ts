"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CourseModule } from "@/types/lms";
import { useSession } from "@/lib/auth/useSession";
import { useWalletBalance } from "@/lib/rewards/useWalletBalance";
import { invalidateCourseEnrollmentCounts } from "@/lib/course-enrollment-counts-client";

export type UnlockPriceResponse = {
  items: { parentSlug: string; standardPriceZar: number; priceZar: number; foundingActive: boolean; foundingSlotsLeft: number }[];
  subtotalZar: number;
  isBundle: boolean;
  bundleDiscountPercent: number;
  totalZar: number;
  vowrDiscountPercent: number;
  vowrPrice: number;
};

type PaymentData = { formAction?: string; formFields?: Record<string, string | number>; redirectUrl?: string };

type Enrollment = { courseSlug?: string; course_slug?: string; groupSlug?: string | null; status?: string };

export type UnlockState = "loading" | "not-enrolled" | "free-only" | "unlocked";

function submitPayment(router: ReturnType<typeof useRouter>, data: PaymentData) {
  if (!data.formAction || !data.formFields) {
    if (data.redirectUrl) router.push(data.redirectUrl);
    else toast.error("Payment is not available for this course yet.");
    return;
  }
  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.formAction;
  for (const [name, value] of Object.entries(data.formFields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

/**
 * Shared "buy the rest of this course" logic — used by the full course-page
 * unlock card and the compact in-lesson unlock panel, so the enrollment/price
 * fetch and both payment paths (PayFast + VOWR) are only ever written once.
 *
 * Takes the real *parent group* slug explicitly (not a `Course.slug`) because
 * on the lesson-player, `course.slug` is deliberately the real child Moodle
 * course slug (progress stays linked to it), while pricing/enrollment-count
 * here must key on the parent slug the paywall/pricing tables use.
 */
export function useCourseUnlockPurchase(parentSlug: string, modules: CourseModule[]) {
  const router = useRouter();
  const session = useSession();
  const isPaidCourse = modules.some((m) => m.isFree === false);
  const totalModules = modules.length;

  const [state, setState] = useState<UnlockState>("loading");
  const [pricing, setPricing] = useState<UnlockPriceResponse | null>(null);
  const [pricingUnavailable, setPricingUnavailable] = useState(false);
  const [paying, setPaying] = useState<"cash" | "vowr" | null>(null);
  const wallet = useWalletBalance(session.status === "authenticated");

  useEffect(() => {
    if (!isPaidCourse) return;
    if (session.status !== "authenticated") return;

    const controller = new AbortController();
    fetch("/api/enrollments", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const enrollments = (payload?.data ?? []) as Enrollment[];
        const enrolledCount = enrollments.filter(
          (item) =>
            ((item.courseSlug ?? item.course_slug) === parentSlug || item.groupSlug === parentSlug) &&
            item.status !== "cancelled",
        ).length;
        if (enrolledCount === 0) setState("not-enrolled");
        else if (enrolledCount >= totalModules) setState("unlocked");
        else setState("free-only");
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [parentSlug, isPaidCourse, session.status, totalModules]);

  useEffect(() => {
    if (!isPaidCourse) return;
    const controller = new AbortController();
    let cancelled = false;
    let attempt = 0;

    async function loadPricing() {
      while (!cancelled && attempt < 3) {
        try {
          const res = await fetch(`/api/courses/unlock-price?slugs=${encodeURIComponent(parentSlug)}`, { signal: controller.signal });
          const payload = await res.json().catch(() => null);
          if (res.ok && payload?.ok) {
            if (!cancelled) setPricing(payload.data as UnlockPriceResponse);
            return;
          }
        } catch {
          // retry below unless aborted
        }
        attempt += 1;
        if (attempt < 3 && !cancelled) await new Promise((r) => setTimeout(r, 1200 * attempt));
      }
      if (!cancelled) setPricingUnavailable(true);
    }

    loadPricing();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [parentSlug, isPaidCourse]);

  const vowrBalance = wallet.status === "ready" ? wallet.balance : null;
  const canAffordVowr = pricing !== null && vowrBalance !== null && vowrBalance >= pricing.vowrPrice;
  const savingsZar = pricing ? pricing.items.reduce((sum, i) => sum + (i.standardPriceZar - i.priceZar), 0) : 0;

  async function payWithCash() {
    setPaying("cash");
    try {
      const res = await fetch("/api/payments/course-unlock-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [parentSlug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "Payment could not be started.");
      submitPayment(router, payload.data as PaymentData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      setPaying(null);
    }
  }

  async function payWithVowr() {
    setPaying("vowr");
    try {
      const res = await fetch("/api/courses/unlock-with-vowr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [parentSlug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "VOWR unlock failed.");
      setState("unlocked");
      invalidateCourseEnrollmentCounts(parentSlug);
      wallet.refresh();
      toast.success(`Course fully unlocked with ${pricing?.vowrPrice ?? ""} VOWR!`, {
        description: "Every module is now open.",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setPaying(null);
    }
  }

  return {
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
  };
}
