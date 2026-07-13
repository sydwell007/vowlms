"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { ComingSoonInfo } from "@/lib/academy-launch";

type Props = {
  info: ComingSoonInfo | null;
  children: ReactNode;
  className?: string;
  /** Must match the wrapped card's own border radius so the glass layer lines up. */
  radiusClassName?: string;
  tone?: "light" | "dark";
};

/**
 * Wraps a card (or any link/button) so it stays fully visible "behind glass"
 * but is not interactive, with a corner ribbon showing the launch date.
 *
 * When `info` is null this is a transparent pass-through — nothing is
 * rendered but `children` — so an academy/course goes live automatically the
 * moment its launch date passes, with zero changes to the wrapped markup.
 */
export function ComingSoonOverlay({ info, children, className = "", radiusClassName = "rounded-xl", tone = "light" }: Props) {
  if (!info) return <>{children}</>;

  function block(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      className={`relative isolate h-full ${className}`}
      aria-disabled="true"
      onClickCapture={block}
      onKeyDownCapture={(e) => {
        if (e.key === "Enter" || e.key === " ") block(e);
      }}
    >
      {children}

      {/* Frosted "behind glass" layer — content stays visible but nothing here is clickable */}
      <div
        className={`absolute inset-0 z-10 ${radiusClassName} backdrop-blur-[2px] cursor-not-allowed ${
          tone === "dark" ? "bg-[#06111f]/55" : "bg-white/55"
        }`}
        aria-hidden="true"
      />

      {/* Corner ribbon */}
      <div className="pointer-events-none absolute top-0 right-0 z-20 h-28 w-28 overflow-hidden" aria-hidden="true">
        <div className="absolute right-[-38px] top-[20px] w-[160px] rotate-45 bg-[linear-gradient(180deg,#ffd86b_0%,#f5c542_100%)] py-1.5 text-center shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#06111f]">Coming Soon</p>
          <p className="text-[9px] font-semibold text-[#06111f]/80">{info.shortLabel}</p>
        </div>
      </div>

      <span className="sr-only">{info.label} — not yet available</span>
    </div>
  );
}
