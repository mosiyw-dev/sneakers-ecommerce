"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Sparkles,
  Tag,
  X,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { toast } from "@/stores/toast-store";
import { PROMO_CODES } from "@/data/shipping-options";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
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

  const handleRemoveItemWithUndo = (
    itemId: string,
    productName: string,
    product: typeof items[0]
  ) => {
    removeItem(itemId);
    toast.info("کتونی از سبد حذف شد", `${productName} از سبد خرید برداشته شد.`, {
      label: "بازگردانی",
      onClick: () => {
        useCartStore
          .getState()
          .addItem(
            product.product,
            product.quantity,
            product.selectedColor,
            product.selectedSize
          );
      },
    });
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()} side="left">
      <SheetHeader onClose={closeDrawer}>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <SheetTitle>سبد خرید شما ({summary.itemCount} جفت)</SheetTitle>
        </div>
      </SheetHeader>

      <SheetContent className="flex flex-col justify-between p-0 overflow-hidden text-right">
        {/* Free Shipping Milestone Progress Bar */}
        <div className="bg-muted/60 p-4 border-b border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary" />
              {summary.remainingForFreeShipping > 0 ? (
                <>
                  <strong className="text-primary font-mono font-bold">
                    {format(summary.remainingForFreeShipping)}
                  </strong>{" "}
                  تا ارسال کاملاً رایگان
                </>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> شما واجد شرایط ارسال رایگان شدید!
                </span>
              )}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {Math.round(summary.freeShippingProgress)}%
            </span>
          </div>

          {/* Progress track */}
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${summary.freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item Stream */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-4">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              سبد خرید شما خالی است
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-6">
              جدیدترین کتونی‌های جردن ۱، جردن ۴ و ترویس اسکات را بررسی کنید.
            </p>
            <Link href="/products" onClick={closeDrawer}>
              <Button size="sm" className="gap-2 rounded-xl text-xs font-bold shadow-md">
                مشاهده همه کتونی‌ها <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-border/60 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                {/* Product Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                  <Image
                    src={
                      item.selectedColor?.imageIndex !== undefined &&
                      item.product.images[item.selectedColor.imageIndex]
                        ? item.product.images[item.selectedColor.imageIndex].url
                        : item.product.images[0].url
                    }
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground mt-0.5">
                        {item.selectedSize && (
                          <span>سایز: <strong>EU {item.selectedSize}</strong></span>
                        )}
                        {item.selectedColor && (
                          <span>رنگ: <strong>{item.selectedColor.name}</strong></span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleRemoveItemWithUndo(
                          item.id,
                          item.product.name,
                          item
                        )
                      }
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      aria-label="حذف از سبد"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <QuantityStepper
                      quantity={item.quantity}
                      maxStock={item.product.stock}
                      onChange={(q) => updateQuantity(item.id, q)}
                      size="sm"
                    />
                    <span className="text-xs font-bold text-foreground font-mono">
                      {format(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Breakdown & Checkout CTA */}
        {items.length > 0 && (
          <div className="border-t border-border bg-card p-4 sm:p-6 space-y-4">
            {/* Promo Code Input */}
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
                  aria-label="حذف کد تخفیف"
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

            {/* Cost Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>جمع کل اقلام:</span>
                <span className="font-mono text-foreground font-semibold">
                  {format(summary.subtotal)}
                </span>
              </div>

              {summary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>سود شما از تخفیف:</span>
                  <span className="font-mono font-semibold">
                    -{format(summary.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>هزینه ارسال:</span>
                <span className="font-mono text-foreground font-semibold">
                  {summary.shippingAmount === 0 ? "رایگان" : format(summary.shippingAmount)}
                </span>
              </div>

              <div className="flex justify-between border-t border-border pt-2 text-sm font-black text-foreground">
                <span>مبلغ قابل پرداخت:</span>
                <span className="font-mono text-base text-primary">
                  {format(summary.total)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <Link href="/checkout" onClick={closeDrawer} className="block">
                <Button
                  variant="glow"
                  size="lg"
                  className="w-full gap-2 rounded-2xl text-xs sm:text-sm font-black shadow-xl"
                >
                  تکمیل سفارش و تسویه حساب <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cart" onClick={closeDrawer} className="block">
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground font-bold">
                  مشاهده سبد خرید کامل
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
