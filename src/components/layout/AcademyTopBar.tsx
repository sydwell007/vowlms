"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChefHat,
  GraduationCap,
  Medal,
  School,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { academyNavLinks as allAcademyLinks } from "@/data/academy-nav";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { useSession } from "@/lib/auth/useSession";
import type { AcademyCategory } from "@/types/lms";

const academyIcons: Record<AcademyCategory, LucideIcon> = {
  upskilling: ChartNoAxesCombined,
  "skills-training": Wrench,
  "chef-academy": ChefHat,
  "private-school": School,
  "sports-academy": Medal,
  "business-school": BriefcaseBusiness,
  "university-online": GraduationCap,
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AcademyTopBar() {
  const pathname = usePathname();
  const session = useSession();
  // Resolve to the strict learner view first, then reveal unreleased
  // academies only after an authenticated admin session is confirmed.
  const role = session.status === "authenticated" ? session.user.role : null;
  const isAdmin = role === "admin";
  const academyLinks = allAcademyLinks.filter((link) => !isHiddenAcademyCategory(link.category, role));

  return (
    <div className="border-b border-white/8 bg-[#05131f]">
      <div className="scrollbar-none mx-auto flex w-full max-w-[1536px] items-center overflow-x-auto px-4 py-2.5 sm:px-6">
        <nav aria-label="GoalVow academy navigation" className="flex min-w-max items-center gap-2">
          <span className="mr-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/44">
            Academy network
          </span>
          {academyLinks.map((link) => {
            const active = isActive(pathname, link.href);
            const accent = getAcademyAccentColor(link.category);
            const AcademyIcon = academyIcons[link.category];
            const isAdminOnly = isAdmin && isHiddenAcademyCategory(link.category, null);
            const displayLabel = link.category === "upskilling" ? "Upskilling Academy" : link.label;

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
                <AcademyIcon aria-hidden="true" className="h-3.5 w-3.5" />
                {displayLabel}
                {isAdminOnly ? (
                  <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
                    Admin
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
