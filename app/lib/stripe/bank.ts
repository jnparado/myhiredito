export type StripeBankDetails = {
  paymentMethodId: string;
  bankName: string;
  last4: string;
  accountHolder: string;
};

export type StripeBankRole = "worker" | "employer";
