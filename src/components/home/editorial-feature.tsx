"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Award, Zap } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { ExpandingArrowButton } from "@/components/motion/expanding-arrow-button";
import { TextShimmer } from "@/components/motion/text-shimmer";

export function EditorialFeature() {
  return (
    <section className="py-16 sm:py-24 border-b border-border/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Right Col: Editorial Visual Showcase with TiltCard */}
          <div className="lg:col-span-6 relative">
            <TiltCard max={8} glare={true}>
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-muted border border-border/80 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80"
                  alt="تکنولوژی بالشتک نایک ایر و چرم طبیعی جردن"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Floating Hologram Tech Card */}
                <div className="absolute bottom-6 right-6 left-6 flex items-center justify-between rounded-2xl bg-background/90 backdrop-blur-md p-4 border border-border shadow-xl">
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                      تکنولوژی ثبت‌شده نایک
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-foreground">
                      کپسول‌های هوای فشرده Nike Air-Sole
                    </h4>
                  </div>
                  <AnimatedBadge status="success" size="sm">
                    ۱۰۰٪ اورجینال
                  </AnimatedBadge>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Left Col: Storytelling & Craftsmanship */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <AnimatedBadge status="warning" size="md">
                اصالت و تاریخچه ۴۰ ساله
              </AnimatedBadge>
              <TextShimmer duration={2.2} className="text-xs font-bold">
                از زمین بسکتبال ۱۹۸۵ تا اوج استریت‌ویر
              </TextShimmer>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.2]">
              داستان یک پرواز افسانه‌ای؛ <br />
              <span className="bg-gradient-to-l from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                ۴ دهه پیشتازی بی‌رقیب
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              کتونی‌های ایر جردن صرفاً یک کفش ورزشی نیستند؛ نمادی از جسارت، فرهنگ هیپ‌هاپ و شکستن مرزها هستند. در جردن کلاب، تمام مدل‌ها مستقیماً از نمایندگی‌های رسمی نایک در اروپا و امارات تأمین شده و تحت ۵ مرحله بررسی کارشناسی اصالت فیزیکی، دوخت، تست بارکد و کپسول هوا قرار می‌گیرند.
            </p>

            {/* Stats Matrix with AnimatedNumber */}
            <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/60">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                  +<AnimatedNumber value={15000} duration={1.5} />
                </div>
                <span className="text-[11px] text-muted-foreground font-bold block">
                  سفارش موفق در کشور
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-primary font-mono">
                  ٪<AnimatedNumber value={100} duration={1.2} />
                </div>
                <span className="text-[11px] text-muted-foreground font-bold block">
                  اصالت فیزیکی تضمینی
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                  ۵ مرحله
                </div>
                <span className="text-[11px] text-muted-foreground font-bold block">
                  بررسی کارشناسی تخصصی
                </span>
              </div>
            </div>

            {/* Checklist of value points */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>چرم طبیعی فرآوری‌شده:</strong> مقاومت فوق‌العاده در برابر سایش و حفظ فرم پنجه کفش.
                </span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>بسته‌بندی اورجینال دوجداره:</strong> همراه با کارت گارانتی، کاغذ بسته‌بندی کارخانه و بندهای یدک.
                </span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>پشتیبانی سایز و تعویض رایگان:</strong> امکان پرو در محل برای تهران و تعویض آسان سراسر کشور.
                </span>
              </div>
            </div>

            <div className="pt-3">
              <Link href="/products">
                <ExpandingArrowButton accentClassName="bg-primary text-primary-foreground">
                  خرید کتونی‌های اورجینال جردن
                </ExpandingArrowButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
