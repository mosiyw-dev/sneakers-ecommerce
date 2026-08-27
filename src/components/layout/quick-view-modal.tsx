"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Truck,
  Check,
} from "lucide-react";
import { useQuickViewStore } from "@/stores/quickview-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/stores/toast-store";
import { calculateDiscountPercentage } from "@/lib/formatters";
import { Product, ProductColor } from "@/types";
import { cn } from "@/lib/utils";

function QuickViewModalContent({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const isMounted = useIsMounted();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { format } = useCurrencyStore();

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState<ProductColor | undefined>(
    product.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(
    product.sizes?.[0]
  );
  const [quantity] = React.useState(1);

  const isFavorited = isMounted ? isInWishlist(product.id) : false;
  const discountPercent = calculateDiscountPercentage(
    product.price,
    product.compareAtPrice
  );

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    toast.success(
      "به سبد اضافه شد",
      `${product.name} (سایز EU ${selectedSize || "استاندارد"}) به سبد افزوده شد.`
    );
    onClose();
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success("به علاقه‌مندی‌ها اضافه شد", `${product.name} ذخیره شد.`);
    } else {
      toast.info("از علاقه‌مندی‌ها حذف شد", `${product.name} حذف شد.`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 text-right">
      {/* Gallery side */}
      <div className="flex flex-col bg-muted/40 p-6 border-b md:border-b-0 md:border-l border-border">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted border border-border/50">
          <Image
            src={product.images[activeImageIndex]?.url || product.images[0].url}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-300"
          />
          {discountPercent > 0 && (
            <div className="absolute right-3 top-3">
              <Badge variant="destructive">{discountPercent}٪ تخفیف</Badge>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  activeImageIndex === idx
                    ? "border-primary shadow-xs ring-2 ring-primary/20"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details & Actions side */}
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {product.brand} • {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground font-normal">
                ({product.reviewCount} نظر)
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-bold text-foreground font-mono">
              {format(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through font-mono">
                {format(product.compareAtPrice)}
              </span>
            )}
            {product.stock <= 5 && (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                🔥 فقط {product.stock} جفت در انبار باقی مانده
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium text-foreground">
                  رنگ‌بندی:{" "}
                  <strong className="font-semibold text-primary">
                    {selectedColor?.name}
                  </strong>
                </span>
              </div>
              <div className="flex gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      if (color.imageIndex !== undefined && product.images[color.imageIndex]) {
                        setActiveImageIndex(color.imageIndex);
                      }
                    }}
                    className={cn(
                      "relative h-7 w-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center",
                      selectedColor?.name === color.name
                        ? "border-primary ring-2 ring-primary/20 scale-110"
                        : "border-border hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && (
                      <Check
                        className={cn(
                          "h-3.5 w-3.5",
                          color.hex === "#FFFFFF" || color.hex === "#F8F9FA" || color.hex === "#F3F4F6"
                            ? "text-black"
                            : "text-white"
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium text-foreground">
                  انتخاب سایز کتونی (EU):{" "}
                  <strong className="font-semibold text-primary">
                    {selectedSize}
                  </strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all font-mono",
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 pt-4 border-t border-border space-y-3">
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 gap-2 rounded-xl text-sm font-semibold shadow-md active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" /> افزودن به سبد خرید
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className="h-11 w-11 rounded-xl shrink-0"
              aria-label="ذخیره در علاقه‌مندی‌ها"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorited && "fill-destructive text-destructive"
                )}
              />
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-primary" /> ارسال فوری با ضمانت اصالت
            </span>
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              مشاهده مشخصات کامل <ArrowLeft className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickViewModal() {
  const { product, isOpen, closeQuickView } = useQuickViewStore();

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeQuickView()} maxWidth="4xl">
      <DialogContent className="p-0 overflow-hidden">
        <QuickViewModalContent
          key={product.id}
          product={product}
          onClose={closeQuickView}
        />
      </DialogContent>
    </Dialog>
  );
}
