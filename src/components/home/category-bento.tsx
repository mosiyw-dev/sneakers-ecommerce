"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { TiltCard } from "@/components/motion/tilt-card";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { TextShimmer } from "@/components/motion/text-shimmer";

export function CategoryBento() {
  const [cat1, cat2, cat3, cat4] = CATEGORIES;

  return (
    <section className="py-16 sm:py-24 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                دسته‌بندی‌های تخصصی
              </span>
              <TextShimmer duration={2.5} className="text-xs font-bold">
                • کالکشن ۲۰۲۶
              </TextShimmer>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              کلکسیون سیلوئت‌های اصیل جردن
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-4 py-2 text-xs font-black text-foreground hover:bg-muted transition-all"
          >
            مشاهده تمام مدل‌ها <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Bento Grid with 3D TiltCards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-right">
          {/* Card 1: Large Banner (Jordan 1) */}
          <div className="md:col-span-8">
            <TiltCard max={8} glare={true} className="h-full">
              <Link
                href={`/categories/${cat1.slug}`}
                className="group relative flex flex-col justify-between h-full min-h-[380px] sm:min-h-[440px] overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-8 transition-all duration-300"
              >
                <Image
                  src={cat1.image}
                  alt={cat1.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="relative z-10 flex justify-between items-start">
                  <AnimatedBadge status="danger" size="md">
                    {cat1.badge}
                  </AnimatedBadge>
                  <span className="rounded-full bg-background/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold text-foreground border border-white/10 shadow-sm">
                    {cat1.itemCount} مدل فعال
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                    {cat1.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md line-clamp-2 leading-relaxed">
                    {cat1.description}
                  </p>
                  <div className="inline-flex items-center gap-2 pt-2 text-xs sm:text-sm font-black text-primary">
                    ورود به کالکشن جردن ۱ <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </div>

          {/* Card 2: Jordan 4 */}
          <div className="md:col-span-4">
            <TiltCard max={10} glare={true} className="h-full">
              <Link
                href={`/categories/${cat2.slug}`}
                className="group relative flex flex-col justify-between h-full min-h-[380px] sm:min-h-[440px] overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-7 transition-all duration-300"
              >
                <Image
                  src={cat2.image}
                  alt={cat2.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="relative z-10 flex justify-between items-start">
                  <AnimatedBadge status="info" size="md">
                    {cat2.badge}
                  </AnimatedBadge>
                  <span className="rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-foreground border border-white/10 shadow-sm">
                    {cat2.itemCount} جفت
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                    {cat2.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat2.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary pt-1">
                    کالکشن جردن ۴ <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </div>

          {/* Card 3: Travis Scott */}
          <div className="md:col-span-6">
            <TiltCard max={9} glare={true} className="h-full">
              <Link
                href={`/categories/${cat3.slug}`}
                className="group relative flex flex-col justify-between h-full min-h-[320px] overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-8 transition-all duration-300"
              >
                <Image
                  src={cat3.image}
                  alt={cat3.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="relative z-10 flex justify-between items-start">
                  <AnimatedBadge status="warning" size="md">
                    {cat3.badge}
                  </AnimatedBadge>
                  <span className="rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-foreground border border-white/10 shadow-sm">
                    لیمیتد ادیشن
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                    {cat3.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat3.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary pt-1">
                    مشاهده مدل‌های ترویس اسکات <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </div>

          {/* Card 4: Jordan 11 */}
          <div className="md:col-span-6">
            <TiltCard max={9} glare={true} className="h-full">
              <Link
                href={`/categories/${cat4.slug}`}
                className="group relative flex flex-col justify-between h-full min-h-[320px] overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-8 transition-all duration-300"
              >
                <Image
                  src={cat4.image}
                  alt={cat4.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="relative z-10 flex justify-between items-start">
                  <AnimatedBadge status="neutral" size="md">
                    {cat4.badge}
                  </AnimatedBadge>
                  <span className="rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-foreground border border-white/10 shadow-sm">
                    {cat4.itemCount} مدل
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                    {cat4.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat4.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary pt-1">
                    کالکشن رترو و پرفورمنس <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
