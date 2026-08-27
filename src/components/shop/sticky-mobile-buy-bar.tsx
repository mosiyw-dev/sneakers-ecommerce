"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
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

  React.useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero / main buy box (approx 500px)
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    toast.success("به سبد اضافه شد", `${product.name} به سبد خرید افزوده شد.`);
    openDrawer();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-border bg-background/95 p-3 backdrop-blur-lg shadow-2xl text-right"
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
                <h4 className="text-xs font-bold text-foreground truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-foreground font-mono">
                    {format(product.price)}
                  </span>
                  {selectedSize && (
                    <span className="text-muted-foreground font-mono">
                      EU {selectedSize}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="gap-1.5 rounded-xl text-xs font-bold shadow-md shrink-0 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              افزودن به سبد
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
