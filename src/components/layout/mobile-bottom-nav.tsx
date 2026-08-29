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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SPRING_PRESS, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const shouldReduceMotion = useReducedMotion();
  const { totalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();

  const [isScrolledDown, setIsScrolledDown] = React.useState(false);
  const lastScrollY = React.useRef(0);

  // Subtle iOS-inspired scroll awareness: reduces visual weight slightly when scrolling down
  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > 60 && currentY > lastScrollY.current + 10) {
            setIsScrolledDown(true);
          } else if (currentY < lastScrollY.current - 10 || currentY <= 20) {
            setIsScrolledDown(false);
          }
          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none md:hidden px-3"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
      }}
    >
      <motion.nav
        initial={{ y: 30, opacity: 0, scale: 0.94 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: isScrolledDown ? 0.96 : 1,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 380, damping: 28 }
        }
        aria-label="داکت شناور Liquid Glass"
        className={cn(
          "pointer-events-auto relative flex h-[60px] w-full max-w-[356px] items-center justify-between px-2.5 rounded-full select-none",
          // iOS Liquid Glass: Adaptive translucent material with deep blur & saturation
          "bg-white/65 dark:bg-neutral-900/65",
          "backdrop-blur-2xl backdrop-saturate-[180%]",
          "-webkit-backdrop-blur-2xl",
          // Specular border & multi-depth shadow
          "border border-black/[0.08] dark:border-white/[0.12]",
          "shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12),0_4px_16px_-4px_rgba(0,0,0,0.06),inset_0_1px_1.5px_0_rgba(255,255,255,0.8),inset_0_-1px_1px_0_rgba(0,0,0,0.04)]",
          "dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),0_8px_20px_-5px_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.25),inset_0_-1px_1px_0_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Specular Liquid Top & Bottom Edge Reflections */}
        <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent" />
          <div className="absolute inset-x-6 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;

          const content = (
            <motion.div
              whileTap={{ scale: 0.88 }}
              transition={SPRING_PRESS}
              className={cn(
                "relative flex flex-col items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-full transition-colors duration-200",
                item.isActive
                  ? "text-neutral-950 dark:text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
              title={item.label}
              aria-label={item.label}
            >
              {/* Active Glass Highlight Lens (Liquid Glass nested element) */}
              {item.isActive && (
                <motion.span
                  layoutId="ios-liquid-dock-active"
                  transition={SPRING_LAYOUT}
                  className={cn(
                    "absolute inset-0 rounded-full -z-10",
                    "bg-black/[0.06] dark:bg-white/[0.14]",
                    "border border-black/[0.06] dark:border-white/[0.2]",
                    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.04)]",
                    "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.3)]",
                    "backdrop-blur-sm"
                  )}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-[19px] w-[19px] transition-transform duration-200",
                    item.isActive && "scale-105",
                    item.id === "wishlist" && item.isActive && "fill-rose-500 text-rose-500"
                  )}
                />

                {/* Ruby Notification Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <AnimatePresence>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8.5px] font-black text-white font-mono shadow-[0_2px_8px_rgba(244,63,94,0.6)] ring-1.5 ring-white dark:ring-neutral-900"
                    >
                      {item.badge}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>

              <span
                className={cn(
                  "text-[8.5px] tracking-tight mt-0.5 leading-none transition-all duration-200",
                  item.isActive ? "font-black" : "font-medium opacity-80"
                )}
              >
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
