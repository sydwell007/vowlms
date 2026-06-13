"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

const navItems = [
  { href: "/academies", label: "Academies" },
  { href: "/courses", label: "Courses" },
  { href: "/vr-practice", label: "VR Practice" },
  { href: "/rewards", label: "Rewards" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/learning-hubs", label: "Learning Hubs" },
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
      <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
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

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
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

        <div className="hidden lg:block">
          <ButtonLink href="/courses" className="min-h-10 px-4 py-2 shadow-[0_12px_26px_rgba(245,197,66,0.22)]">
            Start Learning
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
            <ButtonLink href="/courses" className="mt-2 w-full justify-center" onClick={closeMenu}>
              Start Learning
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
