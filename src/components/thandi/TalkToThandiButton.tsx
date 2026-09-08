"use client";

import type { ReactNode } from "react";
import { openThandiPanel } from "@/lib/thandi/panel-store";

/**
 * Opens Thandi's real, live panel directly from marketing surfaces like the
 * homepage — not just a link to a page about her. Mirrors ButtonLink's own
 * className shape so it sits naturally next to real ButtonLinks, using
 * Thandi's own blue → purple → gold identity (matches ThandiAvatar.tsx)
 * rather than VowLMS's navy/gold or VOWR's gold/blue, so all three stay
 * visually distinct.
 */
export function TalkToThandiButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={openThandiPanel}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(74,163,255,0.25)] transition duration-200 hover:brightness-110 ${className}`}
      style={{ background: "linear-gradient(135deg, #4aa3ff 0%, #7c6bf5 55%, #f7d05e 100%)" }}
    >
      {children}
    </button>
  );
}
