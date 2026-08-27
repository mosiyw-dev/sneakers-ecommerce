"use client";

import { create } from "zustand";
import { Product } from "@/types";
import { toast } from "./toast-store";

interface CompareState {
  items: Product[];
  isOpen: boolean;

  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearCompare: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  isOpen: false,

  toggleCompare: (product) => {
    const { items } = get();
    const exists = items.some((p) => p.id === product.id);

    if (exists) {
      set({ items: items.filter((p) => p.id !== product.id) });
      toast.info("Removed from Compare", `${product.name} removed from comparison.`);
    } else {
      if (items.length >= 3) {
        toast.warning("Comparison Limit", "You can compare a maximum of 3 products at a time.");
        return;
      }
      set({ items: [...items, product] });
      toast.success("Added to Compare", `${product.name} added to comparison matrix.`);
    }
  },

  isInCompare: (productId) => {
    return get().items.some((p) => p.id === productId);
  },

  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((p) => p.id !== productId) }));
  },

  clearCompare: () => set({ items: [] }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
