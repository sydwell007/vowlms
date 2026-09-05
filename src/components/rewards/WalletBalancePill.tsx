"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useWalletBalance } from "@/lib/rewards/useWalletBalance";
import { humanizeRewardEvent } from "@/lib/rewards/format";

type Props = {
  /** Renders as a compact icon+number pill for the always-visible mobile top bar. */
  compact?: boolean;
};

export function WalletBalancePill({ compact = false }: Props) {
  const wallet = useWalletBalance();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onOutsideClick);
    return () => document.removeEventListener("pointerdown", onOutsideClick);
  }, []);

  if (wallet.status !== "ready") return null;

  const balanceLabel = wallet.balance.toLocaleString();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`VOWR balance: ${balanceLabel}`}
        title={`${balanceLabel} VOWR`}
        className={`vowr-gradient-border flex items-center gap-1.5 rounded-full text-white transition hover:brightness-110 ${
          compact ? "h-9 px-2.5" : "h-10 px-3"
        }`}
      >
        <Image src="/images/vowrewards-logo.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0 rounded-full" />
        <span className="text-[13px] font-bold tabular-nums">{balanceLabel}</span>
        {!compact ? <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">VOWR</span> : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-xl border border-white/10 bg-[#0b1b2d] shadow-[0_22px_50px_rgba(0,0,0,0.34)]"
        >
          <div className="vowr-gradient-bg px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#06111f]/70">Your VOWR balance</p>
            <p className="mt-1 text-2xl font-bold text-[#06111f]">{balanceLabel} VOWR</p>
          </div>

          <div className="p-2">
            {wallet.recentEvents.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-white/50">
                No transactions yet — complete a lesson to earn your first VOWR.
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {wallet.recentEvents.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-xs">
                    <span className="truncate text-white/76">{humanizeRewardEvent(event.event)}</span>
                    <span className={`shrink-0 font-semibold tabular-nums ${event.points >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {event.points >= 0 ? "+" : ""}
                      {event.points}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-2">
            <Link
              href="/rewards#redeem"
              onClick={() => setOpen(false)}
              className="rounded-md bg-white/8 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-white/14"
            >
              Redeem
            </Link>
            <Link
              href="/rewards"
              onClick={() => setOpen(false)}
              className="vowr-gradient-bg rounded-md px-3 py-2 text-center text-xs font-semibold text-[#06111f] transition hover:brightness-105"
            >
              View Full Wallet
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
