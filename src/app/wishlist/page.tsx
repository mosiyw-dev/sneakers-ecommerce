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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-current" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              لیست علاقه‌مندی‌های من
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            کتونی‌های مورد علاقه خود را ذخیره و در زمان مناسب خریداری فرمایید.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearWishlist}
              className="text-xs rounded-xl"
            >
              پاک کردن همه
            </Button>
            <Button
              onClick={handleMoveAllToCart}
              size="sm"
              className="gap-2 rounded-xl text-xs font-bold shadow-xs"
            >
              <ShoppingBag className="h-4 w-4" /> انتقال همه به سبد ({items.length})
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/80 text-muted-foreground mb-4">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-foreground">لیست علاقه‌مندی‌های شما خالی است</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1.5 mb-8 leading-relaxed">
            با کلیک روی آیکون قلب در کارت کتونی‌ها یا صفحه محصول، آن‌ها را در این قسمت ذخیره نمایید.
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2 rounded-2xl text-sm font-bold shadow-md">
              مشاهده کاتالوگ جردن <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => {
            const discountPercent = calculateDiscountPercentage(
              product.price,
              product.compareAtPrice
            );

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-border transition-all duration-300 text-right"
              >
                {/* Image */}
                <div className="relative aspect-square w-full bg-muted overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Badges (Top Right in RTL) */}
                  <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-10">
                    {product.isNew && <Badge variant="success" size="sm">جدید</Badge>}
                    {discountPercent > 0 && (
                      <Badge variant="destructive" size="sm">
                        {discountPercent}٪ تخفیف
                      </Badge>
                    )}
                  </div>

                  {/* Remove button (Top Left in RTL) */}
                  <button
                    onClick={() => {
                      removeItem(product.id);
                      toast.info("از علاقه‌مندی‌ها حذف شد", `${product.name} برداشته شد.`);
                    }}
                    className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground/70 hover:text-destructive hover:bg-background transition-all shadow-xs"
                    aria-label="حذف از لیست"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors block line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-foreground font-mono">
                        {format(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through font-mono">
                          {format(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
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
