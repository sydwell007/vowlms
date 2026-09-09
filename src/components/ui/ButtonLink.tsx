import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ink" | "outline" | "ghost";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  prefetch?: boolean;
};

const variants = {
  primary: "border border-[#d9aa32] bg-[#efc14b] text-[#071623] shadow-[0_12px_26px_rgba(239,193,75,0.2)] hover:bg-[#f5cc62]",
  secondary: "border border-white/20 bg-white/8 text-white hover:border-white/32 hover:bg-white/14",
  ink: "border border-[#102c3a] bg-[#071b29] text-white shadow-[0_12px_26px_rgba(6,23,37,0.15)] hover:border-[#1d4b5c] hover:bg-[#0c2938]",
  outline: "border border-slate-200 bg-white text-ink hover:border-[#1765a6]/30 hover:bg-[#f3f8fa]",
  ghost: "text-white/78 hover:text-white",
};

export function ButtonLink({ href, children, variant = "primary", className = "", onClick, prefetch }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      prefetch={prefetch}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
