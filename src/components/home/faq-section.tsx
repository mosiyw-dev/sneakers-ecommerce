"use client";

import { BouncyAccordion, type BouncyAccordionItem } from "@/components/motion/bouncy-accordion";
import { ShieldCheck, Truck, Sparkles, RefreshCcw, HelpCircle, Flame } from "lucide-react";
import { TextShimmer } from "@/components/motion/text-shimmer";

const FAQ_ITEMS: BouncyAccordionItem[] = [
  {
    id: "authenticity",
    title: "چگونه از ۱۰۰٪ اورجینال بودن کتونی‌ها اطمینان حاصل کنم؟",
    description:
      "تمامی کتونی‌های جردن کلاب مستقیماً از نمایندگی‌های رسمی نایک و پارتنرهای معتبر بین‌المللی خریداری می‌شوند. هر جفت کفش قبل از ارسال توسط کارشناسان خبره اسنیکر طی ۵ مرحله شامل تست دوخت، بارکد UPC جعبه، بوی چرم و انعطاف کپسول هوای Air-Sole بررسی شده و همراه با شناسنامه معتبر فیزیکی و ضمانت بازگشت وجه تقدیم می‌گردد.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    id: "sizing",
    title: "راهنمای انتخاب سایز بین مدل‌های جردن ۱ و جردن ۴ چیست؟",
    description:
      "مدل‌های ایر جردن ۱ به صورت استاندارد (True to Size) هستند، در حالی که مدل‌های جردن ۴ به دلیل پدینگ‌های محافظتی مچ و پنجه محکم‌تر، برای پاهای پهن‌تر پیشنهاد می‌شود نیم سایز بزرگتر انتخاب شوند. در صورت هرگونه ابهام، تیم پشتیبانی ما به صورت لحظه‌ای اندازه دقیق کفی کفش (سانتی‌متر) را در اختیارتان قرار می‌دهد.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "delivery",
    title: "مدت زمان ارسال سفارش‌ها در تهران و شهرستان‌ها چقدر است؟",
    description:
      "سفارش‌های تهران از طریق پیک اکسپرس VIP ظرف کمتر از ۳ ساعت تحویل داده می‌شوند (همراه با امکان پرو ۲ سایز در محل). برای سایر استان‌ها و شهرستان‌ها، ارسال از طریق پست پیشتاز ویژه و تیپاکس ظرف ۲۴ الی ۴۸ ساعت کاری با بسته‌بندی دوجداره ضدضربه انجام می‌پذیرد.",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    id: "exchange",
    title: "شرایط تعویض سایز و بازگشت کالا چگونه است؟",
    description:
      "شما تا ۷ روز کاری پس از تحویل کالا مهلت دارید تا در صورت عدم تطابق سایز یا هرگونه مغایرت، بدون کسر هیچ هزینه‌ای درخواست تعویض سایز یا عودت وجه ثبت فرمایید. شرط تعویض، عدم استفاده فیزیکی در محیط بیرون و سلامت کامل جعبه اصلی کارخانه نایک است.",
    icon: <RefreshCcw className="h-4 w-4" />,
  },
  {
    id: "limited-editions",
    title: "آیا نسخه‌های لیمیتد مانند ترویس اسکات دارای جعبه و بندهای زاپاس هستند؟",
    description:
      "بله، تمامی نسخه‌های کلاب و همکاری‌های ویژه (Special Collabs) همراه با پک کامل کارخانه شامل جعبه اورجینال رنگی، کاغذ مومی نقش‌دار، تگ مخصوص Legit و ۳ الی ۴ دست بند زاپاس فابریک کارخانه تقدیم خریداران عزیز می‌گردد.",
    icon: <Flame className="h-4 w-4" />,
  },
];

export function FaqSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-border/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            مرکز پاسخ به سوالات خریداران
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            سوالات متداول کلکسیونرها
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            پاسخ به پرتکرارترین پرسش‌ها پیرامون اصالت کالا، تست بارکد و نحوه تحویل اکسپرس.
          </p>
        </div>

        {/* beUI Bouncy Accordion */}
        <div className="pt-2">
          <BouncyAccordion items={FAQ_ITEMS} defaultValue="authenticity" />
        </div>
      </div>
    </section>
  );
}
