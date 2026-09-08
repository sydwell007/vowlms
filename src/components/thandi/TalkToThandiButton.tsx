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
      className={`inline-flex min-h-11 items-center justify-center rounded-md border border-[#5ed8dc]/45 bg-[#176f78] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(23,111,120,0.24)] transition duration-200 hover:bg-[#21848c] ${className}`}
    >
      {children}
    </button>
  );
}
