"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  maxStock: number;
  onChange: (quantity: number) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function QuantityStepper({
  quantity,
  maxStock,
  onChange,
  className,
  size = "default",
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock) {
      onChange(quantity + 1);
    }
  };

  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-11 text-sm",
    lg: "h-12 text-base",
  };

  const buttonSizes = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-11 h-11",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-2xl border border-border bg-muted/40 p-1 shadow-2xs",
        sizeClasses[size],
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className={cn(
          "flex items-center justify-center rounded-xl text-muted-foreground hover:bg-background hover:text-foreground active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none",
          buttonSizes[size]
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="min-w-10 text-center font-bold text-foreground">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= maxStock}
        className={cn(
          "flex items-center justify-center rounded-xl text-muted-foreground hover:bg-background hover:text-foreground active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none",
          buttonSizes[size]
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
