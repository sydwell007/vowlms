"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThandiAvatar } from "@/components/thandi/ThandiAvatar";
import { openThandiPanel } from "@/lib/thandi/panel-store";
import { visualAssets } from "@/lib/visual-assets";

function useThandiListening() {
  const [listening, setListening] = useState(false);
  useEffect(() => {
    function handle(event: Event) {
      const detail = (event as CustomEvent<{ listening?: boolean }>).detail;
      setListening(Boolean(detail?.listening));
    }
    window.addEventListener("thandi:voice-state", handle);
    return () => window.removeEventListener("thandi:voice-state", handle);
  }, []);
  return listening;
}

/**
 * Thandi's entry in the GoalVow Ecosystem sidebar — desktop panel row
 * variant. Sits above the VowRewards/etc. service links, but opens Thandi's
 * panel directly instead of navigating anywhere.
 */
export function ThandiSidebarEntryDesktop() {
  const listening = useThandiListening();
  return (
    <button
      type="button"
      onClick={openThandiPanel}
      aria-label="Talk to Thandi"
      className="group flex items-start gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50"
    >
      <ThandiAvatar size={36} listening={listening} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[13px] font-semibold text-ink">Thandi</p>
          <span className="flex shrink-0 items-center gap-1">
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold leading-none text-emerald-700">
              {listening ? "Listening…" : "24/7"}
            </span>
          </span>
        </div>
        <p className="mt-0.5 text-[11px] leading-4 text-muted">Your AI tutor — ask me anything</p>
        <span className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
          <Image src={visualAssets.vowhumansLogo} alt="VowHumans" width={20} height={16} className="h-4 w-5 object-contain" />
          Powered by VowHumans
        </span>
      </div>
    </button>
  );
}

/** Mobile bottom-accordion grid-card variant. */
export function ThandiSidebarEntryMobile() {
  const listening = useThandiListening();
  return (
    <button
      type="button"
      onClick={openThandiPanel}
      aria-label="Talk to Thandi"
      className="flex items-center gap-2 rounded-lg border border-[#4aa3ff]/25 bg-gradient-to-br from-[#4aa3ff]/10 to-[#7c6bf5]/10 p-3 text-left transition hover:border-[#4aa3ff]/40"
    >
      <ThandiAvatar size={30} listening={listening} />
      <div>
        <p className="text-[12px] font-semibold text-ink">Thandi</p>
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
          {listening ? "Listening…" : "AI Tutor"}
        </span>
      </div>
    </button>
  );
}
