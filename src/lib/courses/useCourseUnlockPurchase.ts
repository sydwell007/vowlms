"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CourseModule } from "@/types/lms";
import { useSession } from "@/lib/auth/useSession";
import { useWalletBalance } from "@/lib/rewards/useWalletBalance";
import { invalidateCourseEnrollmentCounts } from "@/lib/course-enrollment-counts-client";
import { getCachedUnlockState, setCachedUnlockState, subscribeUnlockState } from "@/lib/courses/unlockStateStore";
import { redirectToPayment } from "@/lib/payments/redirectToPayment";

export type UnlockPriceResponse = {
  items: { parentSlug: string; standardPriceZar: number; priceZar: number; foundingActive: boolean; foundingSlotsLeft: number }[];
  subtotalZar: number;
  isBundle: boolean;
  bundleDiscountPercent: number;
  totalZar: number;
  vowrDiscountPercent: number;
  vowrPrice: number;
};

export type VowrReservation = {
  reservationId: string;
  parentSlugs: string[];
  totalZar: number;
  vowrAmount: number;
  vowrValueZar: number;
  cashAmountZar: number;
  maxVowr: number;
  maxPercent: number;
  expiresInMinutes: number;
  balance: number;
};

type Enrollment = { courseSlug?: string; course_slug?: string; groupSlug?: string | null; status?: string };

export type UnlockState = "loading" | "not-enrolled" | "free-only" | "unlocked";

export type InternationalGateway = "payfast" | "paystack" | "paypal" | "lemonsqueezy";

type InternationalPriceResponse = {
  zar: UnlockPriceResponse;
  gateway: InternationalGateway;
  currency: string;
  countryCode: string;
  amountCharged: number | null;
  exchangeRate: number | null;
  conversionAvailable: boolean;
};

