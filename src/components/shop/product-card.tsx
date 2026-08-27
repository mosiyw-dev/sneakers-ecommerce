"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star, SlidersHorizontal, Check } from "lucide-react";
import { Product, ProductColor, ViewMode } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useQuickViewStore } from "@/stores/quickview-store";
import { useCompareStore } from "@/stores/compare-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { TiltCard } from "@/components/motion/tilt-card";
import { toast } from "@/stores/toast-store";
import { calculateDiscountPercentage } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  priority?: boolean;
}

export function ProductCard({
  product,
  viewMode = "grid-4",
  priority = false,
}: ProductCardProps) {
  const isMounted = useIsMounted();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { openQuickView } = useQuickViewStore();
  const { toggleCompare, isInCompare } = useCompareStore();
  const { format } = useCurrencyStore();

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState<ProductColor | undefined>(
    product.colors?.[0]
  );
  const [isHovered, setIsHovered] = React.useState(false);

  const isFavorited = isMounted ? isInWishlist(product.id) : false;
  const isCompared = isMounted ? isInCompare(product.id) : false;
  const discountPercent = calculateDiscountPercentage(
    product.price,
    product.compareAtPrice
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, selectedColor, product.sizes?.[0]);
    toast.success("به سبد اضافه شد", `${product.name} به سبد خرید افزوده شد.`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      toast.success("به علاقه‌مندی‌ها اضافه شد", `${product.name} ذخیره شد.`);
    } else {
      toast.info("از علاقه‌مندی‌ها حذف شد", `${product.name} حذف شد.`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const isListView = viewMode === "list";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex rounded-3xl border border-border/60 bg-card text-card-foreground transition-all duration-300 hover:shadow-2xl hover:border-primary/40 overflow-hidden text-right",
        isListView ? "flex-col sm:flex-row p-4 gap-6 items-center" : "flex-col"
      )}
    >
      {/* 3D Image Container with TiltCard */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted/40",
          isListView
            ? "h-48 sm:h-56 w-full sm:w-56 shrink-0 rounded-2xl"
            : "aspect-square w-full"
        )}
      >
        <TiltCard max={10} glare={true} className="h-full w-full">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={
                isHovered && product.images.length > 1 && activeImageIndex === 0
                  ? product.images[1].url
                  : product.images[activeImageIndex]?.url || product.images[0].url
              }
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-108"
            />
          </Link>
        </TiltCard>

        {/* Badges (Top Right in RTL) */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <AnimatedBadge status="success" size="sm">
              جدید
            </AnimatedBadge>
          )}
          {discountPercent > 0 && (
            <AnimatedBadge status="danger" size="sm">
              {discountPercent}٪ تخفیف
            </AnimatedBadge>
          )}
          {product.isBestSeller && !product.isNew && (
            <AnimatedBadge status="warning" size="sm">
              پرفروش‌ترین
            </AnimatedBadge>
          )}
        </div>

        {/* Top-Left Quick Actions (Wishlist, Quick View, Compare) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleToggleWishlist}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-foreground/80 hover:text-foreground hover:bg-background shadow-xs transition-all cursor-pointer"
            aria-label="افزودن به علاقه‌مندی‌ها"
            title="افزودن به علاقه‌مندی‌ها"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorited && "fill-destructive text-destructive"
              )}
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleQuickView}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-foreground/80 hover:text-foreground hover:bg-background shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            aria-label="مشاهده سریع"
            title="مشاهده سریع"
          >
            <Eye className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-foreground/80 hover:text-foreground hover:bg-background shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer",
              isCompared && "bg-primary text-primary-foreground opacity-100 hover:bg-primary/90"
            )}
            aria-label="مقایسه مشخصات"
            title="مقایسه مشخصات"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {/* Bottom Quick-Add Bar on Hover (Grid View only) */}
        {!isListView && (
          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-3 py-2 text-xs font-black shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              افزودن سریع به سبد
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={cn("flex flex-1 flex-col justify-between p-4", isListView && "w-full p-0 sm:py-2")}>
        <div>
          {/* Brand & Category & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="h-3 w-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground font-normal text-[10px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="group-hover:text-primary transition-colors block"
          >
            <h3 className="text-xs sm:text-sm font-black text-foreground line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Tagline / English name for List view */}
          {isListView && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2">
              {product.tagline} • <span className="font-mono">{product.nameEn}</span>
            </p>
          )}

          {/* Color Swatch Dots */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onMouseEnter={() => {
                    if (color.imageIndex !== undefined && product.images[color.imageIndex]) {
                      setActiveImageIndex(color.imageIndex);
                    }
                    setSelectedColor(color);
                  }}
                  onMouseLeave={() => {
                    setActiveImageIndex(0);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  className={cn(
                    "relative h-4 w-4 rounded-full border transition-all p-0.5 flex items-center justify-center cursor-pointer",
                    selectedColor?.name === color.name
                      ? "border-primary ring-2 ring-primary/50 scale-115"
                      : "border-border/60 hover:scale-105"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor?.name === color.name && (
                    <Check
                      className={cn(
                        "h-2.5 w-2.5",
                        color.hex === "#FFFFFF" || color.hex === "#E5E7EB" || color.hex === "#F3F4F6"
                          ? "text-black"
                          : "text-white"
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Stock Urgency */}
        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-black text-foreground font-mono">
              {format(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11px] text-muted-foreground line-through font-mono">
                {format(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Stock hint with pulse badge */}
          {product.stock <= 5 ? (
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              فقط {product.stock} جفت باقیست
            </span>
          ) : (
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              موجود در انبار تهران
            </span>
          )}

          {isListView && (
            <button
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              افزودن
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
