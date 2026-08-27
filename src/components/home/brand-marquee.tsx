"use client";

import { Marquee } from "@/components/motion/marquee";
import { ShieldCheck, Truck, Sparkles, Award, Zap, Flame, RefreshCw } from "lucide-react";

const BRAND_COLLABS = [
  { label: "AIR JORDAN RETRO", sub: "کالکشن کلاسیک ۱۹۸۵", icon: Flame },
  { label: "TRAVIS SCOTT", sub: "Cactus Jack Edition", icon: Zap },
  { label: "NIKE AIR CUSHIONING", sub: "فناوری بالشتک هوا", icon: Sparkles },
  { label: "۱۰۰٪ ضمانت اصالت فیزیکی", sub: "شناسنامه معتبر کارخانه", icon: ShieldCheck },
  { label: "FRAGMENT DESIGN", sub: "کالکشن مشترک فوجیوارا", icon: Award },
  { label: "ارسال فوری همان‌روز", sub: "پیک ویژه تهران و تیپاکس", icon: Truck },
  { label: "۷ روز ضمانت تعویض سایز", sub: "پرو اختصاصی در محل", icon: RefreshCw },
];

export function BrandMarquee() {
  return (
    <div className="border-y border-border/70 bg-muted/30 py-5 overflow-hidden backdrop-blur-xs">
      <Marquee speed={32} gap="2rem" pauseOnHover>
        {BRAND_COLLABS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/80 px-5 py-2.5 shadow-xs backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-black tracking-wide text-foreground">
                  {item.label}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {item.sub}
                </span>
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
