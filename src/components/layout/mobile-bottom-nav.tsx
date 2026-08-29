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
import { SPRING_PRESS, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { totalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();

  const cartCount = isMounted ? totalItems : 0;
  const wishlistCount = isMounted ? wishlistItems.length : 0;

  const isHome = pathname === "/";
  const isCatalog =
    pathname.startsWith("/products") || pathname.startsWith("/categories");
  const isWishlist = pathname === "/wishlist";
  const isCart = pathname === "/cart";
  const isPdp = pathname.startsWith("/products/") && pathname !== "/products";

  // Hide floating dock on checkout, cart page, and PDP to prevent collision with dedicated purchase/checkout bars
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
      isActive: isCatalog,
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
      onClick: openDrawer,
      icon: ShoppingBag,
      isActive: false,
      badge: cartCount,
    },
  ];

  return (
    <div
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none md:hidden px-4"
      style={{
        bottom: "max(0.85rem, env(safe-area-inset-bottom, 0.85rem))",
      }}
    >
      <motion.nav
        initial={{ y: 24, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        aria-label="داکت شناور شیشه‌ای"
        className={cn(
          "pointer-events-auto relative flex h-16 w-full max-w-[360px] items-center justify-between px-3 rounded-full select-none",
          // Futuristic iOS 27 Liquid Glass Styling
          "bg-neutral-950/85 dark:bg-neutral-900/85 backdrop-blur-3xl text-white",
          "border border-white/20 dark:border-white/15",
          "shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Specular Liquid Edge Reflections */}
        <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="absolute inset-x-6 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;

          const content = (
            <motion.div
              whileTap={{ scale: 0.86 }}
              transition={SPRING_PRESS}
              className={cn(
                "relative flex flex-col items-center justify-center h-12 w-12 rounded-full transition-all duration-300",
                item.isActive
                  ? "text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              title={item.label}
              aria-label={item.label}
            >
              {/* Active Circular Frosted Pill Indicator */}
              {item.isActive && (
                <motion.span
                  layoutId="floating-liquid-dock-pill"
                  transition={SPRING_LAYOUT}
                  className="absolute inset-0 rounded-full bg-white/20 border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] -z-10"
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

                {/* Glowing Ruby Notification Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <AnimatePresence>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-1.5 -right-2.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white font-mono shadow-[0_2px_10px_rgba(244,63,94,0.7)] ring-2 ring-neutral-950"
                    >
                      {item.badge}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>

              <span className="text-[9px] tracking-tight mt-0.5 font-bold leading-none">
                {item.label}
              </span>
            </motion.div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="flex items-center justify-center focus:outline-none touch-target"
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
              className="flex items-center justify-center focus:outline-none touch-target"
              aria-label={item.label}
            >
              {content}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
