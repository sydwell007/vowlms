"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readPendingPaymentRedirect } from "@/lib/payments/redirectToPayment";

/**
 * A dedicated landing page whose only job is to auto-submit a stored
 * payment form on a fresh page load — see redirectToPayment.ts for why
 * this exists instead of submitting the form directly from the "Pay"
 * button's own click handler.
 */
export default function PayRedirectPage() {
  const [status, setStatus] = useState<"submitting" | "missing">("submitting");

  useEffect(() => {
    const data = readPendingPaymentRedirect();
    if (!data) {
      void Promise.resolve().then(() => setStatus("missing"));
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.formAction;
    for (const [name, value] of Object.entries(data.formFields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }, []);

  return (
    <main className="premium-page flex min-h-[70vh] items-center justify-center px-5">
      <div className="text-center">
        {status === "submitting" ? (
          <>
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#1166c8]" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">Redirecting you to your payment provider…</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-ink">This payment link has expired, or the page was opened directly.</p>
            <Link href="/courses" className="mt-3 inline-block text-sm font-semibold text-[#1166c8] hover:underline">
              Back to courses
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
