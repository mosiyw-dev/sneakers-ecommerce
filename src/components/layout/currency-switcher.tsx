"use client";

import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useCurrencyStore } from "@/stores/currency-store";
import { CURRENCIES } from "@/lib/formatters";
import { CurrencyCode } from "@/types";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({ className }: { className?: string }) {
  const isMounted = useIsMounted();
  const { currency, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentInfo = isMounted ? CURRENCIES[currency] : CURRENCIES.TMN;
  const currentCode = isMounted ? currency : "TMN";

  return (
    <div className={cn("relative inline-block text-right", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{currentInfo.name}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-40 origin-top-left rounded-xl border border-border bg-card p-1 text-card-foreground shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
            انتخاب واحد پول
          </div>
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
            const item = CURRENCIES[code];
            const isSelected = code === currentCode;
            return (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors text-right",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span>{item.name}</span>
                <span className="opacity-70">{item.symbol}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
