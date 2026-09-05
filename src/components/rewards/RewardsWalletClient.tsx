"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useWalletBalance, type RewardEvent } from "@/lib/rewards/useWalletBalance";
import { useCountUp } from "@/lib/rewards/useCountUp";
import { humanizeRewardEvent } from "@/lib/rewards/format";

const WALLET_PORTAL_URL = "https://wallet.vowrewards.co.za";

type RequestRedemptionType =
  | "course_credit"
  | "data_bundle"
  | "electricity_token"
  | "mentorship_session"
  | "assessment_retake_waiver"
  | "vr_practice_credit";

type CatalogItem = {
  type: RequestRedemptionType;
  name: string;
  description: string;
  cost: number;
  fulfilmentNote?: string;
};

const REQUEST_CATALOG: CatalogItem[] = [
  {
    type: "course_credit",
    name: "Course enrolment credit",
    description: "Apply toward the cost of your next paid course enrolment.",
    cost: 500,
  },
  {
    type: "mentorship_session",
    name: "1:1 mentorship session",
    description: "A 30-minute session with a GoalVow facilitator.",
    cost: 250,
  },
  {
    type: "assessment_retake_waiver",
    name: "Assessment retake waiver",
    description: "Unlock another attempt on a failed assessment.",
    cost: 50,
  },
  {
    type: "vr_practice_credit",
    name: "VR practice session credit",
    description: "One additional guided VR Practice scenario run.",
    cost: 100,
  },
  {
    type: "data_bundle",
    name: "Mobile data bundle",
    description: "Redeem VOWR for mobile data to keep learning.",
    cost: 300,
    fulfilmentNote: "Real-world fulfilment depends on a South African data-aggregator partner that is not yet connected — requests are logged, not auto-fulfilled.",
  },
  {
    type: "electricity_token",
    name: "Electricity token",
    description: "Redeem VOWR toward a prepaid electricity token.",
    cost: 400,
    fulfilmentNote: "Real-world fulfilment depends on a South African electricity-aggregator partner that is not yet connected — requests are logged, not auto-fulfilled.",
  },
];

