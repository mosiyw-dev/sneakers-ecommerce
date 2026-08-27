"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  companionProducts: Product[];
}

export function FrequentlyBoughtTogether({
  currentProduct,
  companionProducts,
}: FrequentlyBoughtTogetherProps) {
  const { addItem, openDrawer } = useCartStore();
  const { format } = useCurrencyStore();

  const bundleCandidates = React.useMemo(() => {
    return [currentProduct, ...companionProducts.slice(0, 2)];
  }, [currentProduct, companionProducts]);

  const [selectedIds, setSelectedIds] = React.useState<string[]>(() =>
    bundleCandidates.map((p) => p.id)
  );

  const toggleProduct = (id: string) => {
    if (id === currentProduct.id) return; // Keep primary product selected
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = bundleCandidates.filter((p) =>
    selectedIds.includes(p.id)
  );

  const rawTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscountRate = selectedProducts.length >= 2 ? 0.1 : 0; // 10% bundle discount
  const bundleSavings = Math.round(rawTotal * bundleDiscountRate);
  const finalBundleTotal = rawTotal - bundleSavings;

  const handleAddBundle = () => {
    selectedProducts.forEach((product) => {
      addItem(product, 1);
    });
    toast.success(
      "پک کامل به سبد اضافه شد",
      `${selectedProducts.length} مدل با ۱۰٪ تخفیف پک به سبد خرید اضافه شد.`
    );
    openDrawer();
  };

  if (companionProducts.length === 0) return null;

  return (
    <div className="rounded-3xl border border-border/80 bg-muted/20 p-6 sm:p-8 space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="success">معمولاً با هم خریده می‌شوند</Badge>
          <span className="text-xs font-semibold text-muted-foreground">
            پک ست کلکسیونی
          </span>
        </div>
        {bundleSavings > 0 && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            ۱۰٪ تخفیف ویژه خرید همزمان پک
          </span>
        )}
      </div>

      {/* Visual Product Lineup */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {bundleCandidates.map((product, idx) => {
          const isSelected = selectedIds.includes(product.id);
          const isPrimary = product.id === currentProduct.id;

          return (
            <React.Fragment key={product.id}>
              <div
                onClick={() => !isPrimary && toggleProduct(product.id)}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl border p-3 transition-all select-none w-32 sm:w-36 text-center",
                  isSelected
                    ? "border-primary bg-card shadow-xs"
                    : "border-border/60 bg-muted/40 opacity-50",
                  !isPrimary && "cursor-pointer hover:border-border"
                )}
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted mb-2">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <Link
                  href={`/products/${product.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold text-foreground hover:text-primary transition-colors line-clamp-1 block"
                >
                  {product.name}
                </Link>
                <span className="text-xs font-semibold text-foreground font-mono mt-0.5">
                  {format(product.price)}
                </span>
              </div>

              {idx < bundleCandidates.length - 1 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <Plus className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Checkbox List & Bundle Action CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-border/60">
        <div className="space-y-2">
          {bundleCandidates.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const isPrimary = product.id === currentProduct.id;

            return (
              <label
                key={product.id}
                className={cn(
                  "flex items-center gap-2.5 text-xs select-none",
                  isPrimary ? "cursor-default text-foreground font-semibold" : "cursor-pointer text-muted-foreground hover:text-foreground"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isPrimary}
                  onChange={() => toggleProduct(product.id)}
                  className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>
                  <strong>{product.name}</strong> ({format(product.price)})
                  {isPrimary && " — این کتونی"}
                </span>
              </label>
            );
          })}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center gap-4 text-left">
          <div>
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-lg sm:text-xl font-black text-foreground font-mono">
                {format(finalBundleTotal)}
              </span>
              {bundleSavings > 0 && (
                <span className="text-xs text-muted-foreground line-through font-mono">
                  {format(rawTotal)}
                </span>
              )}
            </div>
            {bundleSavings > 0 && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                شما {format(bundleSavings)} تخفیف می‌گیرید
              </p>
            )}
          </div>

          <Button
            onClick={handleAddBundle}
            size="lg"
            className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all"
          >
            <ShoppingBag className="h-4 w-4" /> خرید پک ({selectedProducts.length} جفت)
          </Button>
        </div>
      </div>
    </div>
  );
}
