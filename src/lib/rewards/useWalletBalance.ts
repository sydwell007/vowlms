"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type RewardEvent = {
  id: string;
  event: string;
  points: number;
  metadata?: string | null;
  created_at: string;
};

type WalletState =
  | { status: "loading" }
  | { status: "ready"; balance: number; recentEvents: RewardEvent[] }
  | { status: "signed-out" };

let cachedState: WalletState = { status: "loading" };
const listeners = new Set<(state: WalletState) => void>();

// Tracked once at module scope (not per-component) so a celebratory toast
// fires exactly once per real balance increase, even though the header
// mounts two WalletBalancePill instances at once (desktop + mobile-compact,
// with only one visible at a time via CSS breakpoints — both still mounted).
let lastKnownBalance: number | null = null;

function emit(state: WalletState) {
  cachedState = state;
  if (state.status === "ready") {
    if (lastKnownBalance !== null && state.balance > lastKnownBalance) {
      toast(`🎉 You just earned ${state.balance - lastKnownBalance} VOWR!`);
    }
    lastKnownBalance = state.balance;
  }
  for (const listener of listeners) listener(state);
}

// The header mounts two WalletBalancePill instances at once (desktop +
// mobile-compact, CSS toggles which is visible), so a naive refresh() would
// fire two simultaneous requests on every page load. Share one in-flight
// request across every concurrent caller instead.
let inFlight: Promise<void> | null = null;

function refreshBalance(): Promise<void> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const res = await fetch("/api/rewards/balance", { cache: "no-store" });
      if (res.status === 401) {
        emit({ status: "signed-out" });
        return;
      }
      const json = await res.json();
      if (!json.ok) {
        emit({ status: "signed-out" });
        return;
      }
      emit({ status: "ready", balance: json.data.balance, recentEvents: json.data.recentEvents ?? [] });
    } catch {
      emit({ status: "signed-out" });
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Shared VOWR balance store — one fetch feeds every mounted consumer (header
 * pill, wallet page hero) and revalidates on window focus so a redemption or
 * a freshly-completed lesson on another tab shows up without a hard refresh.
 */
export function useWalletBalance() {
  const [state, setState] = useState<WalletState>(cachedState);

  const refresh = useCallback(() => refreshBalance(), []);

  useEffect(() => {
    listeners.add(setState);
    refresh();

    window.addEventListener("focus", refresh);
    return () => {
      listeners.delete(setState);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  return { ...state, refresh };
}
