"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { toast } from "@/stores/toast-store";
import { calculateDiscountPercentage } from "@/lib/formatters";

export default function WishlistPage() {
  const isMounted = useIsMounted();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const { format } = useCurrencyStore();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product, 1);
    toast.success("به سبد اضافه شد", `${product.name} به سبد خرید افزوده شد.`);
    openDrawer();
  };

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((p) => addItem(p, 1));
    clearWishlist();
    toast.success(
      "انتقال کامل به سبد",
      `${items.length} جفت کتونی به سبد خرید شما منتقل شد.`
    );
    openDrawer();
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">در حال بارگذاری لیست علاقه‌مندی‌ها...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 text-right pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              لیست علاقه‌مندی‌های من
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            کتونی‌های مورد علاقه خود را ذخیره و در زمان مناسب خریداری فرمایید.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearWishlist}
              className="text-xs rounded-xl h-10 px-3 touch-target"
            >
              پاک کردن همه
            </Button>
            <Button
              onClick={handleMoveAllToCart}
              size="sm"
              className="flex-1 sm:flex-initial gap-2 rounded-xl text-xs font-black shadow-xs h-10 px-4 touch-target"
            >
              <ShoppingBag className="h-4 w-4" /> انتقال همه به سبد ({items.length})
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-8 sm:p-12 text-center">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-muted/80 text-muted-foreground mb-4">
            <Heart className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">لیست علاقه‌مندی‌های شما خالی است</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1.5 mb-6 sm:mb-8 leading-relaxed">
            با ضربه روی آیکون قلب در کارت کتونی‌ها یا صفحه محصول، آن‌ها را در این قسمت ذخیره نمایید.
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md">
              مشاهده کاتالوگ جردن <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        /* Wishlist 2-Column Mobile Grid */
        <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {items.map((product) => {
            const discountPercent = calculateDiscountPercentage(
              product.price,
              product.compareAtPrice
            );

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 text-right"
              >
                {/* Image */}
                <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Badges (Top Right in RTL) */}
                  <div className="absolute right-2.5 top-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    {product.isNew && <Badge variant="success" size="sm">جدید</Badge>}
                    {discountPercent > 0 && (
                      <Badge variant="destructive" size="sm">
                        {discountPercent}٪
                      </Badge>
                    )}
                  </div>

                  {/* Remove button (Top Left in RTL) */}
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(product.id);
                      toast.info("از علاقه‌مندی‌ها حذف شد", `${product.name} برداشته شد.`);
                    }}
                    className="absolute left-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-muted-foreground hover:text-destructive hover:bg-background transition-all shadow-xs touch-target"
                    aria-label="حذف از لیست"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      {product.brand}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs sm:text-sm font-black text-foreground hover:text-primary transition-colors block line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-black text-foreground font-mono">
                        {format(product.price)}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="h-8 px-2.5 sm:px-3.5 gap-1 rounded-xl text-xs font-bold shadow-xs active:scale-95 touch-target"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      خرید
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
