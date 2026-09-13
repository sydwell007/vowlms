export function formatCurrency(amount: number) {
  if (amount === 0) return "Free";

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Like formatCurrency, but for any ISO currency code — used for international (Paystack/PayPal/Lemon Squeezy) prices. */
export function formatMoney(amount: number, currencyCode: string) {
  if (amount === 0) return "Free";
  // ZAR always renders in the same "R209" house style used everywhere else
  // in the app (a PayFast/VOWR price, or a manual "Other payment options"
  // override back to PayFast) — en-US would otherwise render it as the
  // unfamiliar "ZAR 209.00".
  if (currencyCode === "ZAR") return formatCurrency(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}
