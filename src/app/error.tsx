"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VowLMS page error", error.digest ?? error.name);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center px-5 py-16 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">This page could not be loaded</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        Your work has not been submitted again. Retry the page, or return home and continue from there.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-lg bg-[#06111f] px-5 py-3 text-sm font-semibold text-white">
          Try again
        </button>
        <Link href="/" className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink">
          Go home
        </Link>
      </div>
    </main>
  );
}
