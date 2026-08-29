"use client";

import Image from "next/image";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { AnimatedBadge } from "@/components/motion/animated-badge";

const TESTIMONIALS = [
  {
    name: "آرمین سعادت",
    role: "کلکسیونر کتونی و طراح مد",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    comment: "من بیش از ۱۰ جفت جردن از این فروشگاه خریدم، از جمله ترویس اسکات ریورس موکا. همه موارد توسط کارشناس اسنیکر چک شد و ۱۰۰٪ اصل و با جعبه نو و بدون ضربه بود.",
    product: "ایر جردن ۱ لو ترویس اسکات",
  },
  {
    name: "مونا درخشانی",
    role: "خریدار تأییدشده از اصفهان",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    comment: "جردن ۴ میلیتاری بلک رو سفارش دادم و دو روزه با تیپاکس رسید. سایز ۴۰ دقیقاً فیت پام بود و بسته‌بندی دولایه‌شون جعبه کتونی رو کاملاً سالم نگه داشته بود.",
    product: "ایر جردن ۴ رترو میلیتاری بلک",
  },
  {
    name: "سامان ابراهیمی",
    role: "بسکتبالیست و خریدار تهران",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    comment: "پیک اختصاصی جردن کلاب کمتر از ۳ ساعت کتونی رو درب منزل تحویل داد و قبل از تحویل اجازه دادند بارکد و کیفیت چرم رو بررسی کنم. پشتیبانی عالی و محترم.",
    product: "ایر جردن ۱ های شیکاگو لاست اند فاند",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            نظرات خریداران تاییدشده
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            تجربه خرید بیش از ۱۵,۰۰۰ همراه
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            دیدگاه کلکسیونرها و همراهان همیشگی کلاب جردن درباره اصالت و سرعت ارسال.
          </p>
        </div>

        {/* Testimonial Cards Grid with 3D TiltCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {TESTIMONIALS.map((item, idx) => (
            <TiltCard key={idx} max={10} glare={true} className="h-full">
              <div className="relative flex flex-col justify-between h-full rounded-3xl border border-border/70 bg-card p-6 sm:p-8 space-y-6 shadow-xs transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-muted-foreground/20" />
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                    «{item.comment}»
                  </p>
                </div>

                {/* Author info */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shrink-0">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground flex items-center gap-1">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground block">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  <AnimatedBadge status="info" size="sm">
                    {item.product}
                  </AnimatedBadge>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
