"use client";

import * as React from "react";
import { X, RotateCcw } from "lucide-react";
import { FilterState, CategorySlug } from "@/types";
import { CATEGORIES } from "@/data/categories";
import { useCurrencyStore } from "@/stores/currency-store";

interface ActiveFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export function ActiveFilters({
  filters,
  onFilterChange,
  onResetFilters,
}: ActiveFiltersProps) {
  const { format } = useCurrencyStore();

  const hasNonDefaultCategories =
    filters.categories.length > 0 && !filters.categories.includes("all");
  const hasCustomPrice =
    filters.priceRange[0] > 0 || filters.priceRange[1] < 25000000;
  const hasRating = filters.minRating > 0;
  const hasInStock = filters.inStockOnly;
  const hasOnSale = filters.onSaleOnly;
  const hasSearch = filters.searchQuery.trim().length > 0;

  const totalActive =
    (hasNonDefaultCategories ? filters.categories.length : 0) +
    filters.brands.length +
    (hasCustomPrice ? 1 : 0) +
    filters.colors.length +
    filters.sizes.length +
    (hasRating ? 1 : 0) +
    (hasInStock ? 1 : 0) +
    (hasOnSale ? 1 : 0) +
    (hasSearch ? 1 : 0);

  if (totalActive === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 text-right">
      <span className="text-xs font-semibold text-muted-foreground ml-1">
        فیلترهای فعال:
      </span>

      {/* Search Query Chip */}
      {hasSearch && (
        <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          جستجو: «{filters.searchQuery}»
          <button
            onClick={() => onFilterChange({ ...filters, searchQuery: "", page: 1 })}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Categories Chips */}
      {hasNonDefaultCategories &&
        filters.categories.map((catSlug) => {
          const cat = CATEGORIES.find((c) => c.slug === catSlug);
          return (
            <span
              key={catSlug}
              className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
            >
              مدل: {cat?.name || catSlug}
              <button
                onClick={() => {
                  const updated: CategorySlug[] = filters.categories.filter((c) => c !== catSlug);
                  onFilterChange({
                    ...filters,
                    categories: updated.length === 0 ? ["all"] : updated,
                    page: 1,
                  });
                }}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}

      {/* Brand Chips */}
      {filters.brands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
        >
          برند: {brand}
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                brands: filters.brands.filter((b) => b !== brand),
                page: 1,
              })
            }
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Price Chip */}
      {hasCustomPrice && (
        <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground font-mono">
          قیمت: {format(filters.priceRange[0])} تا {format(filters.priceRange[1])}
          <button
            onClick={() =>
              onFilterChange({ ...filters, priceRange: [0, 25000000], page: 1 })
            }
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Size Chips */}
      {filters.sizes.map((size) => (
        <span
          key={size}
          className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground font-mono"
        >
          سایز: EU {size}
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                sizes: filters.sizes.filter((s) => s !== size),
                page: 1,
              })
            }
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* In-Stock Chip */}
      {hasInStock && (
        <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          فقط موجود در انبار
          <button
            onClick={() => onFilterChange({ ...filters, inStockOnly: false, page: 1 })}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* On-Sale Chip */}
      {hasOnSale && (
        <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          دارای تخفیف
          <button
            onClick={() => onFilterChange({ ...filters, onSaleOnly: false, page: 1 })}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Clear All */}
      <button
        onClick={onResetFilters}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive mr-2 underline underline-offset-4"
      >
        <RotateCcw className="h-3 w-3" /> حذف همه فیلترها
      </button>
    </div>
  );
}
