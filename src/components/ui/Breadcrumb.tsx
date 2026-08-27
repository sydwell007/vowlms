import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/** Real, clickable "where am I" trail. The last item (current page) is never a link. */
export function Breadcrumb({ items, tone = "light" }: { items: BreadcrumbItem[]; tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className={isDark ? "text-white/30" : "text-slate-300"}>/</span>
            ) : null}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={
                  isDark
                    ? "text-white/56 transition hover:text-white"
                    : "text-muted transition hover:text-ink"
                }
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isDark ? "text-white/88" : "text-ink"}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
