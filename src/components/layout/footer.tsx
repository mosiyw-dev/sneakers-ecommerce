"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowLeft,
  Home,
  Layers,
  Search,
  Heart,
  ShoppingBag,
  PackageCheck,
  Moon,
  Sun,
} from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Dock, type DockItemData } from "@/components/motion/dock";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useSearchStore } from "@/stores/search-store";
import { useTheme } from "@/components/ui/theme-provider";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function Footer() {
  const isMounted = useIsMounted();
  const { totalItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch } = useSearchStore();
  const { resolvedTheme, setTheme } = useTheme();

  const cartCount = isMounted ? totalItems : 0;
  const wishlistCount = isMounted ? wishlistItems.length : 0;

  const dockItems: DockItemData[] = [
    {
      id: "dock-home",
      label: "صفحه اصلی",
      icon: Home,
      href: "/",
    },
    {
      id: "dock-catalog",
      label: "کاتالوگ کتونی‌ها",
      icon: Layers,
      href: "/products",
    },
    {
      id: "dock-search",
      label: "جستجوی مدل",
      icon: Search,
      onClick: openSearch,
    },
    {
      id: "dock-wishlist",
      label: "علاقه‌مندی‌ها",
      icon: Heart,
      href: "/wishlist",
      badge: wishlistCount,
    },
    {
      id: "dock-cart",
      label: "سبد خرید",
      icon: ShoppingBag,
      onClick: openDrawer,
      badge: cartCount,
    },
    {
      id: "dock-orders",
      label: "پیگیری سفارش",
      icon: PackageCheck,
      href: "/cart",
    },
    {
      id: "dock-theme",
      label: isMounted && resolvedTheme === "dark" ? "حالت روشن" : "حالت تیره",
      icon: isMounted && resolvedTheme === "dark" ? Sun : Moon,
      onClick: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
  ];

  return (
    <footer className="border-t border-border bg-card/60 text-card-foreground pb-28 sm:pb-safe overflow-hidden">
      {/* Top Features / Trust Strip */}
      <div className="border-b border-border/80 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">ضمانت ۱۰۰٪ اصالت فیزیکی</h4>
                <p className="text-[11px] text-muted-foreground">تست بارکد و جعبه اورجینال نایک</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">ارسال رایگان و فوری</h4>
                <p className="text-[11px] text-muted-foreground">سراسر ایران برای مبالغ بالای ۳.۵ میلیون</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">۷ روز مهلت تعویض سایز</h4>
                <p className="text-[11px] text-muted-foreground">تعویض بی‌دغدغه و پشتیبانی سایز پا</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">مشاوره تخصصی کتونی</h4>
                <p className="text-[11px] text-muted-foreground">راهنمایی آنلاین انتخاب مدل و فیت</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* beUI Interactive Dock Showcase Section */}
      <div className="py-8 border-b border-border/70 bg-gradient-to-b from-muted/10 to-muted/40 flex flex-col items-center justify-center gap-3 px-4">
        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          دسترسی سریع • JORDAN CLUB DOCK
        </span>
        <Dock items={dockItems} className="max-w-fit mx-auto" />
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 text-right">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background font-black text-sm">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">
                {SITE_CONFIG.nameFa}
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-foreground block mb-1">
                عضویت در خبرنامه کلاب جردن (۱۰٪ تخفیف خرید اول)
              </span>
              <div className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید..."
                  className="h-9 flex-1 rounded-xl border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" className="rounded-xl text-xs font-bold gap-1">
                  عضویت <ArrowLeft className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Col 1: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              دسته‌بندی‌های محبوب
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {NAV_LINKS.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2: Services */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              خدمات مشتریان
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  جدول راهنمای سایز
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-foreground transition-colors">
                  علاقه‌مندی‌ها
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  روش‌های تشخیص اصالت
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3: About */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              درباره جردن کلاب
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  داستان برند
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  تماس با پشتیبانی
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  قوانین و حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.nameFa} (Jordan Club). تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4">
            <span>تهران، خیابان فرشته، بوتیک تخصصی اسنیکر</span>
            <span>تلفن پشتیبانی: ۰۲۱-۲۲۰۰۳۳۰۰</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
