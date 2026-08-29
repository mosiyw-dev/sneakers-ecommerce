"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Search,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useSearchStore } from "@/stores/search-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_PRESS, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

interface LiquidGlassHeaderProps {
  onOpenMenu: () => void;
}

export function LiquidGlassHeader({ onOpenMenu }: LiquidGlassHeaderProps) {
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();

  const isHome = pathname === "/";
  const isProducts = pathname.startsWith("/products") || pathname.startsWith("/categories");
  const isWishlist = pathname === "/wishlist";
  const cartCount = isMounted ? totalItems : 0;
  const wishlistCount = isMounted ? wishlistItems.length : 0;

  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        aria-label="منوی شناور شیشه‌ای"
        className={cn(
          "pointer-events-auto relative flex h-14 w-full max-w-[360px] items-center justify-between px-2.5 rounded-full select-none",
          // Liquid Glass styling
          "bg-neutral-950/80 dark:bg-neutral-900/85 backdrop-blur-2xl text-white",
          "border border-white/20 dark:border-white/15",
          "shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.4)]"
        )}
      >
        {/* Subtle Liquid Traveling Reflection */}
        <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* 1. Explore / Home Icon (Active Circular Pill like reference image) */}
        <Link href="/" className="relative">
          <motion.div
            whileTap={{ scale: 0.88 }}
            transition={SPRING_PRESS}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
              isHome
                ? "bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            title="صفحه اصلی"
            aria-label="صفحه اصلی"
          >
            {isHome ? (
              <motion.span
                layoutId="liquid-active-pill"
                transition={SPRING_LAYOUT}
                className="absolute inset-0 rounded-full bg-white/15 border border-white/20 -z-10 shadow-inner"
              />
            ) : null}
            <Sparkles className="h-5 w-5 text-amber-400" />
          </motion.div>
        </Link>

        {/* 2. Categories / Catalog */}
        <Link href="/products" className="relative">
          <motion.div
            whileTap={{ scale: 0.88 }}
            transition={SPRING_PRESS}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
              isProducts
                ? "bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            title="کاتالوگ و دسته‌بندی‌ها"
            aria-label="کاتالوگ و دسته‌بندی‌ها"
          >
            {isProducts ? (
              <motion.span
                layoutId="liquid-active-pill"
                transition={SPRING_LAYOUT}
                className="absolute inset-0 rounded-full bg-white/15 border border-white/20 -z-10 shadow-inner"
              />
            ) : null}
            <Layers className="h-5 w-5" />
          </motion.div>
        </Link>

        {/* 3. Search Trigger (Cmd+K modal) */}
        <motion.button
          type="button"
          onClick={openSearch}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_PRESS}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="جستجوی مدل کتونی"
          aria-label="جستجوی مدل کتونی"
        >
          <Search className="h-5 w-5" />
        </motion.button>

        {/* 4. Wishlist */}
        <Link href="/wishlist" className="relative">
          <motion.div
            whileTap={{ scale: 0.88 }}
            transition={SPRING_PRESS}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
              isWishlist
                ? "bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            title="علاقه‌مندی‌ها"
            aria-label="علاقه‌مندی‌ها"
          >
            {isWishlist ? (
              <motion.span
                layoutId="liquid-active-pill"
                transition={SPRING_LAYOUT}
                className="absolute inset-0 rounded-full bg-white/15 border border-white/20 -z-10 shadow-inner"
              />
            ) : null}
            <Heart className={cn("h-5 w-5", isWishlist && "fill-rose-500 text-rose-500")} />
            {wishlistCount > 0 && !isWishlist && (
              <span className="absolute 1 top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-neutral-950" />
            )}
          </motion.div>
        </Link>

        {/* 5. Cart / Notification (With Glowing Red Badge exactly as in photo) */}
        <motion.button
          type="button"
          onClick={openDrawer}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_PRESS}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="سبد خرید"
          aria-label="سبد خرید"
        >
          <ShoppingBag className="h-5 w-5" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-black text-white shadow-[0_2px_8px_rgba(244,63,94,0.6)] ring-2 ring-neutral-950"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 6. Settings / Drawer Menu */}
        <motion.button
          type="button"
          onClick={onOpenMenu}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_PRESS}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="تنظیمات و دسته‌بندی‌ها"
          aria-label="تنظیمات و دسته‌بندی‌ها"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </motion.button>
      </motion.nav>
    </div>
  );
}
