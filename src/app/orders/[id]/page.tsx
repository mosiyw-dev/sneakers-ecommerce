import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

interface OrderLookupPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderLookupPage({ params }: OrderLookupPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-right">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowRight className="h-3.5 w-3.5" /> بازگشت به کاتالوگ کتونی‌ها
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          پیگیری و استعلام وضعیت سفارش
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          کد پیگیری: <strong className="font-mono text-foreground">{id}</strong>
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              سفارش شما در حال پردازش و کنترل اصالت است
            </h3>
            <p className="text-xs text-muted-foreground">
              تحویل تخمینی: ۲ الی ۳ روز کاری با پست پیشتاز و بیمه باربری.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-foreground">تأیید پرداخت</span>
          </div>
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-foreground">کنترل اصالت</span>
          </div>
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">تحویل به پست</span>
          </div>
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">تحویل درب منزل</span>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/40 p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>ضمانت ۱۰۰٪ اصالت فیزیکی و فاکتور چاپی نایک</span>
          </div>
          <p className="text-muted-foreground">
            جهت هرگونه راهنمایی یا استعلام لحظه‌ای لوکیشن بسته، با پشتیبانی جردن کلاب در ارتباط باشید.
          </p>
        </div>
      </div>
    </div>
  );
}
