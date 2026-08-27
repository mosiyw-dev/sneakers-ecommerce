"use client";

import * as React from "react";
import { FilterState, CategorySlug } from "@/types";
import { CATEGORIES } from "@/data/categories";
import { BRANDS } from "@/data/products";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/stores/currency-store";
import {
  RotateCcw,
  Check,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}

const COLOR_FILTERS = [
  { name: "قرمز و سفید شیکاگو (Varsity Red)", hex: "#CE1141" },
  { name: "مشکی مات خالص", hex: "#18181B" },
  { name: "سفید و مشکی میلیتاری", hex: "#E5E7EB" },
  { name: "موکا قهوه‌ای و کرم (Reverse Mocha)", hex: "#78350F" },
  { name: "آبی دانشگاهی و سفید (UNC Blue)", hex: "#60A5FA" },
  { name: "مشکی و طلایی گرتیتود", hex: "#D4AF37" },
  { name: "آبی فیروزه‌ای کاکتوس جک", hex: "#38BDF8" },
  { name: "خاکستری دودی و سفید (Smoke Grey)", hex: "#9CA3AF" },
];

const SIZE_FILTERS = ["39", "40", "41", "42", "42.5", "43", "44", "44.5", "45"];

export function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
}: FilterSidebarProps) {
  const { format } = useCurrencyStore();

  const handleCategoryToggle = (slug: CategorySlug) => {
    const isAll = slug === "all";
    if (isAll) {
      onFilterChange({ ...filters, categories: ["all"], page: 1 });
      return;
    }

    let updated: CategorySlug[] = filters.categories.filter((c) => c !== "all");
    if (updated.includes(slug)) {
      updated = updated.filter((c) => c !== slug);
      if (updated.length === 0) updated = ["all"];
    } else {
      updated.push(slug);
    }
    onFilterChange({ ...filters, categories: updated, page: 1 });
  };

  const handleBrandToggle = (brand: string) => {
    let updated = [...filters.brands];
    if (updated.includes(brand)) {
      updated = updated.filter((b) => b !== brand);
    } else {
      updated.push(brand);
    }
    onFilterChange({ ...filters, brands: updated, page: 1 });
  };

  const handleColorToggle = (colorName: string) => {
    let updated = [...filters.colors];
    if (updated.includes(colorName)) {
      updated = updated.filter((c) => c !== colorName);
    } else {
      updated.push(colorName);
    }
    onFilterChange({ ...filters, colors: updated, page: 1 });
  };

  const handleSizeToggle = (size: string) => {
    let updated = [...filters.sizes];
    if (updated.includes(size)) {
      updated = updated.filter((s) => s !== size);
    } else {
      updated.push(size);
    }
    onFilterChange({ ...filters, sizes: updated, page: 1 });
  };

  return (
    <aside className="space-y-6 text-right" aria-label="فیلترهای کاتالوگ">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
          فیلترهای پیشرفته
        </h3>
        <Button
          variant="ghost"
          size="xs"
          onClick={onResetFilters}
          className="text-xs text-muted-foreground hover:text-foreground gap-1"
        >
          <RotateCcw className="h-3 w-3" /> پاک کردن همه
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-foreground">مدل و سری جردن</h4>
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs cursor-pointer text-muted-foreground hover:text-foreground">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.categories.includes("all")}
                onChange={() => handleCategoryToggle("all")}
                className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>همه کتونی‌ها</span>
            </span>
          </label>

          {CATEGORIES.map((cat) => {
            const isChecked = filters.categories.includes(cat.slug);
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between text-xs cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.slug)}
                    className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>{cat.name}</span>
                </span>
                <span className="text-[10px] text-muted-foreground/80 font-mono">
                  ({cat.itemCount})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between text-xs">
          <h4 className="font-bold text-foreground">محدوده قیمت</h4>
        </div>

        <Slider
          value={filters.priceRange}
          min={0}
          max={25000000}
          step={500000}
          onValueChange={(val) =>
            onFilterChange({
              ...filters,
              priceRange: val as [number, number],
              page: 1,
            })
          }
          className="py-2"
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>از {format(filters.priceRange[0])}</span>
          <span>تا {format(filters.priceRange[1])}</span>
        </div>
      </div>

      {/* Sneaker Size (EU) */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <h4 className="text-xs font-bold text-foreground">سایز کتونی (EU)</h4>
        <div className="grid grid-cols-3 gap-1.5 font-mono">
          {SIZE_FILTERS.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={cn(
                  "rounded-lg border py-1.5 text-xs font-semibold transition-all",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold"
                    : "border-border/80 bg-background text-foreground hover:bg-muted"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Swatches */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <h4 className="text-xs font-bold text-foreground">ترکیب رنگ</h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_FILTERS.map((color) => {
            const isSelected = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorToggle(color.name)}
                className={cn(
                  "relative h-6 w-6 rounded-full border-2 transition-all p-0.5 flex items-center justify-center",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 scale-110"
                    : "border-border hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && (
                  <Check
                    className={cn(
                      "h-3 w-3",
                      color.hex === "#FFFFFF" || color.hex === "#E5E7EB" || color.hex === "#F3F4F6"
                        ? "text-black"
                        : "text-white"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <h4 className="text-xs font-bold text-foreground">برند و لاین تولید</h4>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <h4 className="text-xs font-bold text-foreground">حداقل امتیاز رضایت</h4>
        <div className="space-y-1">
          {[4.9, 4.8, 4.5, 4.0].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minRating: filters.minRating === star ? 0 : star,
                  page: 1,
                })
              }
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs transition-colors",
                filters.minRating === star
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{star} ستاره به بالا</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggles */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <h4 className="text-xs font-bold text-foreground">وضعیت موجودی</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-muted-foreground">فقط کتونی‌های موجود در انبار</span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  inStockOnly: e.target.checked,
                  page: 1,
                })
              }
              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-muted-foreground">فقط محصولات دارای تخفیف</span>
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  onSaleOnly: e.target.checked,
                  page: 1,
                })
              }
              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
