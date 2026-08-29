"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CurrencySwitcher } from "./currency-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sparkles, ArrowLeft, PackageCheck, Heart, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
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
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background font-black text-xs">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <SheetTitle>{SITE_CONFIG.nameFa}</SheetTitle>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              JORDAN CLUB
            </span>
          </div>
        </div>
      </SheetHeader>

      <SheetContent className="flex flex-col justify-between py-5 px-4 space-y-6 text-right">
        <div className="space-y-6">
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-primary px-3 block">
              کاتالوگ و کالکشن‌ها
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
                      "flex items-center justify-between rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold transition-all touch-target",
                      isActive
                        ? "bg-primary text-primary-foreground font-black shadow-xs"
                        : "text-foreground hover:bg-muted active:scale-98"
                    )}
                  >
                    <span>{link.name}</span>
                    <ArrowLeft className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Customer Service Links */}
          <div className="space-y-1 pt-2 border-t border-border/60">
            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground px-3 block">
              دسترسی سریع
            </span>
            <div className="space-y-1 mt-2">
              <Link
                href="/wishlist"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  لیست علاقه‌مندی‌ها
                </span>
                <ArrowLeft className="h-3.5 w-3.5 opacity-40" />
              </Link>

              <Link
                href="/cart"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  سبد خرید شما
                </span>
                <ArrowLeft className="h-3.5 w-3.5 opacity-40" />
              </Link>

              <Link
                href="/orders/track"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-emerald-500" />
                  استعلام و پیگیری سفارش
                </span>
                <ArrowLeft className="h-3.5 w-3.5 opacity-40" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Preferences & Trust */}
        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">واحد پولی:</span>
              <CurrencySwitcher />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">پوسته:</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="rounded-2xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>ضمانت ۱۰۰٪ اصالت فیزیکی کارخانه نایک</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>ارسال فوری رایگان سراسر کشور</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
