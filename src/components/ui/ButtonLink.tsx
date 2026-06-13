import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ink" | "outline" | "ghost";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const variants = {
  primary: "border border-[#e6b63e] bg-[linear-gradient(180deg,#ffd86b_0%,#f5c542_100%)] text-[#07101d] shadow-[0_14px_28px_rgba(245,197,66,0.2)] hover:brightness-[1.03]",
  secondary: "border border-white/20 bg-white/10 text-white hover:bg-white/20",
  ink: "border border-[#0e2440] bg-[linear-gradient(180deg,#0d2239_0%,#06111f_100%)] text-white shadow-[0_14px_28px_rgba(6,17,31,0.16)] hover:border-[#163657] hover:bg-[#0d2239]",
  outline: "border border-slate-200 bg-white text-ink hover:border-[#1166c8]/30 hover:bg-[#f5f9ff]",
  ghost: "text-white/78 hover:text-white",
};

export function ButtonLink({ href, children, variant = "primary", className = "", onClick }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
