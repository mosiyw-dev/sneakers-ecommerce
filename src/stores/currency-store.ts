"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CurrencyCode } from "@/types";
import { formatCurrency } from "@/lib/formatters";

interface CurrencyState {
  currency: CurrencyCode;
  hasHydrated: boolean;

  setCurrency: (code: CurrencyCode) => void;
  format: (amountUSD: number) => string;
  setHasHydrated: (state: boolean) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      setCurrency: (currency: CurrencyCode) => set({ currency }),

      format: (amountUSD: number) => {
        return formatCurrency(amountUSD, get().currency);
      },
    }),
    {
      name: "lumen-currency-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
