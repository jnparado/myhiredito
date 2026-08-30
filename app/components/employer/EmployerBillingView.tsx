"use client";

import { useCallback } from "react";
import { StripeBankConnect } from "@/app/components/payments/StripeBankConnect";
import { useEmployerAuth } from "@/app/hooks/useEmployerAuth";
import { useEmployerBilling } from "@/app/hooks/useEmployerBilling";
import { useStripeBankReturn } from "@/app/hooks/useStripeBankReturn";
import { getEmployerEmail } from "@/app/lib/employerAuth";
import {
  addBankPaymentMethod,
  removePaymentMethod,
} from "@/app/lib/employerBilling";
import type { StripeBankDetails } from "@/app/lib/stripe/bank";

export function EmployerBillingView() {
  const { user } = useEmployerAuth();
  const { userKey, billing, loading } = useEmployerBilling();
  const email = user ? getEmployerEmail(user) : "";

  const handleBankConnected = useCallback(
    (bank: StripeBankDetails) => {
      if (!userKey) return;
      addBankPaymentMethod(userKey, bank);
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
          Pay hiring fees from a Stripe-connected bank account.
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
          <h2 className="text-sm font-bold text-zinc-900">Bank payment</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Connect a US bank account with Stripe for ACH payments.
          </p>
        </div>

        <div className="border-b border-zinc-100 px-5 py-4">
          {status === "saving" && (
            <p className="mb-3 text-sm text-zinc-500">
              Saving your Stripe bank account...
            </p>
          )}
          {status === "cancel" && (
            <p className="mb-3 text-sm text-amber-700">
              Stripe bank setup was canceled. You can try again below.
            </p>
          )}
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <StripeBankConnect
            role="employer"
            email={email}
            returnPath="/employer/billing"
            onConnected={handleBankConnected}
          />
        </div>

        {billing.paymentMethods.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-500">
            No bank account on file yet.
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
                    {method.brand} ···· {method.last4}
                    {method.isDefault && (
                      <span className="ml-2 text-[10px] font-bold uppercase text-[#1db954]">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {method.kind === "bank"
                      ? "ACH bank account · Stripe"
                      : `Expires ${method.expiry}`}
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
