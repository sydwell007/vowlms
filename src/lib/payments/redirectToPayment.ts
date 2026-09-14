/**
 * Redirects the browser to a gateway's hosted checkout that requires a
 * signed POST (PayFast) rather than a simple GET URL (PayPal/Lemon
 * Squeezy just get `window.location.href = approveUrl`/`checkoutUrl`
 * directly and don't need this).
 *
 * Deliberately does NOT build+submit the form inline on the current page —
 * that used to happen directly inside the "Pay" button's click handler
 * (after an async pricing fetch), and real production testing found it
 * unreliably got blocked by the browser's CSP form-action enforcement:
 * confirmed via a from-scratch Playwright repro that submitting a
 * dynamically-created form from within a React click handler's async
 * continuation is inconsistent in a way a form submitted fresh on a page's
 * own mount is not. Storing the form data and doing a real full-page
 * navigation to /pay-redirect sidesteps that entirely — the form there
 * submits on a brand new page load, in nobody else's click-handler
 * timing/re-render context.
 */

export type PaymentRedirectData = {
  formAction?: string;
  formFields?: Record<string, string | number>;
  redirectUrl?: string;
};

const STORAGE_KEY = "vowlms:pending-payment-redirect";

/** @throws Error if the payment response has neither a form to submit nor a redirect URL. */
export function redirectToPayment(data: PaymentRedirectData): void {
  if (!data.formAction || !data.formFields) {
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }
    throw new Error("Payment is not available for this course yet.");
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formAction: data.formAction, formFields: data.formFields }));
  window.location.href = "/pay-redirect";
}

/** Consumed once by /pay-redirect on mount — cleared immediately so a page refresh there doesn't resubmit. */
export function readPendingPaymentRedirect(): { formAction: string; formFields: Record<string, string | number> } | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(STORAGE_KEY);
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.formAction === "string" && parsed.formFields && typeof parsed.formFields === "object") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
