"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Coins, Flame, Layers, ShieldCheck, Sparkles } from "lucide-react";
import type { Course } from "@/types/lms";
import { useSession } from "@/lib/auth/useSession";
import { useWalletBalance } from "@/lib/rewards/useWalletBalance";
import { formatCurrency } from "@/lib/format";
import { invalidateCourseEnrollmentCounts } from "@/lib/course-enrollment-counts-client";

type Props = { pathwayTitle: string; courses: Course[]; accentColor?: string };

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

const ACCENT = "#1166c8";

export function PathwayUnlockCard({ pathwayTitle, courses, accentColor = ACCENT }: Props) {
  const router = useRouter();
  const session = useSession();
  const paidSlugs = courses.filter((c) => c.modules.some((m) => m.isFree === false)).map((c) => c.slug);

  const [pricing, setPricing] = useState<UnlockPriceResponse | null>(null);
  const [paying, setPaying] = useState<"cash" | "vowr" | null>(null);
  const wallet = useWalletBalance(session.status === "authenticated");

  useEffect(() => {
    if (paidSlugs.length === 0) return;
    const controller = new AbortController();
    fetch(`/api/courses/unlock-price?slugs=${encodeURIComponent(paidSlugs.join(","))}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.ok) setPricing(payload.data as UnlockPriceResponse);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [paidSlugs.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  if (paidSlugs.length === 0) return null;

  const vowrBalance = wallet.status === "ready" ? wallet.balance : null;
  const canAffordVowr = pricing !== null && vowrBalance !== null && vowrBalance >= pricing.vowrPrice;
  const savingsZar = pricing ? pricing.items.reduce((sum, i) => sum + (i.standardPriceZar - i.priceZar), 0) : 0;

  async function ensureFreeAccess() {
    await Promise.allSettled(
      paidSlugs.map((slug) =>
        fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ courseSlug: slug }),
        }),
      ),
    );
  }

  function submitPayment(data: PaymentData) {
    if (!data.formAction || !data.formFields) {
      if (data.redirectUrl) router.push(data.redirectUrl);
      else toast.error("Payment is not available for this pathway yet.");
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

  async function requireSignedIn() {
    const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" });
    if (res.ok) return true;
    toast("Sign in to unlock this pathway.");
    router.push(`/auth/signin?returnTo=${encodeURIComponent(window.location.pathname)}`);
    return false;
  }

  async function payWithCash() {
    setPaying("cash");
    try {
      if (!(await requireSignedIn())) return;
      await ensureFreeAccess();
      const res = await fetch("/api/payments/course-unlock-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: paidSlugs }),
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
      if (!(await requireSignedIn())) return;
      await ensureFreeAccess();
      const res = await fetch("/api/courses/unlock-with-vowr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: paidSlugs }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "VOWR unlock failed.");
      paidSlugs.forEach(invalidateCourseEnrollmentCounts);
      wallet.refresh();
      toast.success(`${pathwayTitle} fully unlocked with ${pricing?.vowrPrice ?? ""} VOWR!`, {
        description: "Every course in this pathway is now open.",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setPaying(null);
    }
  }

  const founding = pricing?.items.some((i) => i.foundingActive) ?? false;

  return (
    <div className="overflow-hidden rounded-xl border-2 bg-white shadow-[0_18px_40px_rgba(6,17,31,0.14)]" style={{ borderColor: accentColor }}>
      <div className="flex items-center gap-2 px-6 py-3" style={{ backgroundColor: accentColor }}>
        <Layers aria-hidden="true" className="h-4 w-4 text-white" />
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-white">
          Buy this Career Path — {paidSlugs.length} courses bundled
        </p>
      </div>
      <div className="p-6">
        <p className="max-w-xl text-sm font-medium leading-6 text-ink">
          Unlock every module in all {paidSlugs.length} courses in the {pathwayTitle} pathway at once, with an extra bundle
          discount on top of each course&apos;s own price.
        </p>

        {founding ? (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-800">
            <Flame aria-hidden="true" className="h-3.5 w-3.5" />
            Includes Founding Learner pricing on eligible courses
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
          {pricing ? (
            <>
              <p className="text-3xl font-bold text-ink">{formatCurrency(pricing.totalZar)}</p>
              {pricing.subtotalZar > pricing.totalZar ? (
                <p className="text-sm font-medium text-muted line-through">{formatCurrency(pricing.subtotalZar)}</p>
              ) : null}
              {pricing.isBundle ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  {pricing.bundleDiscountPercent}% bundle discount applied
                </span>
              ) : null}
            </>
          ) : (
            <div className="h-8 w-40 animate-pulse rounded bg-slate-200" aria-hidden="true" />
          )}
        </div>
        {savingsZar > 0 && pricing ? (
          <p className="mt-1 text-xs font-medium text-emerald-700">
            You save {formatCurrency(pricing.subtotalZar - pricing.totalZar)} vs. buying each course separately at standard price
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={payWithCash}
            disabled={paying !== null || !pricing}
            className="flex-1 rounded-xl px-6 py-3 text-center text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830] disabled:cursor-wait disabled:opacity-60"
            style={{ backgroundColor: "#f5c542" }}
          >
            {paying === "cash" ? "Redirecting to PayFast..." : `Pay ${pricing ? formatCurrency(pricing.totalZar) : ""} via PayFast`}
          </button>
          <button
            type="button"
            onClick={payWithVowr}
            disabled={paying !== null || !pricing || !canAffordVowr}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            <Coins aria-hidden="true" className="h-4 w-4" />
            {paying === "vowr" ? "Unlocking..." : `Unlock with ${pricing?.vowrPrice ?? "..."} VOWR`}
          </button>
        </div>

        {pricing ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" />
            Save {pricing.vowrDiscountPercent}% paying with VOWR, stacked with the bundle discount
          </p>
        ) : null}
        {pricing && vowrBalance !== null && !canAffordVowr ? (
          <p className="mt-2 text-xs text-muted">
            You have {vowrBalance} VOWR — need {Math.max(0, pricing.vowrPrice - vowrBalance)} more, or pay by card above.
          </p>
        ) : null}

        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
          Secure checkout via PayFast. If you haven&apos;t started a course yet, its free first module is unlocked
          automatically as part of this purchase.
        </p>
      </div>
    </div>
  );
}
