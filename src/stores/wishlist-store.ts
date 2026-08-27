"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
  hasHydrated: boolean;

  // Actions
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((i) => i.id === product.id);

        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
          return false;
        } else {
          set({ items: [product, ...items] });
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "lumen-wishlist-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
