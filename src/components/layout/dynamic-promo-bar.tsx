"use client";

import * as React from "react";
import { DynamicIsland, DynamicIslandView } from "@/components/motion/dynamic-island";
import { Sparkles, Truck, Tag, Check, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { toast } from "@/stores/toast-store";

export function DynamicPromoBar() {
  const [view, setView] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("JORDAN2026");
    setCopied(true);
    toast.success("کد کپی شد", "کد تخفیف JORDAN2026 در حافظه ذخیره شد.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <DynamicIsland
        view={view}
        compact={
          <button
            onClick={() => setView("promo")}
            className="flex items-center gap-2 text-xs font-black cursor-pointer text-background"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>پیشنهاد ویژه کلاب: ارسال رایگان</span>
          </button>
        }
      >
        <DynamicIslandView id="promo" className="gap-4 text-right">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                <Truck className="h-4 w-4" />
                <span>ارسال اکسپرس رایگان + هدیه بندهای زاپاس</span>
              </div>
              <p className="text-[11px] text-background/80 max-w-xs leading-relaxed">
                برای تمامی سفارش‌های فعال امروز با کد تخفیف ویژه جردن کلاب
              </p>
            </div>

            <button
              onClick={() => setView(null)}
              className="rounded-full p-1 text-background/60 hover:text-background transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/15">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-xl bg-background/20 px-3 py-1.5 text-xs font-mono font-bold text-background hover:bg-background/30 transition-all cursor-pointer"
            >
              <Tag className="h-3 w-3" />
              <span>JORDAN2026</span>
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : null}
            </button>

            <Link
              href="/products"
              onClick={() => setView(null)}
              className="inline-flex items-center gap-1 text-xs font-black text-amber-400 hover:underline mr-auto"
            >
              خرید از کاتالوگ <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </DynamicIslandView>
      </DynamicIsland>
    </div>
  );
}
