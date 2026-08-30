"use client";

import {
  PAYMENT_PROVIDERS,
  type PaymentProvider,
} from "@/app/lib/payments/providers";

type Props = {
  value: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
};

export function PaymentProviderPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PAYMENT_PROVIDERS.map((provider) => {
        const selected = value === provider.id;
        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => onChange(provider.id)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              selected
                ? "border-[#1db954] bg-[#1db954]/10 ring-1 ring-[#1db954]"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            }`}
            aria-pressed={selected}
          >
            <p className="text-sm font-bold text-zinc-900">{provider.label}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">{provider.hint}</p>
          </button>
        );
      })}
    </div>
  );
}
