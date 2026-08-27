"use client";

import * as React from "react";
import { ProductColor } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Flame } from "lucide-react";
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
    <div className="space-y-6 text-right">
      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              انتخاب ترکیب رنگ:{" "}
              <strong className="text-primary font-bold">
                {selectedColor?.name || colors[0].name}
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = selectedColor?.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorChange(color)}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all p-0.5",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 scale-110"
                      : "border-border/80 hover:scale-105"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                >
                  {isSelected && (
                    <Check
                      className={cn(
                        "h-4 w-4",
                        color.hex === "#FFFFFF" || color.hex === "#E5E7EB" || color.hex === "#F3F4F6"
                          ? "text-black"
                          : "text-white"
                      )}
                    />
                  )}
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
              سایز کتونی (استاندارد اروپا - EU):{" "}
              <strong className="text-primary font-bold font-mono">
                {selectedSize || sizes[0]}
              </strong>
            </span>

            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              راهنمای انتخاب سایز پا
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={cn(
                    "min-w-12 h-10 rounded-xl px-3 py-2 text-xs font-bold font-mono border transition-all active:scale-95",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Urgency & SKU Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
        <div className="flex items-center gap-2">
          {stock <= 5 ? (
            <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              <Flame className="h-3.5 w-3.5" />
              فقط {stock} جفت موجود در انبار مرکزی
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ● آماده ارسال فوری به سراسر کشور
            </span>
          )}
        </div>

        <span className="font-mono text-[11px]">شناسه نایک: {sku}</span>
      </div>

      {/* Size Guide Modal (Persian Foot Length & EU/US Table) */}
      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} maxWidth="lg">
        <DialogHeader onClose={() => setSizeGuideOpen(false)}>
          <DialogTitle>راهنمای سایز کتونی‌های نایک و ایر جردن</DialogTitle>
        </DialogHeader>

        <DialogContent className="p-6 space-y-4 text-xs text-right">
          <p className="text-muted-foreground leading-relaxed">
            کتونی‌های نایک ایر جردن ۱ و ۴ دارای قالب استاندارد (True to Size) هستند. اگر پاهای پهن‌تری دارید، پیشنهاد می‌شود نیم سایز بزرگتر انتخاب کنید.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
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
            <strong className="text-foreground block">چگونه پای خود را اندازه بگیرید؟</strong>
            <p>
              پاشنه پای خود را به دیوار بچسبانید و با خط‌کش فاصله انتهای پاشنه تا نوک بلندترین انگشت شست را اندازه بگیرید.
            </p>
          </div>

          <Button
            onClick={() => setSizeGuideOpen(false)}
            className="w-full rounded-xl text-xs font-bold"
          >
            متوجه شدم و سایزم را انتخاب کردم
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
