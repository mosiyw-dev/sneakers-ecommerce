"use client";

import * as React from "react";
import { FilterState } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import { Button } from "@/components/ui/button";

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
        <SheetTitle>فیلترهای کاتالوگ کتونی ({resultsCount} مدل)</SheetTitle>
      </SheetHeader>

      <SheetContent className="flex flex-col justify-between p-0">
        <div className="flex-1 overflow-y-auto p-6">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
          />
        </div>

        <div className="border-t border-border bg-card p-4">
          <Button
            onClick={() => onOpenChange(false)}
            size="lg"
            className="w-full rounded-2xl text-xs sm:text-sm font-bold shadow-md"
          >
            مشاهده {resultsCount} مدل کتونی
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
