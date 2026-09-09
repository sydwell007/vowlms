"use client";

import Link from "next/link";
import { ChartNoAxesCombined } from "lucide-react";
import { usePathname } from "next/navigation";
import { academyNavLinks as allAcademyLinks } from "@/data/academy-nav";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AcademyTopBar() {
  const pathname = usePathname();
  // Keep the learner-facing academy network identical for every role. Admins
  // manage unreleased academies elsewhere instead of exposing them here.
  const academyLinks = allAcademyLinks.filter((link) => !isHiddenAcademyCategory(link.category, null));

  return (
    <div className="border-b border-white/8 bg-[#05131f]">
      <div className="scrollbar-none mx-auto flex w-full max-w-7xl items-center overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <nav aria-label="GoalVow academy navigation" className="flex min-w-max items-center gap-2">
          <span className="mr-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/44">
            Academy network
          </span>
          {academyLinks.map((link) => {
            const active = isActive(pathname, link.href);
            const accent = getAcademyAccentColor(link.category);

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
                <ChartNoAxesCombined aria-hidden="true" className="h-3.5 w-3.5" />
                {link.label} Academy
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
