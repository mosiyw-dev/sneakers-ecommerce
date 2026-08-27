"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Flame, Trophy } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductGrid } from "@/components/shop/product-grid";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { MetallicButton } from "@/components/motion/button/metallic";
import { TextShimmer } from "@/components/motion/text-shimmer";

export function CuratedTabs() {
  const [activeTab, setActiveTab] = React.useState<"trending" | "best_sellers" | "new_arrivals">(
    "trending"
  );

  const trendingProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  }, []);

  const bestSellerProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  }, []);

  const newArrivalProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.isNew).slice(0, 8);
  }, []);

  const currentProducts =
    activeTab === "trending"
      ? trendingProducts
      : activeTab === "best_sellers"
      ? bestSellerProducts
      : newArrivalProducts;

  return (
    <section className="py-16 sm:py-24 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                ویترین منتخب
              </span>
              <TextShimmer duration={2} className="text-xs font-bold">
                • عرضه هفتگی
              </TextShimmer>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              محبوب‌ترین کتونی‌های فصل
            </h2>
          </div>

          {/* beUI Spring Layout Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            variant="pill"
          >
            <TabsList className="bg-card/90 shadow-sm">
              <TabsTrigger value="trending" className="gap-1.5 font-black">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                پرطرفدارترین‌ها
              </TabsTrigger>

              <TabsTrigger value="best_sellers" className="gap-1.5 font-black">
                <Trophy className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                پرفروش‌ترین‌ها
              </TabsTrigger>

              <TabsTrigger value="new_arrivals" className="gap-1.5 font-black">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                جدیدترین‌ها
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Product Grid with 3D TiltCards */}
        <ProductGrid products={currentProducts} viewMode="grid-4" />

        {/* Bottom Catalog CTA with MetallicButton */}
        <div className="text-center pt-8">
          <Link href="/products">
            <MetallicButton size="xl" className="shadow-2xl">
              مشاهده تمام موجودی جردن کلاب ({PRODUCTS.length} مدل اورجینال) <ArrowLeft className="h-4 w-4" />
            </MetallicButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
