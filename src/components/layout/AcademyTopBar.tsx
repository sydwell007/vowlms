"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const academyLinks = [
  { href: "/", label: "Home", home: true },
  { href: "/academies/upskilling", label: "For Upskilling" },
  { href: "/academies/skills-training", label: "For Skills Training" },
  { href: "/academies/chef-academy", label: "For Chef Academy" },
  { href: "/academies/private-school", label: "For Private School" },
  { href: "/academies/sports-academy", label: "For Sports Academy" },
  { href: "/academies/business-school", label: "For Business School" },
  { href: "/academies/university-online", label: "For University Online" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
      <path d="M12 3.2 3.75 10v10.25h5.5V14.5h5.5v5.75h5.5V10L12 3.2Z" />
    </svg>
  );
}

export function AcademyTopBar() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#f5c542]/65 bg-[#0d2239] text-white shadow-[inset_0_1px_0_rgba(245,197,66,0.18)]">
      <div className="mx-auto flex w-full max-w-7xl items-center overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <nav aria-label="GoalVow academy navigation" className="flex min-w-max items-center gap-0.5 text-[0.72rem] font-semibold tracking-[0.02em] sm:text-xs">
          {academyLinks.map((link, index) => {
            const active = isActive(pathname, link.href);

            return (
              <div key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1.5 whitespace-nowrap px-2 py-1.5 transition ${active ? "text-gold" : "text-white/88 hover:text-gold"}`}
                >
                  {link.home ? <HomeIcon /> : null}
                  <span>{link.label}</span>
                  <span
                    className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold transition-transform ${active ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
                {index < academyLinks.length - 1 ? (
                  <span aria-hidden="true" className="px-1.5 text-white/28">
                    |
                  </span>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
