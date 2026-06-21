"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navItems = [
  { href: "/academies", label: "Academies" },
  { href: "/courses", label: "Courses" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/rewards", label: "Rewards" },
  { href: "/calendar", label: "Calendar" },
  { href: "/dashboard/learner", label: "Dashboard", activePrefix: "/dashboard" },
];

function isActive(pathname: string, href: string, activePrefix?: string) {
  const prefix = activePrefix ?? href;
  return pathname === href || pathname.startsWith(`${prefix}/`);
}

export function Header() {
  const pathname = usePathname();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const menuOpen = openForPath === pathname;

  function toggleMenu() {
    setOpenForPath((value) => (value === pathname ? null : pathname));
  }

  function closeMenu() {
    setOpenForPath(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06111f]/88 text-white shadow-[0_20px_48px_rgba(2,10,24,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-sm font-black text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.22)]">
            VL
          </span>
          <span className="flex flex-col">
            <span className="text-base font-semibold tracking-normal sm:text-lg">VowLMS</span>
            <span className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/58">
              GoalVow LMS
            </span>
          </span>
        </Link>

        {/* Search bar — desktop */}
        <Link
          href="/search"
          className="mx-3 hidden flex-1 max-w-xs items-center gap-2 rounded-lg border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/60 transition hover:border-white/20 hover:bg-white/10 lg:flex"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search courses, lessons…
          <kbd className="ml-auto rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/40">⌘K</kbd>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.activePrefix);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${active ? "bg-white/8 text-white" : "text-white/72 hover:bg-white/8 hover:text-gold"}`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold transition-transform ${active ? "scale-x-100" : "scale-x-0"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <NotificationBell />
          <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/14 bg-white/6 text-sm font-bold text-gold transition hover:bg-white/10" title="Profile">
            AM
          </Link>
          <ButtonLink href="/auth/signin" className="min-h-10 px-4 py-2 shadow-[0_12px_26px_rgba(245,197,66,0.22)]">
            Sign in
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/14 bg-white/6 text-white transition hover:bg-white/10 lg:hidden"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <nav className="border-t border-white/10 bg-[#081626]/96 px-4 py-4 lg:hidden" aria-label="Mobile main navigation">
          <div className="mx-auto grid w-full max-w-7xl gap-2">
            {/* Mobile search */}
            <Link href="/search" onClick={closeMenu}
              className="flex items-center gap-2 rounded-md bg-white/8 px-4 py-3 text-sm text-white/70 hover:bg-white/12 hover:text-white">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search courses and lessons…
            </Link>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.activePrefix);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-md px-4 py-3 text-sm font-semibold transition ${active ? "bg-white text-[#06111f]" : "bg-white/8 text-white/88 hover:bg-white/12 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex gap-2 mt-1">
              <Link href="/profile" onClick={closeMenu}
                className="flex-1 rounded-md border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/88 hover:bg-white/12">
                Profile
              </Link>
              <ButtonLink href="/auth/signin" className="flex-1 justify-center" onClick={closeMenu}>
                Sign in
              </ButtonLink>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
