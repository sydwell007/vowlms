/**
 * Redirects the browser to a payment gateway's hosted checkout.
 *
 * PayFast now always sends `redirectUrl` (a GET request with the signed
 * params already in the query string — confirmed directly against PayFast
 * that /eng/process accepts GET and returns a real payment.payfast.io
 * session, not an error) instead of `formAction`/`formFields` for a POST
 * form submission. That switch happened because a client-side
 * dynamically-submitted POST form — tried two different ways, including
 * building it fresh on its own dedicated page at /pay-redirect — kept
 * getting inconsistently blocked by the browser's CSP form-action
 * enforcement in real production testing, for reasons that resisted
 * extensive isolation (it wasn't the CSP host list, GTM, the service
 * worker, or how the form element was created). A plain GET navigation
 * isn't governed by form-action at all, which sidesteps the problem
 * entirely instead of continuing to chase its exact mechanism.
 *
 * `formAction`/`formFields` support is kept for any other gateway that
 * might need a signed POST in the future — routes through /pay-redirect,
 * a dedicated page that submits a real (non-imperatively-created) form on
 * a fresh mount, which is the more-correct version of the two POST
 * approaches even though it wasn't sufficient for PayFast on its own.
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
