"use client";

import * as React from "react";
import {
  LayoutGrid,
  Grid3X3,
  Grid2X2,
  List,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { SortOption, ViewMode } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortingBarProps {
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenMobileFilter: () => void;
  activeFilterCount: number;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "پیشنهاد ویژه و پرطرفدار", value: "featured" },
  { label: "جدیدترین مدل‌های جردن", value: "newest" },
  { label: "ارزان‌ترین به گران‌ترین", value: "price-low-to-high" },
  { label: "گران‌ترین به ارزان‌ترین", value: "price-high-to-low" },
  { label: "بالاترین امتیاز خریداران", value: "highest-rated" },
];

export function SortingBar({
  totalCount,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onOpenMobileFilter,
  activeFilterCount,
}: SortingBarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "مرتب‌سازی";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 text-right">
      {/* Product count & Mobile filter button */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMobileFilter}
          className="md:hidden gap-2 rounded-xl text-xs font-semibold"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>فیلترها</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold font-mono">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <span className="text-xs text-muted-foreground">
          نمایش <strong className="text-foreground font-mono">{totalCount}</strong> مدل کتونی اورجینال
        </span>
      </div>

      {/* Right controls: View mode & Sort Dropdown */}
      <div className="flex items-center gap-3">
        {/* View Mode Density Switcher (Desktop) */}
        <div className="hidden sm:flex items-center rounded-xl bg-muted/60 p-1 border border-border/80">
          <button
            onClick={() => onViewModeChange("grid-4")}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "grid-4"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="۴ ستونه"
            aria-label="۴ ستونه"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            onClick={() => onViewModeChange("grid-3")}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "grid-3"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="۳ ستونه"
            aria-label="۳ ستونه"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>

          <button
            onClick={() => onViewModeChange("grid-2")}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "grid-2"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="۲ ستونه بزرگ"
            aria-label="۲ ستونه بزرگ"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "list"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="نمایش لیستی"
            aria-label="نمایش لیستی"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span className="text-muted-foreground font-normal">مرتب‌سازی:</span>
            <span>{currentSortLabel}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-52 rounded-xl border border-border bg-card p-1 text-card-foreground shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150 text-right">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(option.value);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors text-right",
                    sortBy === option.value
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
