"use client";

import { useState } from "react";
import { Coins, X } from "lucide-react";
import type { useCourseUnlockPurchase } from "@/lib/courses/useCourseUnlockPurchase";
import { formatMoney } from "@/lib/format";

type Props = {
  unlock: ReturnType<typeof useCourseUnlockPurchase>;
  accentColor: string;
  compact?: boolean;
};

/**
 * The hybrid "pay part in VOWR, the rest in cash" checkout — distinct from
 * the existing all-VOWR-or-nothing toggle lower in PaymentGatewaySection.
 * Only offered for PayFast/Paystack today (the two gateways whose
 * verify/notify endpoints actually commit-or-release the reservation this
 * creates — see public/php/api/courses/unlock-reserve-vowr.php); PayPal and
 * Lemon Squeezy follow the identical server-side pattern but aren't wired to
 * it yet, so the toggle is hidden for those gateways rather than offering
 * something that can't actually complete.
 */
export function VowrRedemptionSlider({ unlock, accentColor, compact = false }: Props) {
  const { pricing, gateway, vowrBalance, reservation, reserving, reserveVowr, cancelReservation, paying } = unlock;
  const [open, setOpen] = useState(false);
  const [draftVowr, setDraftVowr] = useState(0);

  const supportsHybrid = gateway === "payfast" || gateway === "paystack";
  if (!supportsHybrid || !pricing || vowrBalance === null || vowrBalance <= 0) return null;

  const maxPercent = 12; // display estimate; the server clamps to the real per-bundle-size tier
  const maxVowrByPrice = Math.floor(pricing.totalZar * (maxPercent / 100) * 100); // vowrPerZar = 100
  const ceiling = Math.min(vowrBalance, maxVowrByPrice);

  if (ceiling <= 0) return null;

  if (reservation) {
    return (
      <div
        className={`${compact ? "mb-2 p-2.5" : "mb-3 p-3"} flex items-center justify-between gap-2 rounded-lg border`}
        style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}0d` }}
      >
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-bold" style={{ color: accentColor }}>
            <Coins aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {reservation.vowrAmount.toLocaleString()} VOWR applied
          </p>
          <p className="mt-0.5 text-[11px] text-ink/60">
            Saves {formatMoney(reservation.vowrValueZar, "ZAR")} — pay {formatMoney(reservation.cashAmountZar, "ZAR")} to finish.
          </p>
        </div>
        <button
          type="button"
          onClick={cancelReservation}
          disabled={paying !== null}
          className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-ink/70 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <X aria-hidden="true" className="h-3 w-3" /> Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraftVowr(ceiling);
          setOpen(true);
        }}
        disabled={paying !== null}
        className={`${compact ? "mb-2" : "mb-3"} flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-xs font-semibold transition hover:bg-slate-50 disabled:opacity-50`}
        style={{ borderColor: `${accentColor}60`, color: accentColor }}
      >
        <Coins aria-hidden="true" className="h-3.5 w-3.5" />
        Use VOWR to save up to {maxPercent}% on this course
      </button>
    );
  }

  const vowrValueZar = Math.round((draftVowr / 100) * 100) / 100; // vowrPerZar = 100
  const cashRemainderZar = Math.max(0, Math.round((pricing.totalZar - vowrValueZar) * 100) / 100);

  return (
    <div className={`${compact ? "mb-2 p-2.5" : "mb-3 p-3"} rounded-lg border`} style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}0d` }}>
      <div className="flex items-center justify-between">
        <label htmlFor="vowr-redemption-range" className="text-xs font-bold" style={{ color: accentColor }}>
          Redeem VOWR toward this course
        </label>
        <button type="button" onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink/70" aria-label="Close VOWR redemption">
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>

      <input
        id="vowr-redemption-range"
        type="range"
        min={0}
        max={ceiling}
        step={1}
        value={draftVowr}
        onChange={(e) => setDraftVowr(Number(e.target.value))}
        className="mt-2 w-full accent-current"
        style={{ color: accentColor }}
      />

      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={ceiling}
          value={draftVowr}
          onChange={(e) => setDraftVowr(Math.max(0, Math.min(ceiling, Number(e.target.value) || 0)))}
          className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm font-semibold text-ink"
          aria-label="VOWR amount to redeem"
        />
        <span className="text-xs text-ink/60">of {ceiling.toLocaleString()} VOWR max</span>
        <button type="button" onClick={() => setDraftVowr(ceiling)} className="ml-auto text-xs font-semibold underline" style={{ color: accentColor }}>
          Use maximum
        </button>
      </div>

      <p className="mt-2 text-xs text-ink/70" aria-live="polite">
        {draftVowr > 0 ? (
          <>
            Saves <span className="font-semibold">{formatMoney(vowrValueZar, "ZAR")}</span> — you&apos;ll pay{" "}
            <span className="font-semibold">{formatMoney(cashRemainderZar, "ZAR")}</span> by card.
          </>
        ) : (
          "Move the slider to redeem VOWR toward this course."
        )}
      </p>

      <button
        type="button"
        onClick={() => reserveVowr(draftVowr, gateway!)}
        disabled={reserving || draftVowr <= 0}
        className="mt-2 w-full rounded-lg px-4 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {reserving ? "Applying…" : `Apply ${draftVowr.toLocaleString()} VOWR`}
      </button>
    </div>
  );
}
