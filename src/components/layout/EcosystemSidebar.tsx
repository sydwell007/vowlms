"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Network, X } from "lucide-react";
import { visualAssets } from "@/lib/visual-assets";
import { getEcosystemServices, ecosystemStatusBadgeClass } from "@/data/ecosystem-services";
import { useSession } from "@/lib/auth/useSession";
import { ThandiSidebarEntryDesktop, ThandiSidebarEntryMobile } from "@/components/thandi/ThandiSidebarEntry";

const STORAGE_KEY = "gv_sidebar_open";

export function EcosystemSidebar() {
  const session = useSession();
  const role = session.status === "authenticated" ? session.user.role : null;
  const services = getEcosystemServices(role);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage after mount — use a ref flag so setState is in a callback, not the body
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setMounted(true);
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) setOpen(saved === "true");
      } catch { /* SSR / private browsing */ }
    });
    return () => { cancelled = true; };
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
  }

  if (!mounted) return null;

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="fixed right-0 top-[75px] z-30 hidden items-start xl:flex">
        {/* Toggle tab */}
        <button
          onClick={toggle}
          aria-label={open ? "Collapse ecosystem sidebar" : "Expand ecosystem sidebar"}
          className="flex h-fit items-center gap-1.5 rounded-l-lg border border-r-0 border-white/12 bg-[#0c2938] px-2 py-5 text-[10px] font-bold uppercase tracking-widest text-white/72 shadow-md transition hover:bg-[#123746] hover:text-white"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {open ? <X aria-hidden="true" className="h-3.5 w-3.5" /> : <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />}
          Ecosystem
        </button>

        {/* Panel */}
        <div
          className={`h-[calc(100vh-75px)] overflow-y-auto shadow-[0_8px_40px_rgba(6,23,37,0.16)] transition-all duration-250 ${
            open
              ? "w-64 translate-x-0 rounded-l-lg border border-r-0 border-slate-200 bg-white opacity-100"
              : "pointer-events-none w-0 translate-x-full overflow-hidden border-0 opacity-0"
          }`}
        >
          {open && (
            <div className="flex flex-col gap-0">
              {/* Header */}
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="brand-mark-frame flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-1.5">
                    <Image src={visualAssets.logo} alt="GoalVow logo" width={32} height={32} className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e3a8a]">
                      GoalVow Ecosystem
                    </p>
                    <p className="mt-0.5 text-xs text-muted">Support services</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-col gap-0 p-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="group flex items-start gap-3 rounded-lg p-3 transition hover:bg-slate-50"
                  >
                    {s.iconImage ? (
                      <Image src={s.iconImage} alt="" width={20} height={20} className="mt-0.5 h-5 w-5 shrink-0 rounded object-contain" />
                    ) : (
                      <span className="mt-0.5 shrink-0 text-xl">{s.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[13px] font-semibold text-ink truncate">{s.name}</p>
                        <span className="flex shrink-0 items-center gap-1">
                          {!s.learnerVisible ? (
                            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold leading-none text-slate-600">
                              Admin only
                            </span>
                          ) : null}
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none ${ecosystemStatusBadgeClass[s.status]}`}>
                            {s.status}
                          </span>
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-4 text-muted">{s.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Thandi — AI tutor, opens a live panel instead of navigating */}
              <div className="border-t border-slate-100 p-2">
                <ThandiSidebarEntryDesktop />
              </div>

              {/* Footer CTA */}
              <div className="border-t border-slate-100 p-3">
                <Link
                  href="/ecosystem"
                  className="block rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] px-3 py-2.5 text-center text-[12px] font-semibold text-white transition hover:opacity-90"
                >
                  Full ecosystem map →
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="xl:hidden">
        {open ? (
          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white shadow-[0_-14px_42px_rgba(6,23,37,0.16)]">
            <button onClick={toggle} className="flex w-full items-center justify-between px-5 py-3">
              <span className="flex items-center gap-2">
                <Network aria-hidden="true" className="h-5 w-5 text-[#1765a6]" />
                <span className="text-sm font-semibold text-ink">GoalVow ecosystem</span>
                <span className="rounded-full bg-[#1765a6]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1765a6]">
                  {services.length}
                </span>
              </span>
              <ChevronDown aria-hidden="true" className="h-5 w-5 text-muted" />
            </button>

            <div className="max-h-64 overflow-y-auto border-t border-slate-100 px-4 pb-4">
              <div className="grid grid-cols-2 gap-2 pt-3">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 transition hover:border-[#1765a6]/20"
                  >
                    {s.iconImage ? (
                      <Image src={s.iconImage} alt="" width={22} height={22} className="h-[22px] w-[22px] shrink-0 rounded object-contain" />
                    ) : (
                      <span className="text-xl">{s.icon}</span>
                    )}
                    <div>
                      <p className="text-[12px] font-semibold text-ink">{s.name}</p>
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${ecosystemStatusBadgeClass[s.status]}`}>
                        {s.learnerVisible ? s.status : "Admin only"}
                      </span>
                    </div>
                  </Link>
                ))}
                <ThandiSidebarEntryMobile />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={toggle}
            aria-label="Open GoalVow ecosystem"
            title="GoalVow ecosystem"
            className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0c2938] text-white shadow-[0_12px_32px_rgba(6,23,37,0.3)] transition hover:bg-[#1765a6]"
          >
            <Network aria-hidden="true" className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-[#061725]">
              {services.length}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
