import Link from "next/link";
import Image from "next/image";
import { visualAssets } from "@/lib/visual-assets";

const columns = [
  {
    title: "About GoalVow",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/team", label: "Team" },
      { href: "/careers", label: "Careers" },
      { href: "/impact", label: "Impact" },
      { href: "/investors", label: "Investors Hub" },
      { href: "/innovation-labs", label: "Innovation Labs" },
    ],
  },
  {
    title: "Academy Network",
    links: [
      { href: "/academies/upskilling", label: "Upskilling" },
      { href: "/academies/skills-training", label: "Skills Training" },
      { href: "/academies/chef-academy", label: "Chef Academy" },
      { href: "/academies/private-school", label: "Private School" },
      { href: "/academies/business-school", label: "Business School" },
      { href: "/academies/university-online", label: "University Online" },
    ],
  },
  {
    title: "Other Services",
    links: [
      { href: "/rewards", label: "VowRewards" },
      { href: "/support", label: "VowSupport" },
      { href: "/opportunities", label: "PlugConnect" },
      { href: "/learning-hubs", label: "Learning Hubs" },
      { href: "/skillsshop", label: "SkillsShop" },
      { href: "/vowtools", label: "VowTools" },
      { href: "/cheforder", label: "ChefOrder" },
    ],
  },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookies" },
  { href: "/privacy#data-rights", label: "Do Not Sell/Share My Info" },
  { href: "/accessibility", label: "Accessibility" },
];

export function Footer() {
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
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white/78 transition hover:text-gold">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h2 className="border-b border-white/12 pb-3 text-lg font-semibold">Contact Us</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/78">
            <a href="tel:+27632706787" className="transition hover:text-gold">
              Phone: +27632706787
            </a>
            <a href="mailto:support@goalvow.com" className="transition hover:text-gold">
              Email: support@goalvow.com
            </a>
            <p>Address: 17 Vultee Cape Town</p>
            <a href="https://wa.me/27839488894" className="transition hover:text-gold">
              WhatsApp: +27839488894
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
