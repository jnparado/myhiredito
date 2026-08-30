"use client";

import { useCallback, useState } from "react";
import { PaymentProviderPicker } from "@/app/components/payments/PaymentProviderPicker";
import { StripeBankConnect } from "@/app/components/payments/StripeBankConnect";
import { WalletConnectForm } from "@/app/components/payments/WalletConnectForm";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerBilling } from "@/app/hooks/useEmployerBilling";
import { useStripeBankReturn } from "@/app/hooks/useStripeBankReturn";
import { getEmployerEmail } from "@/app/lib/employerAuth";
import {
  addBankPaymentMethod,
  addWalletPaymentMethod,
  removePaymentMethod,
} from "@/app/lib/employerBilling";
import { paymentProviderLabel, type PaymentProvider } from "@/app/lib/payments/providers";
import type { StripeBankDetails } from "@/app/lib/stripe/bank";

export function EmployerBillingView() {
  const { user } = useEmployerAuth();
  const { userKey, billing, loading } = useEmployerBilling();
  const email = user ? getEmployerEmail(user) : "";
  const [provider, setProvider] = useState<PaymentProvider>("bank");

  const handleBankConnected = useCallback(
    (bank: StripeBankDetails) => {
      if (!userKey) return;
      addBankPaymentMethod(userKey, {
        ...bank,
        kind: bank.kind === "stripe" ? "stripe" : "bank",
      });
    },
    [userKey],
  );

  const { status, error } = useStripeBankReturn(handleBankConnected);

  if (loading || !billing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading billing...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Choose Bank, Stripe, PayPal, or Wise to pay hiring fees.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Current plan
        </p>
        <p className="mt-1 text-lg font-bold text-zinc-900">{billing.plan}</p>
        <p className="mt-1 text-sm text-zinc-500">
          Pay only when you hire — no monthly minimum.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-3">
          <h2 className="text-sm font-bold text-zinc-900">Payment method</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Pick one option, then connect it.
          </p>
        </div>

        <div className="space-y-4 border-b border-zinc-100 px-5 py-4">
          <PaymentProviderPicker value={provider} onChange={setProvider} />

          {status === "saving" && (
            <p className="text-sm text-zinc-500">Saving your payment method...</p>
          )}
          {status === "cancel" && (
            <p className="text-sm text-amber-700">
              Setup was canceled. You can try again below.
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {provider === "bank" && (
            <StripeBankConnect
              role="employer"
              email={email}
              returnPath="/employer/billing"
              method="bank"
              onConnected={handleBankConnected}
            />
          )}
          {provider === "stripe" && (
            <StripeBankConnect
              role="employer"
              email={email}
              returnPath="/employer/billing"
              method="card"
              onConnected={handleBankConnected}
            />
          )}
          {(provider === "paypal" || provider === "wise") && (
            <WalletConnectForm
              provider={provider}
              defaultEmail={email}
              onSave={(handle) => {
                if (!userKey) return;
                addWalletPaymentMethod(userKey, { provider, handle });
              }}
            />
          )}
        </div>

        {billing.paymentMethods.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-500">
            No payment method on file yet.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {billing.paymentMethods.map((method) => (
              <li
                key={method.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-800">
                    {method.brand}
                    {method.last4 ? ` ···· ${method.last4}` : ""}
                    {method.isDefault && (
                      <span className="ml-2 text-[10px] font-bold uppercase text-[#1db954]">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {method.handle
                      ? method.handle
                      : method.kind === "bank"
                        ? "Bank ACH"
                        : method.kind === "stripe"
                          ? "Stripe card"
                          : paymentProviderLabel(method.kind)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => userKey && removePaymentMethod(userKey, method.id)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-3">
          <h2 className="text-sm font-bold text-zinc-900">Invoices</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {billing.invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-800">
                  {invoice.description}
                </p>
                <p className="text-xs text-zinc-500">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900">
                  ${invoice.amount.toFixed(2)}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase ${
                    invoice.status === "paid"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {invoice.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
