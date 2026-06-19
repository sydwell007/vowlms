import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06111f] to-[#0d2239] text-4xl">
          🔍
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">404 — Not found</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or return to the VowLMS homepage.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/"
            className="rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] transition hover:bg-[#e8b830]">
            Back to home
          </Link>
          <Link href="/courses"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50">
            Browse courses
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            { label: "Academies", href: "/academies" },
            { label: "Dashboard", href: "/dashboard/learner" },
            { label: "Search", href: "/search" },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-muted transition hover:text-ink hover:border-slate-300">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
