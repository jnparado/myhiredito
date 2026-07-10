"use client";

import { useState } from "react";
import { authFieldClass, authLabelClass } from "@/app/components/auth/AuthShell";
import { useEmployerBilling } from "@/app/hooks/useEmployerBilling";
import {
  addPaymentMethod,
  removePaymentMethod,
} from "@/app/lib/employerBilling";

export function EmployerBillingView() {
  const { userKey, billing, loading } = useEmployerBilling();
  const [showAddCard, setShowAddCard] = useState(false);
  const [last4, setLast4] = useState("");
  const [expiry, setExpiry] = useState("");

  if (loading || !billing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading billing...
      </div>
    );
  }

  function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    if (!userKey || last4.length !== 4) return;
    addPaymentMethod(userKey, {
      brand: "Visa",
      last4,
      expiry,
    });
    setLast4("");
    setExpiry("");
    setShowAddCard(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1db954]">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your plan, payment methods, and invoices.
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
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
          <h2 className="text-sm font-bold text-zinc-900">Payment methods</h2>
          <button
            type="button"
            onClick={() => setShowAddCard((v) => !v)}
            className="text-xs font-bold text-[#1db954] hover:underline"
          >
            + Add card
          </button>
        </div>

        {showAddCard && (
          <form onSubmit={handleAddCard} className="border-b border-zinc-100 px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={authLabelClass}>Last 4 digits</label>
                <input
                  className={authFieldClass}
                  value={last4}
                  onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4242"
                  maxLength={4}
                  required
                />
              </div>
              <div>
                <label className={authLabelClass}>Expiry (MM/YY)</label>
                <input
                  className={authFieldClass}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="12/28"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-3 rounded-lg bg-[#1db954] px-4 py-2 text-sm font-bold text-white"
            >
              Save card
            </button>
          </form>
        )}

        {billing.paymentMethods.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-500">No payment methods on file.</p>
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
                  <p className="text-xs text-zinc-500">Expires {method.expiry}</p>
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
