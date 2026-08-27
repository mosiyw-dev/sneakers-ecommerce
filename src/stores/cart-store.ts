"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartSummary, Product, ProductColor, PromoCode } from "@/types";
import { PROMO_CODES, SHIPPING_OPTIONS } from "@/data/shipping-options";
import { SITE_CONFIG } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  appliedPromo: PromoCode | null;
  isDrawerOpen: boolean;
  hasHydrated: boolean;
  totalItems: number;

  // Actions
  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: ProductColor,
    selectedSize?: string
  ) => void;
  removeItem: (itemId: string) => CartItem | undefined;
  restoreItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string | PromoCode) => { success: boolean; message: string };
  removePromoCode: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setHasHydrated: (state: boolean) => void;

  // Computations
  getSummary: (shippingOptionId?: string) => CartSummary;
  getItemCount: () => number;
}

function generateItemId(
  productId: string,
  color?: ProductColor,
  size?: string
): string {
  const colorPart = color ? color.name.toLowerCase().replace(/\s+/g, "-") : "default";
  const sizePart = size ? size.toLowerCase().replace(/\s+/g, "-") : "default";
  return `${productId}-${colorPart}-${sizePart}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,
      isDrawerOpen: false,
      hasHydrated: false,
      totalItems: 0,

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (product, quantity = 1, selectedColor, selectedSize) => {
        const { items } = get();
        const itemId = generateItemId(product.id, selectedColor, selectedSize);
        const existingIndex = items.findIndex((i) => i.id === itemId);

        let updatedItems: CartItem[];

        if (existingIndex > -1) {
          updatedItems = items.map((item, idx) => {
            if (idx === existingIndex) {
              const newQty = Math.min(item.quantity + quantity, product.stock);
              return { ...item, quantity: newQty };
            }
            return item;
          });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product,
            selectedColor,
            selectedSize: selectedSize || product.sizes?.[0] || "42",
            quantity: Math.min(quantity, product.stock),
            price: product.price,
            addedAt: Date.now(),
          };
          updatedItems = [newItem, ...items];
        }

        const totalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ items: updatedItems, totalItems: totalCount });
      },

      removeItem: (itemId: string) => {
        const { items } = get();
        const itemToRemove = items.find((i) => i.id === itemId);
        const updated = items.filter((i) => i.id !== itemId);
        const totalCount = updated.reduce((sum, item) => sum + item.quantity, 0);
        set({ items: updated, totalItems: totalCount });
        return itemToRemove;
      },

      restoreItem: (item: CartItem) => {
        const { items } = get();
        const updated = [item, ...items];
        const totalCount = updated.reduce((sum, item) => sum + item.quantity, 0);
        set({ items: updated, totalItems: totalCount });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const updated = items.map((item) => {
          if (item.id === itemId) {
            const validQty = Math.min(
              Math.max(1, quantity),
              item.product.stock
            );
            return { ...item, quantity: validQty };
          }
          return item;
        });

        const totalCount = updated.reduce((sum, item) => sum + item.quantity, 0);
        set({ items: updated, totalItems: totalCount });
      },

      clearCart: () => set({ items: [], appliedPromo: null, totalItems: 0 }),

      applyPromoCode: (codeOrPromo: string | PromoCode) => {
        let found: PromoCode | undefined;

        if (typeof codeOrPromo === "string") {
          const codeUpper = codeOrPromo.trim().toUpperCase();
          found = PROMO_CODES.find((p) => p.code === codeUpper);
        } else {
          found = codeOrPromo;
        }

        if (!found) {
          return {
            success: false,
            message: "کد تخفیف وارد شده معتبر نیست.",
          };
        }

        const { items } = get();
        const subtotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        if (found.minSubtotal && subtotal < found.minSubtotal) {
          return {
            success: false,
            message: `حداقل مبلغ سفارش برای این کد تخفیف ${found.minSubtotal.toLocaleString("fa-IR")} تومان است.`,
          };
        }

        set({ appliedPromo: found });
        return {
          success: true,
          message: `کد تخفیف ${found.code} اعمال شد: ${found.description}`,
        };
      },

      removePromoCode: () => set({ appliedPromo: null }),

      getSummary: (shippingOptionId = "standard") => {
        const { items, appliedPromo } = get();

        const subtotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

        let discountAmount = 0;
        if (appliedPromo) {
          if (appliedPromo.discountType === "percentage") {
            discountAmount = (subtotal * appliedPromo.discountValue) / 100;
          } else {
            discountAmount = Math.min(appliedPromo.discountValue, subtotal);
          }
        }

        const freeThreshold = SITE_CONFIG.freeShippingThreshold;
        const remainingForFreeShipping = Math.max(0, freeThreshold - subtotal);
        const freeShippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

        const selectedOption =
          SHIPPING_OPTIONS.find((s) => s.id === shippingOptionId) ||
          SHIPPING_OPTIONS[0];

        let shippingAmount = selectedOption.price;
        if (selectedOption.freeAbove && subtotal >= selectedOption.freeAbove) {
          shippingAmount = 0;
        }

        const taxableAmount = Math.max(0, subtotal - discountAmount);
        const taxAmount = 0;
        const total = Math.max(0, taxableAmount + shippingAmount);

        return {
          subtotal,
          discountAmount,
          appliedPromo: appliedPromo || undefined,
          shippingAmount,
          taxAmount,
          total,
          itemCount,
          freeShippingProgress,
          freeShippingThreshold: freeThreshold,
          remainingForFreeShipping,
        };
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "jordan-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.items) {
          state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
        }
      },
    }
  )
);
