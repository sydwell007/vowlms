"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getComingSoonInfo, isHiddenAcademyCategory } from "@/lib/academy-launch";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import type { AcademyCategory } from "@/types/lms";

const allAcademyLinks: { href: string; label: string; icon: string; category: AcademyCategory }[] = [
  { href: "/academies/upskilling", label: "Upskilling", icon: "📈", category: "upskilling" },
  { href: "/academies/skills-training", label: "Skills Training", icon: "🔧", category: "skills-training" },
  { href: "/academies/chef-academy", label: "Chef Academy", icon: "🍳", category: "chef-academy" },
  { href: "/academies/private-school", label: "Private School", icon: "🎒", category: "private-school" },
  { href: "/academies/sports-academy", label: "Sports Academy", icon: "🏅", category: "sports-academy" },
  { href: "/academies/business-school", label: "Business School", icon: "💼", category: "business-school" },
  { href: "/academies/university-online", label: "University Online", icon: "🎓", category: "university-online" },
];

const academyLinks = allAcademyLinks.filter((link) => !isHiddenAcademyCategory(link.category));

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AcademyTopBar() {
  const pathname = usePathname();

  return (
    <div className="border-b border-white/8 bg-[#0a1f36]">
      <div className="scrollbar-none mx-auto flex w-full max-w-7xl items-center overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <nav aria-label="GoalVow academy navigation" className="flex min-w-max items-center gap-1.5">
          {academyLinks.map((link) => {
            const active = isActive(pathname, link.href);
            const comingSoon = getComingSoonInfo(link.category);
            const accent = getAcademyAccentColor(link.category);

            if (comingSoon) {
              return (
                <span
                  key={link.href}
                  aria-disabled="true"
                  title={`${link.label} — ${comingSoon.label}`}
                  className="flex cursor-not-allowed items-center gap-1.5 whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] font-semibold text-white/32 sm:text-xs"
                >
                  <span aria-hidden="true" className="text-[0.85em] grayscale opacity-60">{link.icon}</span>
                  {link.label}
                  <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/40">
                    Soon
                  </span>
                </span>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition sm:text-xs"
                style={
                  active
                    ? { borderColor: `${accent}80`, backgroundColor: `${accent}26`, color: "#ffffff" }
                    : { borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.68)" }
                }
                onMouseEnter={(event) => {
                  if (!active) event.currentTarget.style.backgroundColor = `${accent}1a`;
                }}
                onMouseLeave={(event) => {
                  if (!active) event.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                }}
              >
                <span aria-hidden="true" className="text-[0.85em]">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
