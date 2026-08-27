"use client";

import * as React from "react";
import { SHIPPING_OPTIONS } from "@/data/shipping-options";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Truck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryStepProps {
  selectedOptionId: string;
  subtotal: number;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function DeliveryStep({
  selectedOptionId,
  subtotal,
  onSelect,
  onBack,
  onContinue,
}: DeliveryStepProps) {
  const { format } = useCurrencyStore();

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          انتخاب شیوه و سرعت ارسال
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          بسته به مقصد شما، تحویل با پیک اختصاصی یا پست پیشتاز هوایی انجام می‌شود.
        </p>
      </div>

      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isFree =
            option.freeAbove !== undefined && subtotal >= option.freeAbove;
          const effectivePrice = isFree ? 0 : option.price;

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "group relative flex items-center justify-between rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                  : "border-border/80 bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border transition-all shrink-0",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 bg-background"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      {option.name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                  <span className="text-[11px] font-semibold text-primary/90 mt-1 block">
                    زمان تحویل: {option.estimatedDays}
                  </span>
                </div>
              </div>

              <div className="text-left font-mono shrink-0 pr-2">
                {isFree ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    رایگان
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {format(effectivePrice)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-2 rounded-xl text-xs font-semibold"
        >
          <ArrowRight className="h-4 w-4" /> بازگشت به آدرس
        </Button>

        <Button
          type="button"
          onClick={onContinue}
          size="lg"
          className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md active:scale-95"
        >
          مرحله بعد: درگاه پرداخت و تسویه <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
