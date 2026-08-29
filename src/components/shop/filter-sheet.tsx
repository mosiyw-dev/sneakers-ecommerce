"use client";

import * as React from "react";
import { FilterState } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  resultsCount: number;
}

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  onResetFilters,
  resultsCount,
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <SheetHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center justify-between pl-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <SheetTitle>فیلترهای پیشرفته</SheetTitle>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="h-3 w-3" />
            پاک کردن
          </button>
        </div>
      </SheetHeader>

      <SheetContent className="flex flex-col justify-between p-0 overflow-hidden text-right">
        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
          />
        </div>

        {/* Sticky Action Footer */}
        <div
          className="border-t border-border bg-card p-4 flex gap-3"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="rounded-2xl text-xs font-semibold px-4"
          >
            ریست
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            size="lg"
            className="flex-1 rounded-2xl text-xs sm:text-sm font-black shadow-md"
          >
            مشاهده {resultsCount} مدل کتونی
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
