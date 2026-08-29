"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Search,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useSearchStore } from "@/stores/search-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();

  const cartCount = isMounted ? totalItems : 0;
  const wishlistCount = isMounted ? wishlistItems.length : 0;

  const isHome = pathname === "/";
  const isWishlist = pathname === "/wishlist";
  const isCart = pathname === "/cart";
  const isPdp = pathname.startsWith("/products/") && pathname !== "/products";

  // Hide bottom nav on checkout, cart, and PDP to prevent stacked bars with dedicated sticky purchase/checkout bars
  if (pathname === "/checkout" || isCart || isPdp) {
    return null;
  }

  const navItems = [
    {
      id: "home",
      label: "خانه",
      href: "/",
      icon: Home,
      isActive: isHome,
      badge: 0,
    },
    {
      id: "catalog",
      label: "کاتالوگ",
      href: "/products",
      icon: Layers,
      isActive: pathname.startsWith("/products") || pathname.startsWith("/categories"),
      badge: 0,
    },
    {
      id: "search",
      label: "جستجو",
      onClick: openSearch,
      icon: Search,
      isActive: false,
      badge: 0,
    },
    {
      id: "wishlist",
      label: "علاقه‌مندی",
      href: "/wishlist",
      icon: Heart,
      isActive: isWishlist,
      badge: wishlistCount,
    },
    {
      id: "cart",
      label: "سبد خرید",
      href: "/cart",
      icon: ShoppingBag,
      isActive: isCart,
      badge: cartCount,
    },
  ];

  return (
    <nav
      aria-label="منوی ناوبری پایین صفحه"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 md:hidden",
        "border-t border-border/80 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/10 text-right"
      )}
      style={{
        paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0.35rem))",
      }}
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              className={cn(
                "relative flex flex-col items-center justify-center h-full w-full py-1 transition-colors select-none",
                item.isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              {/* Active Pill Indicator */}
              {item.isActive && (
                <motion.div
                  layoutId="mobile-nav-active-pill"
                  className="absolute inset-x-2.5 top-1 bottom-1 -z-10 rounded-2xl bg-primary/10 border border-primary/15"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    item.isActive && "scale-110",
                    item.id === "wishlist" && item.isActive && "fill-rose-500 text-rose-500"
                  )}
                />

                {/* Notification / Count Badge */}
                {item.badge > 0 && (
                  <AnimatePresence>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground font-mono shadow-xs"
                    >
                      {item.badge}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="flex items-center justify-center h-full w-full touch-target"
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              className="flex items-center justify-center h-full w-full touch-target"
              aria-label={item.label}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
