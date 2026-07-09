"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navItems = [
  { href: "/academies", label: "Academies" },
  { href: "/courses", label: "Courses" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/apply", label: "Apply" },
  { href: "/support", label: "Support" },
  { href: "/rewards", label: "Rewards" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/investors", label: "Investors" },
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06111f]/92 text-white shadow-[0_20px_48px_rgba(2,10,24,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] text-xs font-black text-white shadow-[0_8px_20px_rgba(6,182,212,0.3)]">
            GV
          </span>
          <span className="flex flex-col">
            <span className="text-base font-bold tracking-tight sm:text-[17px]">VowLMS</span>
            <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/50">
              GoalVow Platform
            </span>
          </span>
        </Link>

        {/* Search */}
        <Link
          href="/search"
          className="mx-3 hidden flex-1 max-w-[200px] items-center gap-2 rounded-lg border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/52 transition hover:border-white/20 hover:bg-white/10 xl:flex"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search…
          <kbd className="ml-auto rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/36">⌘K</kbd>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-px lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.activePrefix);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-2.5 py-2 text-[13px] font-medium transition ${
                  active ? "bg-white/8 text-white" : "text-white/68 hover:bg-white/6 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-[#06b6d4] transition-transform ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <NotificationBell />
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/14 bg-white/6 text-xs font-bold text-[#f5c542] transition hover:bg-white/10"
            title="Profile"
          >
            AM
          </Link>
          <ButtonLink href="/auth/signin" className="min-h-9 px-4 py-2 text-sm">
            Sign in
          </ButtonLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/14 bg-white/6 text-white transition hover:bg-white/10 lg:hidden"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="border-t border-white/10 bg-[#081626]/96 px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-1.5">
            <Link href="/search" onClick={closeMenu}
              className="flex items-center gap-2 rounded-md bg-white/8 px-4 py-3 text-sm text-white/70 hover:bg-white/12">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search…
            </Link>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.activePrefix);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-md px-4 py-3 text-sm font-semibold transition ${
                    active ? "bg-white text-[#06111f]" : "bg-white/8 text-white/88 hover:bg-white/12"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-1 flex gap-2">
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
      )}
    </header>
  );
}
