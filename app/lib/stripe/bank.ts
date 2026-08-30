export type StripeBankDetails = {
  paymentMethodId: string;
  bankName: string;
  last4: string;
  accountHolder: string;
  kind?: "bank" | "stripe";
};

export type StripeBankRole = "worker" | "employer";
export type StripeCheckoutMethod = "bank" | "card";
