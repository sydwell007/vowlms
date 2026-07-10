"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { visualAssets } from "@/lib/visual-assets";

const STORAGE_KEY = "gv_sidebar_open";

type ServiceStatus = "Built-in" | "Coming soon" | "Connected" | "Support" | "In development";

type Service = {
  icon: string;
  name: string;
  tagline: string;
  status: ServiceStatus;
  href: string;
};

const services: Service[] = [
  {
    icon: "🤝",
    name: "VowSupport",
    tagline: "Account and learning support",
    status: "Support",
    href: "/support",
  },
  {
    icon: "⭐",
    name: "VowRewards",
    tagline: "Eligible learning milestones",
    status: "Built-in",
    href: "/rewards",
  },
  {
    icon: "🔧",
    name: "VowTools",
    tagline: "CV builder, diagnostics & prep",
    status: "Coming soon",
    href: "/vowtools",
  },
  {
    icon: "🔗",
    name: "PlugConnect",
    tagline: "Planned opportunity routing",
    status: "Coming soon",
    href: "/opportunities",
  },
  {
    icon: "🛍️",
    name: "SkillsShop",
    tagline: "Kits, tools & learning bundles",
    status: "Coming soon",
    href: "/skillsshop",
  },
  {
    icon: "🏫",
    name: "Learning Hubs",
    tagline: "Planned partner access model",
    status: "Coming soon",
    href: "/learning-hubs",
  },
  {
    icon: "🍳",
    name: "ChefOrder",
    tagline: "Chef business & food platform",
    status: "Coming soon",
    href: "/cheforder",
  },
  {
    icon: "🔬",
    name: "Innovation Labs",
    tagline: "VR/AR & AI learning tools",
    status: "In development",
    href: "/innovation-labs",
  },
];

const statusStyle: Record<ServiceStatus, string> = {
  "Built-in":      "bg-emerald-100 text-emerald-700",
  "Connected":     "bg-blue-100 text-blue-700",
  "Support":       "bg-purple-100 text-purple-700",
  "Coming soon":   "bg-amber-100 text-amber-700",
  "In development":"bg-cyan-100 text-cyan-700",
};

export function EcosystemSidebar() {
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
      <aside className="fixed right-0 top-[7.5rem] z-30 hidden items-start xl:flex">
        {/* Toggle tab */}
        <button
          onClick={toggle}
          aria-label={open ? "Collapse ecosystem sidebar" : "Expand ecosystem sidebar"}
          className="flex h-fit items-center gap-1.5 rounded-l-xl border border-r-0 border-slate-200 bg-white px-2 py-6 text-[10px] font-bold uppercase tracking-widest text-muted shadow-md transition hover:text-ink"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {open ? "✕ Ecosystem" : "Ecosystem ▸"}
        </button>

        {/* Panel */}
        <div
          className={`h-[calc(100vh-7.5rem)] overflow-y-auto shadow-[0_8px_40px_rgba(30,58,138,0.08)] transition-all duration-250 ${
            open
              ? "w-64 translate-x-0 rounded-l-xl border border-r-0 border-slate-200 bg-white opacity-100"
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
                    key={s.name}
                    href={s.href}
                    className="group flex items-start gap-3 rounded-lg p-3 transition hover:bg-slate-50"
                  >
                    <span className="mt-0.5 shrink-0 text-xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[13px] font-semibold text-ink truncate">{s.name}</p>
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none ${statusStyle[s.status]}`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-4 text-muted">{s.tagline}</p>
                    </div>
                  </Link>
                ))}
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

      {/* ── Mobile bottom accordion ──────────────────────────────────────── */}
      <div className="xl:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.1)]">
          {/* Mobile toggle */}
          <button
            onClick={toggle}
            className="flex w-full items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <span className="text-sm font-semibold text-ink">GoalVow Ecosystem</span>
              <span className="rounded-full bg-[#1e3a8a]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1e3a8a]">
                {services.length} services
              </span>
            </div>
            <span className="text-muted text-lg">{open ? "↓" : "↑"}</span>
          </button>

          {/* Mobile expanded panel */}
          {open && (
            <div className="max-h-64 overflow-y-auto border-t border-slate-100 px-4 pb-4">
              <div className="grid grid-cols-2 gap-2 pt-3">
                {services.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 transition hover:border-[#1e3a8a]/20"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-[12px] font-semibold text-ink">{s.name}</p>
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusStyle[s.status]}`}>
                        {s.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spacer so content isn&apos;t hidden behind fixed bar */}
        <div className="h-14" />
      </div>
    </>
  );
}
