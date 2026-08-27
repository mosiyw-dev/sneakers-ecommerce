"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CurrencySwitcher } from "./currency-switcher";
import { Sparkles, ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: { name: string; href: string }[];
}

export function MobileNav({ open, onOpenChange, links }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <SheetHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background font-black text-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <SheetTitle>{SITE_CONFIG.nameFa}</SheetTitle>
        </div>
      </SheetHeader>

      <SheetContent className="flex flex-col justify-between py-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3">
              دسته‌بندی کتونی‌ها
            </span>
            <div className="flex flex-col space-y-1 mt-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{link.name}</span>
                    <ArrowLeft className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Drawer details */}
        <div className="border-t border-border pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">واحد پول:</span>
            <CurrencySwitcher />
          </div>
          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">ضمانت ۱۰۰٪ اصالت فیزیکی</p>
            <p className="text-[11px]">تمام کتونی‌ها با فاکتور و جعبه اورجینال ارسال می‌شوند.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
