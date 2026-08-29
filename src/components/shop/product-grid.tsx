"use client";

import * as React from "react";
import { Product, ViewMode } from "@/types";
import { ProductCard } from "./product-card";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  viewMode?: ViewMode;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  viewMode = "grid-4",
  emptyMessage = "هیچ کتونی با مشخصات انتخابی شما یافت نشد.",
  onResetFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-8 sm:p-12 text-center text-right">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <p className="text-sm sm:text-base font-bold text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
          می‌توانید فیلترهای اعمال‌شده، بازه قیمت یا سایزهای انتخابی را پاک نمایید تا همه مدل‌ها نمایش داده شوند.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs active:scale-95 transition-all"
          >
            پاک کردن همه فیلترها
          </button>
        )}
      </div>
    );
  }

  const gridClasses = {
    "grid-4": "grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6",
    "grid-3": "grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6",
    "grid-2": "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
    list: "flex flex-col gap-3 sm:gap-4",
  };

  return (
    <div className={cn(gridClasses[viewMode])}>
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
