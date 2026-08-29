"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Tag,
  X,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { toast } from "@/stores/toast-store";
import { PROMO_CODES } from "@/data/shipping-options";

export default function CartPage() {
  const isMounted = useIsMounted();
  const {
    items,
    removeItem,
    updateQuantity,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getSummary,
  } = useCartStore();

  const { format } = useCurrencyStore();
  const [promoInput, setPromoInput] = React.useState("");
  const [promoError, setPromoError] = React.useState<string | null>(null);

  const summary = getSummary();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const validPromo = PROMO_CODES.find((p) => p.code === code);
    if (!validPromo) {
      setPromoError("کد تخفیف وارد شده معتبر نیست.");
      return;
    }

    if (validPromo.minSubtotal && summary.subtotal < validPromo.minSubtotal) {
      setPromoError(
        `حداقل مبلغ سفارش برای این کد ${format(validPromo.minSubtotal)} است.`
      );
      return;
    }

    applyPromoCode(validPromo);
    toast.success("کد تخفیف اعمال شد", validPromo.description);
    setPromoInput("");
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast.info("کتونی از سبد حذف شد", `${name} از سبد خرید برداشته شد.`);
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">در حال بارگذاری سبد خرید...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 text-right pb-28 md:pb-10">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            سبد خرید شما ({summary.itemCount} جفت)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          کتونی‌های انتخابی خود را بررسی و سپس برای ثبت آدرس و درگاه بانکی اقدام نمایید.
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-8 sm:p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-4">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            سبد خرید شما در حال حاضر خالی است
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1 mb-6 sm:mb-8">
            جدیدترین کتونی‌های جردن ۱، جردن ۴ و مدل‌های لیمیتد ترویس اسکات را بررسی کنید.
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md">
              مشاهده کاتالوگ جردن <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        /* Filled Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Main Item Stream */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Free shipping progress bar */}
            <div className="rounded-2xl bg-muted/40 border border-border/80 p-3.5 sm:p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  {summary.remainingForFreeShipping > 0 ? (
                    <span>
                      فقط{" "}
                      <strong className="text-primary font-mono font-bold">
                        {format(summary.remainingForFreeShipping)}
                      </strong>{" "}
                      دیگر تا ارسال کاملاً رایگان
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> ارسال این سفارش ۱۰۰٪ رایگان است!
                    </span>
                  )}
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {Math.round(summary.freeShippingProgress)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${summary.freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Mobile / Desktop Cart Items List */}
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-5 rounded-3xl border border-border/80 bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border">
                      <Image
                        src={
                          item.selectedColor?.imageIndex !== undefined &&
                          item.product.images[item.selectedColor.imageIndex]
                            ? item.product.images[item.selectedColor.imageIndex].url
                            : item.product.images[0].url
                        }
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        {item.product.brand}
                      </span>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-xs sm:text-sm font-black text-foreground hover:text-primary transition-colors block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {item.selectedSize && (
                          <span className="bg-muted px-2 py-0.5 rounded-md">
                            سایز: <strong className="font-mono text-foreground font-bold">EU {item.selectedSize}</strong>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-muted px-2 py-0.5 rounded-md">
                            رنگ: <strong className="text-foreground">{item.selectedColor.name}</strong>
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-xs sm:text-sm font-black text-foreground font-mono">
                          {format(item.price)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            (مجموع: {format(item.price * item.quantity)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove CTA */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground sm:hidden">تعداد:</span>
                      <QuantityStepper
                        quantity={item.quantity}
                        maxStock={item.product.stock}
                        onChange={(q) => updateQuantity(item.id, q)}
                        size="default"
                      />
                    </div>

                    <div className="hidden sm:block text-left font-mono">
                      <span className="text-sm sm:text-base font-black text-foreground block">
                        {format(item.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, item.product.name)}
                      className="p-2 text-muted-foreground hover:text-destructive active:scale-90 transition-all rounded-xl touch-target"
                      aria-label="حذف کتونی"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Catalog */}
            <div className="flex items-center justify-between pt-2">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="gap-2 text-xs font-semibold">
                  <ArrowRight className="h-4 w-4" /> ادامه خرید و مشاهده کاتالوگ
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-6 sticky top-24 shadow-sm">
              <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
                صورت‌حساب نهایی سبد
              </h3>

              {/* Promo Code Form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span>
                      کد <strong>{appliedPromo.code}</strong> اعمال شد
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="p-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="کد تخفیف (مثلاً JORDAN10)"
                      className="flex-1 rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button type="submit" size="xs" variant="outline" className="text-xs rounded-xl">
                      اعمال
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-destructive">{promoError}</p>
                  )}
                </form>
              )}

              {/* Cost Calculation */}
              <div className="space-y-2 text-xs border-t border-border pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>جمع کل اقلام ({summary.itemCount} جفت):</span>
                  <span className="font-mono text-foreground font-semibold">
                    {format(summary.subtotal)}
                  </span>
                </div>

                {summary.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>سود شما از تخفیف:</span>
                    <span className="font-mono">
                      -{format(summary.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="font-mono text-foreground font-semibold">
                    {summary.shippingAmount === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        رایگان
                      </span>
                    ) : (
                      format(summary.shippingAmount)
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-border pt-3 text-sm font-black text-foreground">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="font-mono text-base text-primary">
                    {format(summary.total)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <Link href="/checkout" className="block">
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  اقدام به ثبت سفارش و تسویه <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              {/* Security Badges */}
              <div className="rounded-2xl bg-muted/40 p-4 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>ضمانت ۱۰۰٪ اصالت فیزیکی و فاکتور چاپی</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <span>۷ روز مهلت تعویض بی‌قید و شرط سایز</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Checkout Action Bar */}
      {items.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-45 lg:hidden border-t border-border/80 bg-background/95 p-3.5 backdrop-blur-xl shadow-2xl text-right"
          style={{
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
          }}
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-medium">مبلغ قابل پرداخت:</span>
              <span className="text-sm font-black text-primary font-mono">
                {format(summary.total)}
              </span>
            </div>

            <Link href="/checkout" className="flex-1 max-w-[200px]">
              <Button
                size="sm"
                className="w-full h-11 gap-1.5 rounded-2xl text-xs font-black shadow-lg active:scale-95 touch-target"
              >
                ثبت سفارش و تسویه <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
