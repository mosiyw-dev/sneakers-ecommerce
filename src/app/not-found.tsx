import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16 text-right">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-foreground mb-6 border border-border">
        <Compass className="h-10 w-10 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-primary">
        خطای ۴۰۴ • صفحه مورد نظر یافت نشد
      </span>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground mt-2 mb-3">
        کتونی یا آدرس یافت نشد
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        صفحه یا مدل کتونی مورد نظر شما ممکن است جابه‌جا شده یا ناموجود شده باشد.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="outline" className="rounded-xl font-semibold">
            بازگشت به صفحه اصلی
          </Button>
        </Link>
        <Link href="/products">
          <Button className="gap-2 rounded-xl font-bold shadow-md">
            مشاهده کاتالوگ کتونی‌ها <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
