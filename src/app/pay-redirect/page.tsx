"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { readPendingPaymentRedirect } from "@/lib/payments/redirectToPayment";

/**
 * A dedicated landing page whose only job is to auto-submit a stored
 * payment form on a fresh page load — see redirectToPayment.ts for why
 * this exists instead of submitting the form directly from the "Pay"
 * button's own click handler.
 *
 * The <form> below is real JSX present in the DOM from the very first
 * render (not built imperatively via document.createElement in an effect)
 * — real production testing found the imperative version got inconsistently
 * blocked by the browser's CSP form-action enforcement in a way a form
 * that's part of the actual render tree is not.
 */
export default function PayRedirectPage() {
  const [formData, setFormData] = useState<{ formAction: string; formFields: Record<string, string | number> } | null>(null);
  const [missing, setMissing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const data = readPendingPaymentRedirect();
    if (!data) {
      void Promise.resolve().then(() => setMissing(true));
      return;
    }
    void Promise.resolve().then(() => setFormData(data));
  }, []);

  useEffect(() => {
    if (formData && formRef.current) formRef.current.submit();
  }, [formData]);

  return (
    <main className="premium-page flex min-h-[70vh] items-center justify-center px-5">
      <div className="text-center">
        {missing ? (
          <>
            <p className="text-sm font-medium text-ink">This payment link has expired, or the page was opened directly.</p>
            <Link href="/courses" className="mt-3 inline-block text-sm font-semibold text-[#1166c8] hover:underline">
              Back to courses
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#1166c8]" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">Redirecting you to your payment provider…</p>
          </>
        )}

        {formData ? (
          <form ref={formRef} method="POST" action={formData.formAction} className="hidden">
            {Object.entries(formData.formFields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={String(value)} />
            ))}
          </form>
        ) : null}
      </div>
    </main>
  );
}
