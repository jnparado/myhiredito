export type PaymentProvider = "bank" | "stripe" | "paypal" | "wise";

export const PAYMENT_PROVIDERS: {
  id: PaymentProvider;
  label: string;
  hint: string;
}[] = [
  { id: "bank", label: "Bank", hint: "ACH transfer" },
  { id: "stripe", label: "Stripe", hint: "Card checkout" },
  { id: "paypal", label: "PayPal", hint: "PayPal email" },
  { id: "wise", label: "Wise", hint: "Wise email" },
];

export function paymentProviderLabel(id: PaymentProvider | "card"): string {
  if (id === "card") return "Card";
  return PAYMENT_PROVIDERS.find((item) => item.id === id)?.label ?? "Payment";
}
