"use client";

import * as React from "react";
import { ProductColor } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Flame, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  colors?: ProductColor[];
  sizes?: string[];
  selectedColor?: ProductColor;
  onColorChange: (color: ProductColor) => void;
  selectedSize?: string;
  onSizeChange: (size: string) => void;
  sku: string;
  stock: number;
}

export function VariantSelector({
  colors,
  sizes,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  sku,
  stock,
}: VariantSelectorProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);

  return (
    <div className="space-y-5 text-right">
      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              ترکیب رنگ:{" "}
              <strong className="text-primary font-bold">
                {selectedColor?.name || colors[0].name}
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const isSelected = selectedColor?.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorChange(color)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all touch-target active:scale-95 text-right",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30 font-bold"
                      : "border-border/70 bg-card hover:bg-muted"
                  )}
                  title={color.name}
                  aria-label={color.name}
                >
                  <div
                    className="relative flex h-5 w-5 items-center justify-center rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "h-3 w-3",
                          color.hex === "#FFFFFF" || color.hex === "#E5E7EB" || color.hex === "#F3F4F6"
                            ? "text-black"
                            : "text-white"
                        )}
                      />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sneaker Size Selection & Size Guide */}
      {sizes && sizes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              سایز پا (استاندارد اروپا - EU):{" "}
              <strong className="text-primary font-bold font-mono">
                {selectedSize ? `EU ${selectedSize}` : "یک سایز انتخاب کنید"}
              </strong>
            </span>

            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline touch-target"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              راهنمای سایز
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={cn(
                    "h-11 rounded-xl px-2 text-xs font-black font-mono border transition-all active:scale-90 flex items-center justify-center touch-target",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  )}
                >
                  EU {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Urgency & SKU Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          {stock <= 5 ? (
            <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg text-[11px]">
              <Flame className="h-3.5 w-3.5" />
              فقط {stock} جفت موجود در انبار
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> موجود در انبار تهران با ارسال فوری
            </span>
          )}
        </div>

        <span className="font-mono text-[10px] sm:text-[11px]">کد مدل: {sku}</span>
      </div>

      {/* Size Guide Modal (Persian Foot Length & EU/US Table) */}
      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} maxWidth="lg">
        <DialogHeader onClose={() => setSizeGuideOpen(false)}>
          <DialogTitle>راهنمای جامع سایز کتونی‌های ایر جردن</DialogTitle>
        </DialogHeader>

        <DialogContent className="p-4 sm:p-6 space-y-4 text-xs text-right">
          <p className="text-muted-foreground leading-relaxed">
            کتونی‌های نایک ایر جردن ۱ و ۴ دارای قالب استاندارد (True to Size) هستند. اگر پاهای پهن‌تری دارید، پیشنهاد می‌شود نیم سایز بزرگتر انتخاب کنید.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-center text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2.5">سایز EU (اروپا)</th>
                  <th className="p-2.5">سایز US (مردانه)</th>
                  <th className="p-2.5">طول پا به سانتی‌متر (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                <tr><td className="p-2 font-bold">40</td><td className="p-2">7.0</td><td className="p-2">25.0 cm</td></tr>
                <tr><td className="p-2 font-bold">41</td><td className="p-2">8.0</td><td className="p-2">26.0 cm</td></tr>
                <tr><td className="p-2 font-bold">42</td><td className="p-2">8.5</td><td className="p-2">26.5 cm</td></tr>
                <tr><td className="p-2 font-bold">42.5</td><td className="p-2">9.0</td><td className="p-2">27.0 cm</td></tr>
                <tr><td className="p-2 font-bold">43</td><td className="p-2">9.5</td><td className="p-2">27.5 cm</td></tr>
                <tr><td className="p-2 font-bold">44</td><td className="p-2">10.0</td><td className="p-2">28.0 cm</td></tr>
                <tr><td className="p-2 font-bold">44.5</td><td className="p-2">10.5</td><td className="p-2">28.5 cm</td></tr>
                <tr><td className="p-2 font-bold">45</td><td className="p-2">11.0</td><td className="p-2">29.0 cm</td></tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
            <strong className="text-foreground block font-bold">نحوه اندازه‌گیری طول پا:</strong>
            <p>
              پاشنه پای خود را به دیوار بچسبانید و با خط‌کش فاصله انتهای پاشنه تا نوک بلندترین انگشت را بر حسب سانتی‌متر بسنجید.
            </p>
          </div>

          <Button
            onClick={() => setSizeGuideOpen(false)}
            className="w-full rounded-2xl text-xs font-bold"
          >
            سایزم را انتخاب کردم
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
