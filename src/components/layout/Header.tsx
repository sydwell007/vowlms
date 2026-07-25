"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { clearSessionCache, useSession } from "@/lib/auth/useSession";
import { visualAssets } from "@/lib/visual-assets";
import { getComingSoonInfo } from "@/lib/academy-launch";
import type { AcademyCategory } from "@/types/lms";

type NavigationItem = {
  href: string;
  label: string;
  activePrefix?: string;
  dashboard?: true;
  /** Set on academy items so locked (not-yet-launched) academies render as disabled instead of a live link. */
  category?: AcademyCategory;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

/** A top-level nav entry is either a standalone link (Home, Dashboard) or a dropdown group. */
type NavEntry =
  | { kind: "link"; item: NavigationItem }
  | { kind: "group"; group: NavigationGroup };

const navEntries: NavEntry[] = [
  { kind: "link", item: { href: "/", label: "Home" } },
  {
    kind: "group",
    group: {
      label: "Academies",
      items: [
        { href: "/academies", label: "Academy overview" },
        { href: "/academies/upskilling", label: "Upskilling Academy", category: "upskilling" },
        { href: "/academies/skills-training", label: "Skills Training Academy", category: "skills-training" },
        { href: "/academies/chef-academy", label: "Chef Academy", category: "chef-academy" },
        { href: "/academies/private-school", label: "Private School", category: "private-school" },
        { href: "/academies/sports-academy", label: "Sports Academy", category: "sports-academy" },
        { href: "/academies/business-school", label: "Business School", category: "business-school" },
        { href: "/academies/university-online", label: "University Online", category: "university-online" },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Learning",
      items: [
        { href: "/courses", label: "Course catalogue" },
        { href: "/learn/pathways", label: "Skill pathways" },
        { href: "/pricing", label: "Course pricing" },
        { href: "/learn", label: "Learning pathway" },
        { href: "/practice", label: "Skills practice" },
        { href: "/vr-practice", label: "VR practice" },
      ],
    },
  },
  { kind: "link", item: { href: "/dashboard/learner", label: "Dashboard", activePrefix: "/dashboard", dashboard: true } },
  {
    kind: "group",
    group: {
      label: "Progress",
      items: [
        { href: "/certificates", label: "Certificates" },
        { href: "/rewards", label: "VowRewards" },
        { href: "/opportunities", label: "Opportunities" },
        { href: "/apply", label: "Application pathway" },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Company",
      items: [
        { href: "/about", label: "About Us" },
        { href: "/team", label: "Team" },
        { href: "/careers", label: "Careers" },
        { href: "/impact", label: "Impact" },
        { href: "/ecosystem", label: "Ecosystem" },
        { href: "/investors", label: "Investors Hub" },
        { href: "/innovation-labs", label: "Innovation Labs" },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Support",
      items: [
        { href: "/support", label: "Learner support" },
        { href: "/learning-hubs", label: "Learning hubs" },
        { href: "/calendar", label: "Calendar" },
      ],
    },
  },
];

function isActive(pathname: string, item: NavigationItem) {
  if (item.href === "/") return pathname === "/";
  const prefix = item.activePrefix ?? item.href;
  return pathname === item.href || pathname.startsWith(`${prefix}/`);
}

function resolveItem(item: NavigationItem, role?: string): NavigationItem {
  if (!item.dashboard || !role) return item;
  return { ...item, href: `/dashboard/${role}` };
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const desktopNavRef = useRef<HTMLElement>(null);
  const [mobileOpenForPath, setMobileOpenForPath] = useState<string | null>(null);
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const mobileMenuOpen = mobileOpenForPath === pathname;

  const isAuthed = session.status === "authenticated";
  const user = isAuthed ? session.user : null;
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "?";
  const avatarUrl = user?.avatar_url ?? user?.avatarUrl ?? null;

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setDesktopMenu(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDesktopMenu(null);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function handleLogout() {
    clearSessionCache();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
    router.refresh();
  }

  function closeAllMenus() {
    setDesktopMenu(null);
    setMobileOpenForPath(null);
    setMobileGroup(null);
  }

  function toggleMobileMenu() {
    setMobileOpenForPath((value) => (value === pathname ? null : pathname));
    setMobileGroup(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06111f]/94 text-white shadow-[0_20px_48px_rgba(2,10,24,0.32)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={closeAllMenus} className="flex shrink-0 items-center gap-3" aria-label="VowLMS home">
          <span className="brand-mark-frame flex h-11 w-11 items-center justify-center rounded-xl p-1.5 shadow-[0_12px_28px_rgba(6,182,212,0.16)]">
            <Image
              src={visualAssets.logo}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-bold sm:text-lg">VowLMS</span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/52">
              GoalVow LMS
            </span>
          </span>
        </Link>

        <Link
          href="/search"
          className="mx-2 hidden max-w-[160px] flex-1 items-center gap-2 rounded-lg border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/52 transition hover:border-white/20 hover:bg-white/10 xl:flex"
        >
          <span aria-hidden="true">Search</span>
          <span className="sr-only">Search VowLMS</span>
        </Link>

        <nav ref={desktopNavRef} className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {navEntries.map((entry) => {
            if (entry.kind === "link") {
              const resolved = resolveItem(entry.item, user?.role);
              const active = isActive(pathname, resolved);
              return (
                <Link
                  key={entry.item.label}
                  href={resolved.href}
                  onClick={closeAllMenus}
                  className={`relative flex min-h-10 items-center rounded-md px-3 text-[13px] font-semibold transition ${
                    active ? "bg-white/8 text-white" : "text-white/68 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {resolved.label}
                  <span
                    className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#06b6d4] transition-transform ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            }

            const group = entry.group;
            const items = group.items.map((item) => resolveItem(item, user?.role));
            const active = items.some((item) => isActive(pathname, item));
            const open = desktopMenu === group.label;
            const menuId = `desktop-menu-${group.label.toLowerCase()}`;

            return (
              <div key={group.label} className="relative">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={menuId}
                  aria-haspopup="menu"
                  onClick={() => setDesktopMenu(open ? null : group.label)}
                  className={`relative flex min-h-10 items-center gap-1 rounded-md px-3 text-[13px] font-semibold transition ${
                    active || open ? "bg-white/8 text-white" : "text-white/68 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {group.label}
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 border-b border-r border-current transition-transform ${
                      open ? "rotate-[225deg]" : "rotate-45"
                    }`}
                  />
                  <span
                    className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#06b6d4] transition-transform ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>

                {open ? (
                  <div
                    id={menuId}
                    role="menu"
                    className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-lg border border-white/10 bg-[#0b1b2d] p-2 shadow-[0_22px_50px_rgba(0,0,0,0.34)]"
                  >
                    {items.map((item) => {
                      const comingSoon = item.category ? getComingSoonInfo(item.category) : null;
                      if (comingSoon) {
                        return (
                          <span
                            key={item.href}
                            role="menuitem"
                            aria-disabled="true"
                            title={`${item.label} — ${comingSoon.label}`}
                            className="flex cursor-not-allowed items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-white/35"
                          >
                            <span>{item.label}</span>
                            <span className="shrink-0 rounded-full border border-gold/20 bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold/60">
                              Soon
                            </span>
                          </span>
                        );
                      }
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeAllMenus}
                          className={`block rounded-md px-3 py-2.5 text-sm font-medium transition ${
                            isActive(pathname, item)
                              ? "bg-white text-[#06111f]"
                              : "text-white/76 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {isAuthed ? <NotificationBell /> : null}
          {session.status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-white/10" />
          ) : isAuthed ? (
            <>
              <Link
                href="/profile"
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/14 bg-white/6 text-xs font-bold text-[#f5c542] transition hover:bg-white/10"
                title={user?.name ?? "Profile"}
              >
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" fill sizes="36px" className="object-cover" unoptimized />
                ) : initials}
              </Link>
              <button
                type="button"
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

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/14 bg-white/6 text-white transition hover:bg-white/10 xl:hidden"
        >
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span className={`h-0.5 rounded-full bg-current transition ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {mobileMenuOpen ? (
        <nav
          className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-white/10 bg-[#081626]/98 px-4 py-4 xl:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-2">
            <Link
              href="/search"
              onClick={closeAllMenus}
              className="rounded-md bg-white/8 px-4 py-3 text-sm font-semibold text-white/76 hover:bg-white/12"
            >
              Search VowLMS
            </Link>

            {navEntries.map((entry) => {
              if (entry.kind === "link") {
                const resolved = resolveItem(entry.item, user?.role);
                const active = isActive(pathname, resolved);
                return (
                  <Link
                    key={entry.item.label}
                    href={resolved.href}
                    onClick={closeAllMenus}
                    className={`rounded-md px-4 py-3 text-sm font-semibold ${
                      active ? "bg-white/8 text-gold" : "text-white/88 hover:bg-white/6"
                    }`}
                  >
                    {resolved.label}
                  </Link>
                );
              }

              const group = entry.group;
              const open = mobileGroup === group.label;
              const items = group.items.map((item) => resolveItem(item, user?.role));
              const active = items.some((item) => isActive(pathname, item));
              const menuId = `mobile-menu-${group.label.toLowerCase()}`;

              return (
                <div key={group.label} className="rounded-md border border-white/8 bg-white/[0.04]">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={menuId}
                    onClick={() => setMobileGroup(open ? null : group.label)}
                    className={`flex min-h-12 w-full items-center justify-between px-4 text-left text-sm font-semibold ${
                      active ? "text-gold" : "text-white/88"
                    }`}
                  >
                    {group.label}
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 border-b border-r border-current transition-transform ${
                        open ? "rotate-[225deg]" : "rotate-45"
                      }`}
                    />
                  </button>
                  {open ? (
                    <div id={menuId} className="grid gap-1 border-t border-white/8 p-2">
                      {items.map((item) => {
                        const comingSoon = item.category ? getComingSoonInfo(item.category) : null;
                        if (comingSoon) {
                          return (
                            <span
                              key={item.href}
                              aria-disabled="true"
                              title={`${item.label} — ${comingSoon.label}`}
                              className="flex cursor-not-allowed items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-white/35"
                            >
                              <span>{item.label}</span>
                              <span className="shrink-0 rounded-full border border-gold/20 bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold/60">
                                Soon
                              </span>
                            </span>
                          );
                        }
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeAllMenus}
                            className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                              isActive(pathname, item)
                                ? "bg-white text-[#06111f]"
                                : "text-white/68 hover:bg-white/8 hover:text-white"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="mt-1 flex gap-2 border-t border-white/10 pt-3">
              {session.status === "loading" ? (
                <div className="h-12 flex-1 animate-pulse rounded-md bg-white/10" />
              ) : isAuthed ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeAllMenus}
                    className="flex-1 rounded-md border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/88 hover:bg-white/12"
                  >
                    Profile ({initials})
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      handleLogout();
                    }}
                    className="flex-1 rounded-md bg-white/8 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/12"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={closeAllMenus}
                    className="flex-1 rounded-md border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/88 hover:bg-white/12"
                  >
                    Sign in
                  </Link>
                  <ButtonLink href="/auth/signup" className="flex-1 justify-center" onClick={closeAllMenus}>
                    Start Learning
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
