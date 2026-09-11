"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Coins, Crown, Flame, Lock, ShieldCheck, Sparkles } from "lucide-react";
import type { Course } from "@/types/lms";
import { useSession } from "@/lib/auth/useSession";
import { useWalletBalance } from "@/lib/rewards/useWalletBalance";
import { formatCurrency } from "@/lib/format";
import { invalidateCourseEnrollmentCounts } from "@/lib/course-enrollment-counts-client";

type Props = { course: Course; accentColor: string };

type Enrollment = {
  courseSlug?: string;
  course_slug?: string;
  groupSlug?: string | null;
  status?: string;
};

type UnlockPriceResponse = {
  items: { parentSlug: string; standardPriceZar: number; priceZar: number; foundingActive: boolean; foundingSlotsLeft: number }[];
  subtotalZar: number;
  isBundle: boolean;
  bundleDiscountPercent: number;
  totalZar: number;
  vowrDiscountPercent: number;
  vowrPrice: number;
};

type PaymentData = { formAction?: string; formFields?: Record<string, string | number>; redirectUrl?: string };

type UnlockState = "loading" | "not-enrolled" | "free-only" | "unlocked";

export function CourseUnlockCard({ course, accentColor }: Props) {
  const router = useRouter();
  const session = useSession();
  const isPaidCourse = course.modules.some((m) => m.isFree === false);
  const totalModules = course.modules.length;

  const [state, setState] = useState<UnlockState>("loading");
  const [pricing, setPricing] = useState<UnlockPriceResponse | null>(null);
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
            ((item.courseSlug ?? item.course_slug) === course.slug || item.groupSlug === course.slug) &&
            item.status !== "cancelled",
        ).length;
        if (enrolledCount === 0) setState("not-enrolled");
        else if (enrolledCount >= totalModules) setState("unlocked");
        else setState("free-only");
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [course.slug, isPaidCourse, session.status, totalModules]);

  useEffect(() => {
    if (!isPaidCourse) return;
    const controller = new AbortController();
    fetch(`/api/courses/unlock-price?slugs=${encodeURIComponent(course.slug)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.ok) setPricing(payload.data as UnlockPriceResponse);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [course.slug, isPaidCourse]);

  const founding = pricing?.items[0]?.foundingActive ?? false;
  const foundingSlotsLeft = pricing?.items[0]?.foundingSlotsLeft ?? 0;
  const savingsZar = pricing ? pricing.items.reduce((sum, i) => sum + (i.standardPriceZar - i.priceZar), 0) : 0;

  const vowrBalance = wallet.status === "ready" ? wallet.balance : null;
  const canAffordVowr = pricing !== null && vowrBalance !== null && vowrBalance >= pricing.vowrPrice;

  function submitPayment(data: PaymentData) {
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

  async function payWithCash() {
    setPaying("cash");
    try {
      const res = await fetch("/api/payments/course-unlock-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [course.slug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "Payment could not be started.");
      submitPayment(payload.data as PaymentData);
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
        body: JSON.stringify({ parentSlugs: [course.slug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "VOWR unlock failed.");
      setState("unlocked");
      invalidateCourseEnrollmentCounts(course.slug);
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

  const priceHeadline = useMemo(() => {
    if (!pricing) return null;
    return pricing.items[0];
  }, [pricing]);

  if (!isPaidCourse || state === "unlocked" || state === "loading" || state === "not-enrolled") {
    return null;
  }

  return (
    <div id="course-unlock" className="scroll-mt-24 mt-5 overflow-hidden rounded-xl border" style={{ borderColor: `${accentColor}33` }}>
      <div className="p-5" style={{ backgroundColor: `${accentColor}0d` }}>
        <div className="flex items-center gap-2">
          <Lock aria-hidden="true" className="h-4 w-4" style={{ color: accentColor }} />
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: accentColor }}>
            Unlock the full course
          </p>
        </div>
        <p className="mt-1.5 text-sm leading-6 text-muted">
          You&apos;ve completed the free module. Unlock the remaining {totalModules - 1} module{totalModules - 1 === 1 ? "" : "s"}, final
          assessment, and certificate.
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
              <p className="text-sm font-medium text-muted line-through">{formatCurrency(priceHeadline.standardPriceZar)}</p>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 h-8 w-32 animate-pulse rounded bg-slate-200" aria-hidden="true" />
        )}
        {savingsZar > 0 ? <p className="mt-1 text-xs font-medium text-emerald-700">You save {formatCurrency(savingsZar)}</p> : null}

        <button
          type="button"
          onClick={payWithCash}
          disabled={paying !== null || !pricing}
          className="mt-4 w-full rounded-xl px-6 py-3 text-center text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:cursor-wait disabled:opacity-60"
          style={{ backgroundColor: "#f5c542" }}
        >
          {paying === "cash" ? "Redirecting to PayFast..." : `Pay ${pricing ? formatCurrency(pricing.totalZar) : ""} via PayFast`}
        </button>

        <div className="my-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={payWithVowr}
          disabled={paying !== null || !pricing || !canAffordVowr}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          <Coins aria-hidden="true" className="h-4 w-4" />
          {paying === "vowr" ? "Unlocking..." : `Unlock with ${pricing?.vowrPrice ?? "..."} VOWR`}
        </button>

        {pricing ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" />
            Save {pricing.vowrDiscountPercent}% paying with VOWR
          </p>
        ) : null}

        {pricing && vowrBalance !== null && !canAffordVowr ? (
          <p className="mt-2 text-xs text-muted">
            You have {vowrBalance} VOWR — earn {Math.max(0, pricing.vowrPrice - vowrBalance)} more by completing lessons and
            assessments, or pay by card above.
          </p>
        ) : null}

        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
          Secure checkout via PayFast. Certificate issued the moment you complete the final assessment.
        </p>
        {course.slug ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
            <Crown aria-hidden="true" className="h-3.5 w-3.5" />
            One-time unlock — yours for life, no subscription.
          </p>
        ) : null}
      </div>
    </div>
  );
}