const WAYS_TO_EARN = [
  { event: "Course enrolment", amount: 50, description: "Recorded when you enrol in a course." },
  { event: "First lesson completion", amount: 5, description: "Recorded once when an enrolled learner first completes an eligible lesson." },
  { event: "First assessment pass", amount: 100, description: "Recorded once for the first passing attempt on an eligible assessment." },
  { event: "Certificate issued", amount: 200, description: "Recorded when an eligible course certificate is first issued to the learner." },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export function RewardsWalletClient() {
  const wallet = useWalletBalance();
  const displayBalance = useCountUp(wallet.status === "ready" ? wallet.balance : 0);

  const [historyFilter, setHistoryFilter] = useState<"all" | "earned" | "redeemed">("all");
  const [history, setHistory] = useState<{ events: RewardEvent[]; page: number; hasMore: boolean } | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [pendingType, setPendingType] = useState<RequestRedemptionType | null>(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateEmail, setDonateEmail] = useState("");
  const [donateAmount, setDonateAmount] = useState(50);
  const [donateSubmitting, setDonateSubmitting] = useState(false);

  async function loadHistory(filter: typeof historyFilter, page: number) {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/rewards/history?filter=${filter}&page=${page}&limit=10`, { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setHistory({ events: json.data.events ?? [], page: json.data.page ?? 1, hasMore: Boolean(json.data.hasMore) });
      }
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    // Deferred to a microtask so the initial setHistoryLoading(true) inside
    // loadHistory isn't a synchronous setState call within the effect body
    // (matches the pattern already used in EcosystemSidebar.tsx).
    Promise.resolve().then(() => {
      if (!cancelled) loadHistory(historyFilter, 1);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyFilter]);

  async function submitRequestRedemption(item: CatalogItem) {
    if (wallet.status !== "ready" || wallet.balance < item.cost) {
      toast(`You need ${item.cost} VOWR to redeem ${item.name}.`);
      return;
    }
    setPendingType(item.type);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redemptionType: item.type }),
      });
      const json = await res.json();
      if (!json.ok) {
        toast(json.error ?? "Redemption could not be submitted.");
        return;
      }
      toast(json.data.message ?? "Request submitted — reviewed within 24 hours.");
      wallet.refresh();
      loadHistory(historyFilter, 1);
    } catch {
      toast("Redemption could not be submitted.");
    } finally {
      setPendingType(null);
    }
  }

  async function submitDonation() {
    if (!donateEmail.trim()) {
      toast("Enter the learner's email to donate to.");
      return;
    }
    if (wallet.status !== "ready" || wallet.balance < donateAmount) {
      toast(`You need ${donateAmount} VOWR to send this donation.`);
      return;
    }
    setDonateSubmitting(true);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redemptionType: "donate_to_learner", recipientEmail: donateEmail.trim(), amount: donateAmount }),
      });
      const json = await res.json();
      if (!json.ok) {
        toast(json.error ?? "Donation could not be completed.");
        return;
      }
      toast(`Sent ${donateAmount} VOWR to ${json.data.recipientName ?? "the learner"}.`);
      setDonateOpen(false);
      setDonateEmail("");
      wallet.refresh();
      loadHistory(historyFilter, 1);
    } catch {
      toast("Donation could not be completed.");
    } finally {
      setDonateSubmitting(false);
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="premium-section-dark surface-grid py-16 text-white md:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">VowRewards</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">Your VOWR wallet</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
            Every eligible learning milestone earns real, server-recorded VOWR. Track your balance, see exactly how you earned it, and redeem it here.
          </p>

          <div className="vowr-gradient-border mt-8 flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Current balance</p>
              {wallet.status === "loading" ? (
                <div className="mt-2 h-12 w-40 animate-pulse rounded-lg bg-white/10" />
              ) : wallet.status === "signed-out" ? (
                <p className="mt-2 text-lg font-semibold text-white/80">Sign in to see your VOWR balance.</p>
              ) : (
                <p className="vowr-gradient-text mt-1 text-5xl font-bold tabular-nums">{displayBalance.toLocaleString()} VOWR</p>
              )}
              {wallet.status === "ready" && wallet.balance === 0 ? (
                <p className="mt-2 text-sm text-white/60">
                  You haven&apos;t earned VOWR yet — complete your first lesson to get started.
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {wallet.status !== "ready" ? (
                <ButtonLink href="/auth/signin">Sign in</ButtonLink>
              ) : (
                <>
                  <Link href="#redeem" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                    Redeem VOWR
                  </Link>
                  <Link href="#history" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">
                    View history
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Ways to earn */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Ways to earn</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Real milestones, real VOWR</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS_TO_EARN.map((reward) => (
              <article key={reward.event} className="premium-card rounded-lg p-6">
                <p className="text-3xl font-semibold text-[#1166c8]">{reward.amount} VOWR</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{reward.event}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{reward.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction history */}
      <section id="history" className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Transaction history</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Every VOWR event on your account</h2>
            </div>
            <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
              {(["all", "earned", "redeemed"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setHistoryFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    historyFilter === f ? "bg-[#06111f] text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {wallet.status === "signed-out" ? (
              <p className="p-8 text-center text-sm text-muted">Sign in to see your VOWR transaction history.</p>
            ) : historyLoading ? (
              <div className="flex flex-col gap-2 p-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-md bg-slate-100" />)}
              </div>
            ) : !history || history.events.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted">No transactions in this filter yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {history.events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{humanizeRewardEvent(event.event)}</p>
                      <p className="text-xs text-muted">{formatDate(event.created_at)}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-bold tabular-nums ${event.points >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {event.points >= 0 ? "+" : ""}
                      {event.points} VOWR
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {history && history.page > 1 ? (
            <button
              type="button"
              onClick={() => loadHistory(historyFilter, history.page - 1)}
              className="mt-4 text-sm font-semibold text-[#1166c8] hover:underline"
            >
              ← Newer
            </button>
          ) : null}
          {history?.hasMore ? (
            <button
              type="button"
              onClick={() => loadHistory(historyFilter, history.page + 1)}
              className="mt-4 ml-4 text-sm font-semibold text-[#1166c8] hover:underline"
            >
              Older →
            </button>
          ) : null}
        </div>
      </section>

      {/* Redemption catalog */}
      <section id="redeem" className="bg-white py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Redeem</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Spend your VOWR</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Every redemption below is submitted as a request and reviewed within 24 hours — nothing is auto-fulfilled yet.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REQUEST_CATALOG.map((item) => {
              const affordable = wallet.status === "ready" && wallet.balance >= item.cost;
              return (
                <article key={item.type} className="premium-card flex flex-col rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.description}</p>
                  {item.fulfilmentNote ? (
                    <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700">{item.fulfilmentNote}</p>
                  ) : null}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1166c8]">{item.cost} VOWR</span>
                    <button
                      type="button"
                      disabled={!affordable || pendingType === item.type}
                      onClick={() => submitRequestRedemption(item)}
                      className="rounded-md bg-[#06111f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#10243a] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {pendingType === item.type ? "Submitting..." : affordable ? "Redeem" : "Not enough VOWR"}
                    </button>
                  </div>
                </article>
              );
            })}

            {/* Donate to another learner — instant peer-to-peer transfer, no fulfilment step */}
            <article className="premium-card flex flex-col rounded-lg p-6">
              <h3 className="text-lg font-semibold text-ink">Donate to another learner</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">Send VOWR straight to a fellow learner&apos;s balance — resolves instantly.</p>
              {donateOpen ? (
                <div className="mt-3 flex flex-col gap-2">
                  <input
                    type="email"
                    value={donateEmail}
                    onChange={(e) => setDonateEmail(e.target.value)}
                    placeholder="learner@email.com"
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1166c8]"
                  />
                  <input
                    type="number"
                    min={10}
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(Math.max(10, Number(e.target.value) || 10))}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1166c8]"
                  />
                  <button
                    type="button"
                    disabled={donateSubmitting}
                    onClick={submitDonation}
                    className="rounded-md bg-[#06111f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#10243a] disabled:opacity-40"
                  >
                    {donateSubmitting ? "Sending..." : `Send ${donateAmount} VOWR`}
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1166c8]">You choose the amount</span>
                  <button
                    type="button"
                    onClick={() => setDonateOpen(true)}
                    disabled={wallet.status !== "ready" || wallet.balance < 10}
                    className="rounded-md bg-[#06111f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#10243a] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Donate
                  </button>
                </div>
              )}
            </article>

            {/* SkillsShop — honest coming-soon state, no fake capture */}
            <article className="flex flex-col rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 opacity-80">
              <h3 className="text-lg font-semibold text-ink">SkillsShop credit</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">Learning kits, trade tools, and kitchen equipment redeemable with VOWR.</p>
              <span className="mt-4 inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Coming soon</span>
            </article>
          </div>
        </div>
      </section>

      {/* Ecosystem cross-link — honest, no in-app Web3 */}
      <section className="premium-section-dark py-14 text-white">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <h2 className="text-2xl font-semibold">This is your VowLMS learning-rewards balance</h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            VOWR earned here lives in VowLMS. To manage on-chain VOWR, staking, and cashout, connect a real wallet on the VowRewards Wallet Portal.
          </p>
          <a
            href={WALLET_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="vowr-gradient-bg mt-8 inline-flex min-h-11 items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[#06111f] transition hover:brightness-105"
          >
            Open Wallet Portal →
          </a>
        </div>
      </section>
    </main>
  );
}
