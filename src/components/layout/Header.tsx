"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useSession, clearSessionCache } from "@/lib/auth/useSession";
import { visualAssets } from "@/lib/visual-assets";

const navItems = [
  { href: "/academies", label: "Academies" },
  { href: "/courses", label: "Courses" },
  { href: "/vr-practice", label: "VR Practice" },
  { href: "/rewards", label: "Rewards" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/learning-hubs", label: "Learning Hubs" },
  { href: "/dashboard/learner", label: "Dashboard", activePrefix: "/dashboard" },
];

const mobileExtraItems = [
  { href: "/learn", label: "Learn pathway" },
  { href: "/practice", label: "Practice pathway" },
  { href: "/apply", label: "Apply pathway" },
  { href: "/support", label: "Support" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/investors", label: "Investors" },
];

function isActive(pathname: string, href: string, activePrefix?: string) {
  const prefix = activePrefix ?? href;
  return pathname === href || pathname.startsWith(`${prefix}/`);
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const menuOpen = openForPath === pathname;

  const isAuthed = session.status === "authenticated";
  const user = session.status === "authenticated" ? session.user : null;
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";

  async function handleLogout() {
    clearSessionCache();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
  }

  function toggleMenu() {
    setOpenForPath((value) => (value === pathname ? null : pathname));
  }

  function closeMenu() {
    setOpenForPath(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06111f]/94 text-white shadow-[0_20px_48px_rgba(2,10,24,0.32)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3">
          <span className="brand-mark-frame flex h-11 w-11 items-center justify-center rounded-xl p-1.5 shadow-[0_12px_28px_rgba(6,182,212,0.16)]">
            <Image
              src={visualAssets.logo}
              alt="GoalVow logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-bold tracking-tight sm:text-lg">VowLMS</span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/52">
              GoalVow LMS
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
        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.activePrefix);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-semibold transition ${
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
        <div className="hidden items-center gap-2 xl:flex">
          {isAuthed && <NotificationBell />}
          {session.status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-white/10" />
          ) : isAuthed ? (
            <>
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/14 bg-white/6 text-xs font-bold text-[#f5c542] transition hover:bg-white/10"
                title={user?.name ?? "Profile"}
              >
                {initials}
              </Link>
              <button
                onClick={handleLogout}
                className="min-h-9 rounded-lg border border-white/14 bg-white/6 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-white/76 transition hover:bg-white/8 hover:text-white"
              >
                Sign in
              </Link>
              <ButtonLink href="/auth/signup" className="min-h-9 whitespace-nowrap px-4 py-2 text-sm">
                Start Learning
              </ButtonLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/14 bg-white/6 text-white transition hover:bg-white/10 xl:hidden"
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
          className="border-t border-white/10 bg-[#081626]/96 px-4 py-4 xl:hidden"
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
            <div className="my-2 border-t border-white/10" />
            {mobileExtraItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-white/68 transition hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-1 flex gap-2">
              {session.status === "loading" ? (
                <div className="h-12 flex-1 animate-pulse rounded-md bg-white/10" />
              ) : isAuthed ? (
                <>
                  <Link href="/profile" onClick={closeMenu}
                    className="flex-1 rounded-md border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/88 hover:bg-white/12">
                    Profile ({initials})
                  </Link>
                  <button onClick={() => { closeMenu(); handleLogout(); }}
                    className="flex-1 rounded-md bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/12">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={closeMenu}
                    className="flex-1 rounded-md border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/88 hover:bg-white/12">
                    Sign in
                  </Link>
                  <ButtonLink href="/auth/signup" className="flex-1 justify-center" onClick={closeMenu}>
                    Start Learning
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
