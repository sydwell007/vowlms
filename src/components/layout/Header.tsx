import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

const navItems = [
  { href: "/academies", label: "Academies" },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard/learner", label: "Dashboard" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06111f]/88 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-sm font-black text-[#06111f]">
            VL
          </span>
          <span className="text-base font-semibold tracking-normal">VowLMS</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-white/72 transition hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden md:block">
          <ButtonLink href="/courses" className="min-h-10 px-4 py-2">
            Start learning
          </ButtonLink>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-5 pb-3 md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white/78">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
