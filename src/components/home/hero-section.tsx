"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { ChromaticTextReveal } from "@/components/motion/chromatic-text-reveal";
import { ExpandingArrowButton } from "@/components/motion/expanding-arrow-button";
import { MetallicButton } from "@/components/motion/button/metallic";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { toast } from "@/stores/toast-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const HERO_SNEAKERS = [
  {
    product: PRODUCTS[0], // AJ1 Chicago Lost & Found
    tag: "۱۹۸۵ Chicago OG",
    glowColor: "rgba(225, 29, 72, 0.4)",
    badgeText: "کمیاب‌ترین جردن سال",
  },
  {
    product: PRODUCTS[1], // AJ4 Military Black
    tag: "Jordan 4 Retro",
    glowColor: "rgba(59, 130, 246, 0.4)",
    badgeText: "ترند برتر استریت‌ویر",
  },
  {
    product: PRODUCTS[2], // AJ1 Low Travis Scott Reverse Mocha
    tag: "Cactus Jack Edition",
    glowColor: "rgba(217, 119, 6, 0.4)",
    badgeText: "همکاری ترویس اسکات",
  },
];

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const activeHero = HERO_SNEAKERS[selectedIndex];
  const { addItem, openDrawer } = useCartStore();
  const { format } = useCurrencyStore();

  const handleHeroQuickAdd = () => {
    addItem(activeHero.product, 1);
    toast.success(
      "به سبد اضافه شد",
      `${activeHero.product.name} با موفقیت به سبد افزوده شد.`
    );
    openDrawer();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 text-right">
      {/* Subtle Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/3 -z-10 h-[500px] w-[500px] rounded-full blur-[100px] transition-all duration-1000 opacity-50 dark:opacity-70"
        style={{
          background: `radial-gradient(circle, ${activeHero.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Right Column (Start in RTL): Clean & Bold Typography */}
          <div className="lg:col-span-7 space-y-6">
            {/* Minimal Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-bold text-foreground/80 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>کالکشن ۲۰۲۶ کتونی‌های اورجینال ایر جردن</span>
            </div>

            {/* Giant Dynamic Headline */}
            <div className="space-y-2.5">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.15]">
                اسطوره‌ای فراتر از زمان. <br />
                <ChromaticTextReveal
                  prefix="شاهکار"
                  words={["ایر جردن ۱", "جردن ۴ رترو", "ترویس اسکات", "شیکاگو ۱۹۸۵"]}
                  className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight"
                />
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg pt-1">
                مرجع معتبر نایاب‌ترین مدل‌های ایر جردن با ضمانت ۱۰۰٪ اصالت فیزیکی، جعبه اورجینال کارخانه نایک و پرو رایگان در محل.
              </p>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link href="/products">
                <ExpandingArrowButton accentClassName="bg-primary text-primary-foreground">
                  مشاهده کاتالوگ
                </ExpandingArrowButton>
              </Link>

              <Link href="/categories/travis-scott">
                <MetallicButton size="xl" className="gap-2">
                  <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                  کالکشن ترویس اسکات
                </MetallicButton>
              </Link>
            </div>

            {/* Clean Minimal Sneaker Switcher */}
            <div className="pt-4 flex items-center gap-2.5">
              {HERO_SNEAKERS.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.product.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={cn(
                      "group flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold transition-all duration-300 cursor-pointer",
                      isSelected
                        ? "border-primary/80 bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-sm"
                        : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden sm:inline text-[11px] font-semibold truncate max-w-[120px]">
                      {item.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Column (End in RTL): 3D Tilt Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHero.product.id}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <TiltCard
                    max={12}
                    glare={true}
                    className="border border-border/80 bg-gradient-to-b from-card via-card to-card/70 p-5 sm:p-6 shadow-2xl backdrop-blur-xl group"
                  >
                    {/* Sneaker Image Frame */}
                    <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center p-4">
                      <Image
                        src={activeHero.product.images[0].url}
                        alt={activeHero.product.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 group-hover:-rotate-2"
                      />

                      {/* Clean Badge */}
                      <div className="absolute top-3 right-3 rounded-full bg-background/85 backdrop-blur-md px-3 py-1 text-[11px] font-black text-foreground border border-white/15 shadow-sm">
                        {activeHero.badgeText}
                      </div>
                    </div>

                    {/* Sneaker Details & Buy Button */}
                    <div className="pt-4 space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${activeHero.product.slug}`}
                            className="text-base sm:text-lg font-black text-foreground hover:text-primary transition-colors block line-clamp-1"
                          >
                            {activeHero.product.name}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">
                            {activeHero.product.nameEn}
                          </span>
                        </div>

                        <div className="text-left font-mono shrink-0">
                          <span className="text-base sm:text-lg font-black text-foreground block">
                            {format(activeHero.product.price)}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 justify-end">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{activeHero.product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Buy Action */}
                      <button
                        onClick={handleHeroQuickAdd}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-3 text-xs sm:text-sm font-black shadow-lg hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        خرید سریع این مدل
                      </button>
                    </div>
                  </TiltCard>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
