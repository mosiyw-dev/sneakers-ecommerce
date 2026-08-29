"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { Product, ProductColor } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { toast } from "@/stores/toast-store";
import { motion, AnimatePresence } from "framer-motion";

interface StickyMobileBuyBarProps {
  product: Product;
  selectedColor?: ProductColor;
  selectedSize?: string;
  quantity: number;
}

export function StickyMobileBuyBar({
  product,
  selectedColor,
  selectedSize,
  quantity,
}: StickyMobileBuyBarProps) {
  const { addItem, openDrawer } = useCartStore();
  const { format } = useCurrencyStore();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero / main buy box (approx 450px)
      setIsVisible(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    setIsAdded(true);
    toast.success("به سبد اضافه شد", `${product.name} به سبد خرید افزوده شد.`);
    openDrawer();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-45 md:hidden border-t border-border/80 bg-background/95 p-3 backdrop-blur-xl shadow-2xl text-right"
          style={{
            paddingBottom: "max(0.6rem, env(safe-area-inset-bottom, 0.6rem))",
          }}
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            {/* Product Micro Preview */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-foreground truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-black text-foreground font-mono">
                    {format(product.price)}
                  </span>
                  {selectedSize ? (
                    <span className="text-muted-foreground font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      EU {selectedSize}
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                      سایز پیش‌فرض
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="gap-1.5 rounded-xl text-xs font-black shadow-md shrink-0 h-11 px-4 active:scale-95 touch-target"
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  اضافه شد
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  افزودن به سبد
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