const loadedScripts = new Set<string>();
function loadScriptOnce(src: string): Promise<void> {
  if (loadedScripts.has(src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

declare global {
  interface Window {
    PaystackPop?: {
      setup(config: Record<string, unknown>): { openIframe(): void };
    };
    LemonSqueezy?: {
      Setup(config: { eventHandler: (event: { event: string }) => void }): void;
      Url: { Open(url: string): void; Close?: () => void };
    };
    // lemon.js only auto-creates window.LemonSqueezy on the browser's own
    // `load` event, which has already fired long before we lazily inject
    // this script on click — createLemonSqueezy() must be called explicitly
    // instead of relying on that listener.
    createLemonSqueezy?: () => void;
  }
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
  // Module 0 (order 0) is synthetic native-content orientation, not a real
  // Moodle-migrated child course — it never gets its own `enrollments` row,
  // so it must be excluded here. Counting it would make "every real module
  // enrolled" mathematically unreachable, permanently stuck on "free-only"
  // even for an account that has genuinely paid for everything.
  const totalModules = modules.filter((m) => m.order > 0).length;

  const [state, setState] = useState<UnlockState>(() => getCachedUnlockState(parentSlug)?.state ?? "loading");
  const [pricing, setPricing] = useState<UnlockPriceResponse | null>(null);
  const [pricingUnavailable, setPricingUnavailable] = useState(false);
  const [paying, setPaying] = useState<"cash" | "vowr" | "paystack" | "paypal" | "lemonsqueezy" | null>(null);
  const [gateway, setGateway] = useState<InternationalGateway | null>(null);
  const [gatewayOverride, setGatewayOverride] = useState<InternationalGateway | null>(null);
  const [currency, setCurrency] = useState("ZAR");
  const [amountCharged, setAmountCharged] = useState<number | null>(null);
  const [conversionAvailable, setConversionAvailable] = useState(true);
  const [reservation, setReservation] = useState<VowrReservation | null>(null);
  const [reserving, setReserving] = useState(false);
  // True only for the extended poll right after landing back from PayFast/
  // Lemon Squeezy's hosted checkout (?payment=success) — lets the UI show a
  // neutral "confirming your payment" state instead of flashing the full
  // pay-again card while the webhook that actually grants access is still
  // in flight.
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const wallet = useWalletBalance(session.status === "authenticated");

  // Stay in sync with any OTHER mounted card/panel for the same course —
  // e.g. a VOWR unlock completed on the course page must be reflected
  // immediately on the lesson page's own unlock panel, not just after its
  // own (possibly stale) network fetch catches up.
  useEffect(() => {
    return subscribeUnlockState(parentSlug, (entry) => setState(entry.state));
  }, [parentSlug]);

  useEffect(() => {
    if (!isPaidCourse) return;
    if (session.status !== "authenticated") return;

    // Already known-unlocked from the shared cache (this session already
    // completed a real purchase) — trust it outright rather than re-asking a
    // backend that can occasionally still read stale for a few seconds.
    if (getCachedUnlockState(parentSlug)?.state === "unlocked") return;

    const controller = new AbortController();
    let cancelled = false;

    // A learner landing back here with ?payment=success just came straight
    // from PayFast/Lemon Squeezy's hosted checkout — the actual grant is a
    // webhook (PayFast's ITN, Lemon Squeezy's webhook) that can genuinely
    // take several seconds to arrive server-side, well past the short
    // window below that's tuned for an ordinary page load. Give it much
    // longer here specifically, and keep the UI on "loading" (never a
    // misleading "still locked") for that whole window rather than only the
    // normal quick check — cleared from the URL once handled so a refresh
    // doesn't keep re-triggering the long poll.
    const returningFromPayment = typeof window !== "undefined" && new URL(window.location.href).searchParams.get("payment") === "success";
    if (returningFromPayment) {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      router.replace(`${url.pathname}${url.search}`, { scroll: false });
    }

    async function checkEnrollment() {
      if (returningFromPayment) await Promise.resolve().then(() => setConfirmingPayment(true));
      const delays = returningFromPayment ? [0, 1500, 2500, 3500, 4500, 5500, 6500] : [0, 700, 1200];
      for (const delayMs of delays) {
        if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
        if (cancelled) return;

        const res = await fetch("/api/enrollments", { cache: "no-store", credentials: "same-origin", signal: controller.signal }).catch(() => null);
        const payload = res?.ok ? await res.json().catch(() => null) : null;
        if (!payload) continue;

        const enrollments = (payload.data ?? []) as Enrollment[];
        const enrolledCount = enrollments.filter(
          (item) =>
            ((item.courseSlug ?? item.course_slug) === parentSlug || item.groupSlug === parentSlug) &&
            item.status !== "cancelled",
        ).length;

        const next: UnlockState = enrolledCount === 0 ? "not-enrolled" : enrolledCount >= totalModules ? "unlocked" : "free-only";
        if (cancelled) return;

        if (next === "unlocked") {
          setCachedUnlockState(parentSlug, { state: next, totalModules });
          invalidateCourseEnrollmentCounts(parentSlug);
          if (returningFromPayment) {
            setConfirmingPayment(false);
            toast.success("Payment confirmed!", { description: "Every module is now open." });
          }
          return;
        }

        // Mid-poll after a payment return: don't write a "still locked"
        // state that would flash on screen while the webhook is still in
        // flight — only the final attempt's result is allowed through.
        const isLastAttempt = delayMs === delays[delays.length - 1];
        if (!returningFromPayment || isLastAttempt) setCachedUnlockState(parentSlug, { state: next, totalModules });
      }
      // Falls through here both when every attempt's fetch failed outright
      // and when the last attempt succeeded but still wasn't "unlocked" —
      // either way the extended window is over, so stop showing "confirming".
      if (returningFromPayment) setConfirmingPayment(false);
    }

    checkEnrollment();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [parentSlug, isPaidCourse, session.status, totalModules, router]);

  useEffect(() => {
    if (!isPaidCourse) return;
    const controller = new AbortController();
    let cancelled = false;
    let attempt = 0;

    async function loadPricing() {
      if (!cancelled) setPricingUnavailable(false);
      while (!cancelled && attempt < 3) {
        try {
          const url = `/api/courses/unlock-price-international?slugs=${encodeURIComponent(parentSlug)}${gatewayOverride ? `&gateway=${gatewayOverride}` : ""}`;
          const res = await fetch(url, { signal: controller.signal });
          const payload = await res.json().catch(() => null);
          if (res.ok && payload?.ok) {
            const data = payload.data as InternationalPriceResponse;
            if (!cancelled) {
              setPricing(data.zar);
              setGateway(data.gateway);
              setCurrency(data.currency);
              setAmountCharged(data.amountCharged);
              setConversionAvailable(data.conversionAvailable);
            }
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
  }, [parentSlug, isPaidCourse, gatewayOverride]);

  const vowrBalance = wallet.status === "ready" ? wallet.balance : null;
  const canAffordVowr = pricing !== null && vowrBalance !== null && vowrBalance >= pricing.vowrPrice;
  const savingsZar = pricing ? pricing.items.reduce((sum, i) => sum + (i.standardPriceZar - i.priceZar), 0) : 0;

  async function payWithCash() {
    if (state === "unlocked") return;
    setPaying("cash");
    try {
      const res = await fetch("/api/payments/course-unlock-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [parentSlug], reservationId: reservation?.reservationId }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "Payment could not be started.");
      redirectToPayment(payload.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      setPaying(null);
    }
  }

  /**
   * Reserves part of the learner's real VOWR balance against this course's
   * price (max 12% by default, less for larger bundles — see
   * public/php/lib/vowr_config.php) and returns the exact remaining cash
   * amount to charge. Debits the VOWR immediately (server-side, real
   * balance check) so it can't be spent twice while the matching cash
   * payment is in flight; call cancelReservation() to give it back before
   * paying, or just let the checkout complete via payWithCash/payWithPaystack
   * which now automatically charge the reservation's remainder instead of
   * the full price.
   */
  async function reserveVowr(vowrAmount: number, forGateway: InternationalGateway): Promise<VowrReservation | null> {
    setReserving(true);
    try {
      const res = await fetch("/api/courses/unlock-reserve-vowr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [parentSlug], vowrAmount, gateway: forGateway }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "Could not reserve VOWR for this purchase.");
      const data = payload.data as VowrReservation;
      setReservation(data);
      wallet.refresh();
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      return null;
    } finally {
      setReserving(false);
    }
  }

  /** Gives back a reservation's held VOWR before its cash leg is paid — the checkout UI's "Remove VOWR" action. */
  async function cancelReservation() {
    if (!reservation) return;
    const reservationId = reservation.reservationId;
    setReservation(null);
    try {
      await fetch("/api/courses/unlock-cancel-vowr-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ reservationId }),
      });
    } finally {
      wallet.refresh();
    }
  }

  async function payWithVowr() {
    if (state === "unlocked") return;
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
      setCachedUnlockState(parentSlug, { state: "unlocked", totalModules });
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

  async function payWithPaystack() {
    if (state === "unlocked") return;
    if (amountCharged === null || !conversionAvailable) {
      toast.error("Pricing is temporarily unavailable. Please try again shortly.");
      return;
    }
    setPaying("paystack");
    try {
      await loadScriptOnce("https://js.paystack.co/v1/inline.js");
      const configRes = await fetch("/api/payments/gateway-config");
      const configPayload = await configRes.json();
      const publicKey = configPayload?.data?.paystackPublicKey;
      if (!publicKey) throw new Error("Paystack is not configured.");
      if (!window.PaystackPop) throw new Error("Paystack could not be loaded.");

      const email = session.status === "authenticated" ? session.user.email : "";
      const userId = session.status === "authenticated" ? session.user.id : "";

      // A hybrid partial-VOWR reservation only owes its own cash remainder —
      // estimate that remainder in this gateway's currency using the same
      // ZAR→currency ratio already shown for the full price (both come from
      // the same cached exchange rate, stable for hours); the bridge
      // re-verifies the real converted amount server-side at capture time
      // regardless, so this is a display/charge estimate, never the source
      // of truth for what's actually granted.
      const displayAmount =
        reservation && pricing && pricing.totalZar > 0
          ? Math.round(((reservation.cashAmountZar / pricing.totalZar) * amountCharged) * 100) / 100
          : amountCharged;

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: Math.round(displayAmount * 100),
        currency,
        metadata: { user_id: userId, parent_slugs: [parentSlug], reservation_id: reservation?.reservationId },
        callback: (response: { reference: string }) => {
          void verifyPaystackReference(response.reference);
        },
        onClose: () => setPaying((current) => (current === "paystack" ? null : current)),
      });
      handler.openIframe();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      setPaying(null);
    }
  }

  async function verifyPaystackReference(reference: string) {
    const reservationId = reservation?.reservationId;
    try {
      const res = await fetch("/api/payments/paystack-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ reference, parentSlugs: [parentSlug], reservationId }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "Payment verification failed.");
      setCachedUnlockState(parentSlug, { state: "unlocked", totalModules });
      invalidateCourseEnrollmentCounts(parentSlug);
      setReservation(null);
      wallet.refresh();
      const vowrRedeemed = (payload.data?.vowrRedeemed as number) || 0;
      toast.success("Course fully unlocked!", {
        description: vowrRedeemed > 0 ? `${vowrRedeemed} VOWR redeemed, plus your card payment.` : "Every module is now open.",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      // A verification failure almost always means the bridge already
      // released the reservation server-side (see paystack-verify-
      // transaction.php's failure branch) — clear it here too so the
      // checkout UI doesn't keep showing VOWR as held against a dead attempt.
      if (reservationId) {
        setReservation(null);
        wallet.refresh();
      }
    } finally {
      setPaying(null);
    }
  }

  /**
   * A plain full-page redirect to PayPal's own hosted approve page —
   * deliberately not the JS SDK's popup Buttons() flow, which opened two
   * separate windows (an internal about:blank bridge popup plus PayPal's
   * real login popup) and could tear the whole flow down if the blank one
   * was closed first. This matches PayFast/Lemon Squeezy's own redirect
   * pattern exactly. PayPal redirects back to `return_url` (set server-side
   * in paypal-create-order.php) with its own `?token={orderId}` appended —
   * the effect below picks that up and completes the capture automatically.
   */
  async function payWithPaypal() {
    if (state === "unlocked") return;
    setPaying("paypal");
    try {
      const res = await fetch("/api/payments/paypal-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [parentSlug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok || !payload.data?.approveUrl) throw new Error(payload.error ?? "Could not start PayPal checkout.");
      window.location.href = payload.data.approveUrl as string;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      setPaying(null);
    }
  }

  async function capturePayPalOrder(orderId: string) {
    if (state === "unlocked") return;
    setPaying("paypal");
    try {
      const res = await fetch("/api/payments/paypal-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ orderId, parentSlugs: [parentSlug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "PayPal payment could not be confirmed.");
      setCachedUnlockState(parentSlug, { state: "unlocked", totalModules });
      invalidateCourseEnrollmentCounts(parentSlug);
      toast.success("Course fully unlocked!", { description: "Every module is now open." });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setPaying(null);
    }
  }

  /**
   * Lemon Squeezy's own overlay SDK (lemon.js) opens their checkout as an
   * in-page modal instead of a full redirect — unlike PayFast, Lemon
   * Squeezy explicitly supports and controls this embed themselves (it's
   * their own iframe, not a raw third-party embed attempt), so the VowLMS
   * header/page stay visible behind it. Actual unlocking still happens
   * server-side in lemonsqueezy-webhook.php once Lemon Squeezy confirms
   * payment — the Checkout.Success event here is just a UX signal to poll
   * for that shortly after, the same tolerance-for-async-confirmation
   * pattern PayFast's ITN already relies on.
   */
  async function payWithLemonSqueezy() {
    if (state === "unlocked") return;
    setPaying("lemonsqueezy");
    try {
      const res = await fetch("/api/payments/lemonsqueezy-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ parentSlugs: [parentSlug] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? "Could not start Lemon Squeezy checkout.");
      const checkoutUrl = payload.data.checkoutUrl as string;

      await loadScriptOnce("https://assets.lemonsqueezy.com/lemon.js");
      // Their SDK only wires itself up automatically via a `load` event
      // listener registered at script-parse time — since we're injecting
      // it well after the page's own load event already fired, that
      // listener never runs, so window.LemonSqueezy is never created
      // unless we call their init function ourselves.
      if (!window.LemonSqueezy) window.createLemonSqueezy?.();
      if (!window.LemonSqueezy) throw new Error("Lemon Squeezy could not be loaded.");

      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event.event !== "Checkout.Success") return;
          toast.success("Payment received!", { description: "Confirming your unlock…" });
          void pollForUnlockAfterOverlayCheckout();
        },
      });
      window.LemonSqueezy.Url.Open(checkoutUrl);
      setPaying(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      setPaying(null);
    }
  }

  /** Same tolerance window as the free-only enrollment check above, reused after an in-overlay Lemon Squeezy success signal. */
  async function pollForUnlockAfterOverlayCheckout() {
    setConfirmingPayment(true);
    const delays = [1000, 2000, 3000, 4000];
    for (const delayMs of delays) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      const res = await fetch("/api/enrollments", { cache: "no-store", credentials: "same-origin" }).catch(() => null);
      const payload = res?.ok ? await res.json().catch(() => null) : null;
      if (!payload) continue;

      const enrollments = (payload.data ?? []) as Enrollment[];
      const enrolledCount = enrollments.filter(
        (item) => ((item.courseSlug ?? item.course_slug) === parentSlug || item.groupSlug === parentSlug) && item.status !== "cancelled",
      ).length;

      if (enrolledCount >= totalModules) {
        setCachedUnlockState(parentSlug, { state: "unlocked", totalModules });
        invalidateCourseEnrollmentCounts(parentSlug);
        setConfirmingPayment(false);
        toast.success("Course fully unlocked!", { description: "Every module is now open." });
        return;
      }
    }
    setConfirmingPayment(false);
  }

  // Picks up the return from PayPal's hosted approve page (`?paypalReturn=1
  // &token={orderId}&PayerID=...`, appended by PayPal itself on top of the
  // return_url set in paypal-create-order.php) and finishes the purchase
  // automatically, the same way Lemon Squeezy's redirect-back relies on
  // this component being mounted again on return — except PayPal's capture
  // step is a direct client call rather than only a webhook, so this fires
  // it immediately instead of waiting on enrollment polling to catch up.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("paypalReturn") !== "1") return;
    const orderId = url.searchParams.get("token");
    if (!orderId) return;

    url.searchParams.delete("paypalReturn");
    url.searchParams.delete("token");
    url.searchParams.delete("PayerID");
    router.replace(`${url.pathname}${url.search}`, { scroll: false });

    // Deferred a tick so capturePayPalOrder's own setPaying(...) call isn't
    // fired synchronously from within this effect's body.
    void Promise.resolve().then(() => capturePayPalOrder(orderId));
    // Only ever run once, right after mount, off the URL this page loaded
    // with — capturePayPalOrder/router are stable enough in practice and
    // re-running this on their identity changing would risk a duplicate
    // capture attempt (harmless server-side since it's idempotent, but
    // pointless).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isPaidCourse,
    totalModules,
    state,
    confirmingPayment,
    pricing,
    pricingUnavailable,
    paying,
    vowrBalance,
    canAffordVowr,
    savingsZar,
    gateway: gatewayOverride ?? gateway,
    detectedGateway: gateway,
    setGatewayOverride,
    currency,
    amountCharged,
    conversionAvailable,
    reservation,
    reserving,
    reserveVowr,
    cancelReservation,
    payWithCash,
    payWithVowr,
    payWithPaystack,
    payWithPaypal,
    capturePayPalOrder,
    payWithLemonSqueezy,
  };
}
