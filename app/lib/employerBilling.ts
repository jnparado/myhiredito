export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  kind: "card" | "bank";
  isDefault: boolean;
};

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
};

export type BillingState = {
  plan: string;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
};

const STORAGE_PREFIX = "myhiredito_employer_billing_";

function storageKey(userKey: string): string {
  return `${STORAGE_PREFIX}${userKey}`;
}

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("myhiredito-employer-billing"));
}

function defaultBilling(): BillingState {
  return {
    plan: "Starter — Pay per hire",
    paymentMethods: [],
    invoices: [
      {
        id: "inv-001",
        date: "2026-06-15",
        description: "Platform fee — June 2026",
        amount: 49,
        status: "paid",
      },
    ],
  };
}

export function getBillingState(userKey: string): BillingState {
  if (typeof window === "undefined") return defaultBilling();
  const raw = localStorage.getItem(storageKey(userKey));
  if (!raw) return defaultBilling();
  try {
    const parsed = JSON.parse(raw) as Partial<BillingState>;
    return {
      ...defaultBilling(),
      ...parsed,
      paymentMethods: (parsed.paymentMethods ?? []).map((method) => ({
        ...method,
        kind: method.kind ?? "card",
      })),
    };
  } catch {
    return defaultBilling();
  }
}

export function saveBillingState(userKey: string, state: BillingState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userKey), JSON.stringify(state));
  dispatchChange();
}

export function addPaymentMethod(
  userKey: string,
  card: { brand: string; last4: string; expiry: string; kind?: "card" | "bank"; id?: string },
): PaymentMethod {
  const state = getBillingState(userKey);
  const method: PaymentMethod = {
    id: card.id ?? `pm-${Date.now()}`,
    brand: card.brand,
    last4: card.last4,
    expiry: card.expiry,
    kind: card.kind ?? "card",
    isDefault: state.paymentMethods.length === 0,
  };
  const methods = state.paymentMethods.filter((item) => item.id !== method.id);
  saveBillingState(userKey, {
    ...state,
    paymentMethods: [...methods, method],
  });
  return method;
}

export function addBankPaymentMethod(
  userKey: string,
  bank: { paymentMethodId: string; bankName: string; last4: string },
): PaymentMethod {
  return addPaymentMethod(userKey, {
    id: bank.paymentMethodId,
    brand: bank.bankName,
    last4: bank.last4,
    expiry: "",
    kind: "bank",
  });
}

export function removePaymentMethod(userKey: string, methodId: string): void {
  const state = getBillingState(userKey);
  const methods = state.paymentMethods.filter((m) => m.id !== methodId);
  if (methods.length > 0 && !methods.some((m) => m.isDefault)) {
    methods[0] = { ...methods[0], isDefault: true };
  }
  saveBillingState(userKey, { ...state, paymentMethods: methods });
}
