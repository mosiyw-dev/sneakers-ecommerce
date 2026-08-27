"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  Sparkles,
} from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useSearchStore } from "@/stores/search-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CurrencySwitcher } from "./currency-switcher";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { LiquidGlassHeader } from "./liquid-glass-header";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global keydown for Cmd+K search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  const wishlistCount = isMounted ? wishlistItems.length : 0;
  const cartCount = isMounted ? totalItems : 0;

  return (
    <>
      {/* Mobile Floating Liquid Glass Header */}
      <LiquidGlassHeader onOpenMenu={() => setMobileMenuOpen(true)} />

      {/* Desktop Standard Navbar */}
      <header
        className={cn(
          "hidden md:block sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-border/80 bg-background/80 backdrop-blur-md shadow-xs"
            : "border-b border-transparent bg-background/60 backdrop-blur-xs"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Right (Start in RTL): Mobile Hamburger & Brand Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl"
            aria-label="منوی دسترسی"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo with Jumpman / Sneaker Icon */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background font-black text-sm tracking-tighter transition-transform duration-300 group-hover:scale-105 shadow-xs">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                {SITE_CONFIG.nameFa}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground leading-none hidden sm:block">
                JORDAN SNEAKERS
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links with beUI SharedLayoutBg */}
        <nav className="hidden lg:flex items-center">
          <SharedLayoutBg className="flex-row gap-1">
            {NAV_LINKS.slice(0, 5).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 text-xs font-bold transition-colors rounded-xl",
                    isActive ? "text-foreground font-black" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute inset-x-3.5 -bottom-1 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </SharedLayoutBg>
        </nav>

        {/* Left (End in RTL): Search trigger, Currency, Theme toggle, Wishlist, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search Button (Cmd+K) */}
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:border-foreground/30 hover:bg-muted transition-all"
            aria-label="جستجوی مدل کتونی"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">جستجوی جردن...</span>
            <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-border bg-background px-1 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          <CurrencySwitcher className="hidden sm:inline-block" />
          <ThemeToggle />

          {/* Wishlist Link */}
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground rounded-full"
              aria-label="لیست علاقه‌مندی‌ها"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart Trigger */}
          <Button
            variant="default"
            size="sm"
            onClick={openDrawer}
            className="relative gap-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-transform"
            aria-label="سبد خرید"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">سبد خرید</span>
            {cartCount > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-background text-[10px] font-black text-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>

    {/* Mobile Drawer Navigation */}
    <MobileNav
      open={mobileMenuOpen}
      onOpenChange={setMobileMenuOpen}
      links={NAV_LINKS}
    />
  </>
);
}
