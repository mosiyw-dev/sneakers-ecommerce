"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Product, ProductColor } from "@/types";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { QuantityStepper } from "./quantity-stepper";
import { DeliveryEstimator } from "./delivery-estimator";
import { FrequentlyBoughtTogether } from "./frequently-bought-together";
import { RecentlyViewed } from "./recently-viewed";
import { ReviewSection } from "./review-section";
import { StickyMobileBuyBar } from "./sticky-mobile-buy-bar";
import { ProductGrid } from "./product-grid";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCompareStore } from "@/stores/compare-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { toast } from "@/stores/toast-store";
import { calculateDiscountPercentage } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface PdpClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function PdpClient({ product, relatedProducts }: PdpClientProps) {
  const isMounted = useIsMounted();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, isInCompare } = useCompareStore();
  const { addProduct } = useRecentlyViewedStore();
  const { format } = useCurrencyStore();

  const [selectedColor, setSelectedColor] = React.useState<ProductColor | undefined>(
    product.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(
    product.sizes?.[0]
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);

  // Track recently viewed on mount
  React.useEffect(() => {
    addProduct(product);
  }, [product, addProduct]);

  const isFavorited = isMounted ? isInWishlist(product.id) : false;
  const isCompared = isMounted ? isInCompare(product.id) : false;
  const discountPercent = calculateDiscountPercentage(
    product.price,
    product.compareAtPrice
  );

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedColor, selectedSize);
    toast.success(
      "به سبد اضافه شد",
      `${product.name} (سایز EU ${selectedSize || "استاندارد"}) به سبد افزوده شد.`
    );
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success("به علاقه‌مندی‌ها اضافه شد", `${product.name} ذخیره شد.`);
    } else {
      toast.info("از علاقه‌مندی‌ها حذف شد", `${product.name} حذف شد.`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("لینک کپی شد", "آدرس اینترنتی این مدل در حافظه ذخیره شد.");
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById("pdp-reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 md:pb-8 space-y-12 sm:space-y-16 text-right">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          صفحه اصلی
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          کاتالوگ کتونی‌ها
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category}`}
          className="hover:text-foreground transition-colors"
        >
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Gallery Column */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <ProductGallery
              images={product.images}
              productName={product.name}
              discountBadge={discountPercent > 0 ? `${discountPercent}٪ تخفیف ویژه` : undefined}
              isNew={product.isNew}
            />
          </div>
        </div>

        {/* Info & Buy Box Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            {/* Brand & Category & Review Score */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                {product.brand} • {product.categoryName}
              </span>
              <button
                type="button"
                onClick={scrollToReviews}
                className="flex items-center gap-1.5 font-bold text-amber-500 hover:underline"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">
                  ({product.reviewCount} دیدگاه)
                </span>
              </button>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              {product.nameEn}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {product.tagline}
            </p>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-foreground font-mono">
                {format(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through font-mono">
                  {format(product.compareAtPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <Badge variant="destructive" size="sm">
                  {discountPercent}٪ تخفیف
                </Badge>
              )}
            </div>
          </div>

          {/* Dynamic Variant Selector */}
          <VariantSelector
            colors={product.colors}
            sizes={product.sizes}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            sku={product.sku}
            stock={product.stock}
          />

          {/* Delivery Date Estimator */}
          <DeliveryEstimator />

          {/* Action Suite: Quantity, Add to Cart, Buy Now, Wishlist, Compare */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5">
              <QuantityStepper
                quantity={quantity}
                maxStock={product.stock}
                onChange={setQuantity}
                size="lg"
              />

              <Button
                onClick={handleAddToCart}
                variant="glow"
                size="lg"
                disabled={isAdding || product.stock <= 0}
                className="flex-1 h-13 gap-2 rounded-2xl text-sm font-black shadow-xl"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.stock <= 0 ? "ناموجود در انبار" : "افزودن به سبد خرید"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleWishlist}
                className="h-13 w-13 rounded-2xl shrink-0 active:scale-95"
                aria-label="افزودن به علاقه‌مندی‌ها"
                title="ذخیره در علاقه‌مندی‌ها"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorited && "fill-destructive text-destructive"
                  )}
                />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleCompare(product)}
                className={cn(
                  "h-13 w-13 rounded-2xl shrink-0 active:scale-95 transition-colors",
                  isCompared && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                aria-label="مقایسه مشخصات"
                title="مقایسه مشخصات"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-13 w-13 rounded-2xl shrink-0"
                aria-label="اشتراک‌گذاری"
                title="اشتراک‌گذاری لینک"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleBuyNow}
              variant="luxury"
              size="lg"
              className="w-full h-13 gap-2 rounded-2xl text-sm font-black shadow-lg"
            >
              <Zap className="h-4 w-4 fill-current text-amber-400" />
              خرید فوری و تسویه در ۱ مرحله
            </Button>
          </div>

          {/* Value Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>ارسال رایگان سراسر ایران</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <RotateCcw className="h-4 w-4 text-primary shrink-0" />
              <span>۷ روز ضمانت تعویض سایز</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>ضمانت ۱۰۰٪ اصالت فیزیکی</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>جعبه اورجینال کارخانه نایک</span>
            </div>
          </div>

          {/* Collapsible Information Sections using BouncyAccordion */}
          <div className="pt-2">
            <BouncyAccordion
              defaultValue="details"
              items={[
                {
                  id: "details",
                  title: "مشخصات و ویژگی‌های فنی",
                  icon: <CheckCircle2 className="h-4 w-4" />,
                  description: (
                    <div className="space-y-3 pt-1">
                      <p className="leading-relaxed">{product.description}</p>
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ),
                },
                ...(product.specifications.length > 0
                  ? [
                      {
                        id: "specs",
                        title: "جدول متریال و ساختار",
                        icon: <ShieldCheck className="h-4 w-4" />,
                        description: (
                          <div className="space-y-4 pt-1">
                            {product.specifications.map((group) => (
                              <div key={group.group}>
                                <h5 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">
                                  {group.group}
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  {group.items.map((item) => (
                                    <div key={item.label} className="bg-muted/40 p-2.5 rounded-xl border border-border/40">
                                      <span className="text-muted-foreground block text-[10px] font-bold">
                                        {item.label}
                                      </span>
                                      <span className="font-bold text-foreground">
                                        {item.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(product.materialsAndCare && product.materialsAndCare.length > 0
                  ? [
                      {
                        id: "care",
                        title: "نحوه نگهداری و تمیزکاری چرم",
                        icon: <Sparkles className="h-4 w-4" />,
                        description: (
                          <ul className="space-y-1.5 list-disc list-inside pt-1">
                            {product.materialsAndCare.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        ),
                      },
                    ]
                  : []),
                {
                  id: "authenticity",
                  title: "ضمانت اصالت و تست ۵ مرحله‌ای",
                  icon: <Zap className="h-4 w-4" />,
                  description: (
                    <p className="leading-relaxed pt-1">
                      این محصول با ضمانت مادام‌العمر اصالت فیزیکی، بارکد رسمی کارخانه نایک و جعبه دوجداره ارسال می‌گردد. در صورت هرگونه عدم تطابق، امکان عودت فوری وجه فراهم است.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Ensemble Bundle */}
      <FrequentlyBoughtTogether
        currentProduct={product}
        companionProducts={relatedProducts}
      />

      {/* Customer Reviews Section */}
      <div id="pdp-reviews">
        <ReviewSection
          reviews={product.reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
          productName={product.name}
        />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                مدل‌های مشابه و مکمل
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                شاید این کتونی‌ها را هم بپسندید
              </h3>
            </div>
            <Link
              href={`/categories/${product.category}`}
              className="text-xs text-primary font-semibold hover:underline"
            >
              مشاهده تمام مدل‌های این دسته ←
            </Link>
          </div>

          <ProductGrid products={relatedProducts.slice(0, 4)} viewMode="grid-4" />
        </div>
      )}

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Sticky Mobile Buy Bar */}
      <StickyMobileBuyBar
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
      />
    </div>
  );
}
