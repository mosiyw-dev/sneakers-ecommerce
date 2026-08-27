"use client";

import * as React from "react";
import Image from "next/image";
import { CartItem, CartSummary, PromoCode } from "@/types";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { Tag, X, ShieldCheck, Truck } from "lucide-react";
import { PROMO_CODES } from "@/data/shipping-options";
import { toast } from "@/stores/toast-store";

interface OrderSummaryProps {
  items: CartItem[];
  summary: CartSummary;
  appliedPromo?: PromoCode;
  onApplyPromo: (promo: PromoCode) => void;
  onRemovePromo: () => void;
}

export function OrderSummary({
  items,
  summary,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}: OrderSummaryProps) {
  const { format } = useCurrencyStore();
  const [promoInput, setPromoInput] = React.useState("");
  const [promoError, setPromoError] = React.useState<string | null>(null);

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

    onApplyPromo(validPromo);
    toast.success("کد تخفیف اعمال شد", validPromo.description);
    setPromoInput("");
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-6 shadow-sm text-right">
      <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
        خلاصه پیش‌فاکتور سفارش ({summary.itemCount} جفت)
      </h3>

      {/* Item list */}
      <div className="max-h-64 overflow-y-auto divide-y divide-border/60 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
              <Image
                src={
                  item.selectedColor?.imageIndex !== undefined &&
                  item.product.images[item.selectedColor.imageIndex]
                    ? item.product.images[item.selectedColor.imageIndex].url
                    : item.product.images[0].url
                }
                alt={item.product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground font-mono">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-foreground truncate">
                {item.product.name}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                {item.selectedSize && <span>سایز: <strong>EU {item.selectedSize}</strong></span>}
                {item.selectedColor && <span>رنگ: <strong>{item.selectedColor.name}</strong></span>}
              </div>
            </div>

            <span className="text-xs font-bold text-foreground font-mono">
              {format(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

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
            onClick={onRemovePromo}
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
      <div className="space-y-2 border-t border-border pt-4 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>جمع کل اقلام:</span>
          <span className="font-mono text-foreground font-semibold">
            {format(summary.subtotal)}
          </span>
        </div>

        {summary.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>تخفیف ویژه:</span>
            <span className="font-mono">-{format(summary.discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>هزینه بسته‌بندی و ارسال:</span>
          <span className="font-mono text-foreground font-semibold">
            {summary.shippingAmount === 0 ? "رایگان" : format(summary.shippingAmount)}
          </span>
        </div>

        <div className="flex justify-between border-t border-border pt-3 text-sm font-black text-foreground">
          <span>مبلغ نهایی قابل پرداخت:</span>
          <span className="font-mono text-base text-primary">
            {format(summary.total)}
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="rounded-2xl bg-muted/40 p-3 space-y-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>ضمانت ۱۰۰٪ اصالت فیزیکی و فاکتور چاپی</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <span>بسته‌بندی دولایه ضد ضربه برای محافظت جعبه اصلی</span>
        </div>
      </div>
    </div>
  );
}
