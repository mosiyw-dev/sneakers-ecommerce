import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, name: "آدرس و گیرنده" },
  { id: 2, name: "شیوه ارسال" },
  { id: 3, name: "پرداخت و فاکتور" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full max-w-xl mx-auto py-4 text-right">
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 font-mono",
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md"
                      : "border-2 border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold text-center",
                    isCurrent || isCompleted
                      ? "text-foreground font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 sm:mx-4 transition-all duration-500 rounded-full",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
