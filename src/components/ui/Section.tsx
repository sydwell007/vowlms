import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  /** "tight" reduces vertical padding — use for sections stacked back-to-back with no visual break between them. */
  size?: "default" | "tight";
};

export function Section({ eyebrow, title, description, children, tone = "dark", size = "default" }: SectionProps) {
  const isLight = tone === "light";
  const isTight = size === "tight";
  const hasHeader = eyebrow || title || description;

  const paddingClass = isTight ? "py-8 md:py-12" : "py-16 md:py-24";

  return (
    <section className={`${isLight ? "premium-section-light text-ink" : "premium-section-dark text-white"} ${paddingClass}`}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {hasHeader ? (
          <div className={isTight ? "mb-6 max-w-3xl" : "mb-10 max-w-3xl"}>
            {eyebrow ? (
              <p className={isLight ? "mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]" : "mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold"}>
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-balance text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h2>
            ) : null}
            {description ? (
              <p className={isLight ? "mt-4 max-w-2xl text-base leading-7 text-muted" : "mt-4 max-w-2xl text-base leading-7 text-white/72"}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
