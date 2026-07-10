export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
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
    return { ...defaultBilling(), ...JSON.parse(raw) };
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
  card: { brand: string; last4: string; expiry: string },
): PaymentMethod {
  const state = getBillingState(userKey);
  const method: PaymentMethod = {
    id: `pm-${Date.now()}`,
    ...card,
    isDefault: state.paymentMethods.length === 0,
  };
  saveBillingState(userKey, {
    ...state,
    paymentMethods: [...state.paymentMethods, method],
  });
  return method;
}

export function removePaymentMethod(userKey: string, methodId: string): void {
  const state = getBillingState(userKey);
  const methods = state.paymentMethods.filter((m) => m.id !== methodId);
  if (methods.length > 0 && !methods.some((m) => m.isDefault)) {
    methods[0] = { ...methods[0], isDefault: true };
  }
  saveBillingState(userKey, { ...state, paymentMethods: methods });
}
