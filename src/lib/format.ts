export function formatCurrency(amount: number) {
  if (amount === 0) return "Free";

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Like formatCurrency, but for any ISO currency code — used for international (Paystack/PayPal) prices. */
export function formatMoney(amount: number, currencyCode: string) {
  if (amount === 0) return "Free";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}
