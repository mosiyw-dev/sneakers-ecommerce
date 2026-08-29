"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  Heart,
  Menu,
  Sparkles,
  Share2,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useSearchStore } from "@/stores/search-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { totalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();

  const cartCount = isMounted ? totalItems : 0;
  const wishlistCount = isMounted ? wishlistItems.length : 0;

  const isHome = pathname === "/";
  const isCart = pathname === "/cart";
  const isCheckout = pathname === "/checkout";
  const isWishlist = pathname === "/wishlist";
  const isCatalog = pathname === "/products";
  const isCategory = pathname.startsWith("/categories");
  const isPdp = pathname.startsWith("/products/") && pathname !== "/products";
  const isOrder = pathname.startsWith("/orders");

  // Determine Title for Inner Pages
  const getPageTitle = () => {
    if (isCart) return "سبد خرید شما";
    if (isCheckout) return "تکمیل و تسویه سفارش";
    if (isWishlist) return "لیست علاقه‌مندی‌ها";
    if (isCatalog) return "کاتالوگ کتونی‌ها";
    if (isCategory) return "دسته‌بندی جردن";
    if (isPdp) return "مشخصات و خرید کتونی";
    if (isOrder) return "پیگیری وضعیت سفارش";
    return SITE_CONFIG.nameFa;
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/products");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("لینک صفحه کپی شد", "آدرس در حافظه موقت ذخیره گردید.");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full md:hidden transition-all duration-200 text-right",
        "border-b border-border/80 bg-background/92 backdrop-blur-xl shadow-2xs"
      )}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="flex h-14 items-center justify-between px-3.5 gap-2">
        {/* Right Section (Start in RTL): Logo OR Back Button */}
        {isHome ? (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted active:scale-95 transition-all touch-target"
              aria-label="منوی دسته‌بندی‌ها"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background font-black text-xs shadow-xs">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-foreground leading-tight">
                  {SITE_CONFIG.nameFa}
                </span>
                <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground leading-none">
                  JORDAN SNEAKERS
                </span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted active:scale-90 transition-all shrink-0 touch-target"
              aria-label="بازگشت به صفحه قبل"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <h1 className="text-xs sm:text-sm font-black text-foreground truncate min-w-0">
              {getPageTitle()}
            </h1>
          </div>
        )}

        {/* Left Section (End in RTL): Quick Search, Cart, Wishlist, Share */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Search trigger */}
          <button
            type="button"
            onClick={openSearch}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all touch-target"
            aria-label="جستجوی مدل کتونی"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* PDP-specific Share button */}
          {isPdp && (
            <button
              type="button"
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all touch-target"
              aria-label="اشتراک‌گذاری لینک کتونی"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          )}

          {/* Wishlist button for Home / Browse */}
          {!isPdp && !isCheckout && !isCart && (
            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all touch-target"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart
                className={cn(
                  "h-4.5 w-4.5",
                  isWishlist && "fill-rose-500 text-rose-500"
                )}
              />
              {wishlistCount > 0 && !isWishlist && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart button */}
          {!isCheckout && (
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted active:scale-95 transition-all touch-target"
              aria-label="مشاهده سبد خرید"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground font-mono shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
