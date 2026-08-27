"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface RecentlyViewedState {
  items: Product[];
  hasHydrated: boolean;

  addProduct: (product: Product) => void;
  clearRecentlyViewed: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      addProduct: (product) => {
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id);
          return {
            items: [product, ...filtered].slice(0, 10), // Keep up to 10 most recent
          };
        });
      },

      clearRecentlyViewed: () => set({ items: [] }),
    }),
    {
      name: "lumen-recently-viewed-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
