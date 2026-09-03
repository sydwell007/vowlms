"use client";

import Link from "next/link";
import Image from "next/image";
import { visualAssets } from "@/lib/visual-assets";
import { siteConfig } from "@/lib/site";
import { getComingSoonInfo, isHiddenAcademyCategory } from "@/lib/academy-launch";
import { academyNavLinks } from "@/data/academy-nav";
import { getEcosystemServices } from "@/data/ecosystem-services";
import { useSession } from "@/lib/auth/useSession";
import type { AcademyCategory } from "@/types/lms";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookies" },
  { href: "/privacy#data-rights", label: "Do Not Sell/Share My Info" },
  { href: "/accessibility", label: "Accessibility" },
];

export function Footer() {
  // Deliberately client-side (like AcademyTopBar/EcosystemSidebar): keeps
  // seed-data.ts out of the client bundle and avoids forcing every page in
  // the app into dynamic rendering just because the shared footer is
  // role-aware. Defaults to the strictest (signed-out/learner) view until
  // the session resolves.
  const session = useSession();
  const role = session.status === "authenticated" ? session.user.role : null;
  const isAdmin = role === "admin";
  const academies = academyNavLinks.filter((link) => !isHiddenAcademyCategory(link.category, role));
  const services = getEcosystemServices(role);
  const innovationLabs = services.find((s) => s.slug === "innovation-labs");

  const columns: {
    title: string;
    links: { href: string; label: string; category?: AcademyCategory; adminOnly?: boolean }[];
  }[] = [
    {
      title: "About GoalVow",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/team", label: "Team" },
        { href: "/careers", label: "Careers" },
        { href: "/impact", label: "Impact" },
        { href: "/ecosystem", label: "Ecosystem" },
        { href: "/investors", label: "Investors Hub" },
        ...(innovationLabs
          ? [{ href: innovationLabs.href, label: innovationLabs.name, adminOnly: !innovationLabs.learnerVisible }]
          : []),
      ],
    },
    {
      title: "Academy Network",
      links: academies.map((academy) => ({
        href: academy.href,
        label: academy.label,
        category: academy.category,
      })),
    },
    {
      title: "Other Services",
      links: [
        { href: "/pricing", label: "Course pricing" },
        { href: "/apply", label: "Application pathway" },
        ...services.map((service) => ({
          href: service.href,
          label: service.name,
          adminOnly: !service.learnerVisible,
        })),
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t-2 border-gold bg-[#0d2239] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 pt-12 sm:px-6 lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="brand-mark-frame flex h-12 w-12 items-center justify-center rounded-xl p-1.5">
            <Image src={visualAssets.logo} alt="GoalVow logo" width={44} height={44} className="h-full w-full object-contain" />
          </span>
          <span>
            <span className="block text-lg font-bold">VowLMS</span>
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/50">GoalVow learning ecosystem</span>
          </span>
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="border-b border-white/12 pb-3 text-lg font-semibold">{column.title}</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => {
                const comingSoon = link.category ? getComingSoonInfo(link.category, role) : null;
                if (comingSoon) {
                  return (
                    <span
                      key={link.href}
                      aria-disabled="true"
                      title={`${link.label} — ${comingSoon.label}`}
                      className="flex cursor-not-allowed items-center justify-between gap-2 text-sm text-white/35"
                    >
                      <span>{link.label}</span>
                      <span className="shrink-0 rounded-full border border-gold/20 bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold/60">
                        Soon
                      </span>
                    </span>
                  );
                }
                return (
                  <Link key={link.href} href={link.href} className="flex items-center justify-between gap-2 text-sm text-white/78 transition hover:text-gold">
                    <span>{link.label}</span>
                    {isAdmin && link.adminOnly ? (
                      <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/50">
                        Admin
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <h2 className="border-b border-white/12 pb-3 text-lg font-semibold">Contact Us</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/78">
            <a href={siteConfig.contact.phoneHref} className="transition hover:text-gold">
              Phone: {siteConfig.contact.phoneDisplay}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="transition hover:text-gold">
              Email: {siteConfig.contact.email}
            </a>
            <p>Address: {siteConfig.contact.address}</p>
            <a href={siteConfig.contact.whatsappHref} className="transition hover:text-gold">
              WhatsApp: {siteConfig.contact.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#081626]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-4 text-xs text-white/72 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Copyright &copy; 2026 GoalVow Holdings. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-y-1">
            {legalLinks.map((link, index) => (
              <div key={link.href} className="flex items-center">
                <Link href={link.href} className="transition hover:text-gold">
                  {link.label}
                </Link>
                {index < legalLinks.length - 1 ? (
                  <span aria-hidden="true" className="px-2 text-white/28">
                    |
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
