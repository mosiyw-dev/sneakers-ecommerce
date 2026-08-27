"use client";

import * as React from "react";
import { Product, ViewMode } from "@/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  viewMode?: ViewMode;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  viewMode = "grid-4",
  emptyMessage = "No products found matching your active criteria.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-base font-semibold text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Try clearing some filters, widening the price range, or searching for broader terms.
        </p>
      </div>
    );
  }

  const gridClasses = {
    "grid-4": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    "grid-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
    "grid-2": "grid grid-cols-1 sm:grid-cols-2 gap-6",
    list: "flex flex-col gap-4",
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
