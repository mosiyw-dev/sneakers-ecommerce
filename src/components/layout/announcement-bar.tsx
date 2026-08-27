"use client";

import * as React from "react";
import { Sparkles, X, ArrowLeft, Flame } from "lucide-react";
import Link from "next/link";
import { TextShimmer } from "@/components/motion/text-shimmer";

export function AnnouncementBar() {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  return (
    <aside
      aria-label="اطلاعیه"
      className="relative z-40 bg-foreground text-background text-[11px] sm:text-xs font-bold py-2 px-4 transition-all"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 sm:gap-3 text-center">
        <span className="inline-flex items-center gap-1.5 text-amber-400">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <TextShimmer duration={2}>کالکشن ویژه جردن ۲۰۲۶</TextShimmer>
        </span>
        <span className="hidden sm:inline text-background/40">|</span>
        <span className="text-background/90">
          ارسال رایگان پستی و پیک فوری تهران برای سفارش‌های امروز
        </span>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-amber-400 underline underline-offset-4 hover:opacity-80 transition-opacity mr-1"
        >
          مشاهده کاتالوگ <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      <button
        onClick={() => setIsOpen(false)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-background/60 hover:text-background transition-colors cursor-pointer"
        aria-label="بستن بنر"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
}
