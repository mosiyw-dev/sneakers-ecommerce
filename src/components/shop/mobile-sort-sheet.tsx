"use client";

import * as React from "react";
import { SortOption } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSortSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption; description: string }[] = [
  {
    label: "پیشنهاد ویژه و پرطرفدار",
    value: "featured",
    description: "محبوب‌ترین مدل‌های منتخب کلاب جردن",
  },
  {
    label: "جدیدترین مدل‌های ورودی",
    value: "newest",
    description: "تازه‌ترین کالکشن‌های ۲۰۲۶ نایک",
  },
  {
    label: "ارزان‌ترین به گران‌ترین",
    value: "price-low-to-high",
    description: "شروع از مناسب‌ترین قیمت",
  },
  {
    label: "گران‌ترین به ارزان‌ترین",
    value: "price-high-to-low",
    description: "نایاب‌ترین و کلکسیونی‌ترین مدل‌ها",
  },
  {
    label: "بالاترین امتیاز رضایت خریداران",
    value: "highest-rated",
    description: "بر اساس نظرات واقعی خریداران",
  },
];

export function MobileSortSheet({
  open,
  onOpenChange,
  sortBy,
  onSortChange,
}: MobileSortSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <SheetHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-primary" />
          <SheetTitle>مرتب‌سازی کتونی‌ها</SheetTitle>
        </div>
      </SheetHeader>

      <SheetContent className="p-4 space-y-2 text-right">
        {SORT_OPTIONS.map((option) => {
          const isSelected = sortBy === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSortChange(option.value);
                onOpenChange(false);
              }}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all touch-target text-right",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30 font-bold"
                  : "border-border/70 bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <div>
                <span className={cn("text-xs block", isSelected && "font-black text-foreground")}>
                  {option.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {option.description}
                </span>
              </div>

              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </SheetContent>
    </Sheet>
  );
}
