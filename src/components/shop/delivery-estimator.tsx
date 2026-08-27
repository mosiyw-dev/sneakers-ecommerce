"use client";

import * as React from "react";
import { Truck, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DeliveryEstimator() {
  const [zipCode, setZipCode] = React.useState("");
  const [estimatedLocation, setEstimatedLocation] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setEstimatedLocation("تهران و مراکز استان‌ها");
      setLoading(false);
    }, 300);
  };

  const cutoffTime = "۳ ساعت و ۲۴ دقیقه";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 text-xs text-right">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Truck className="h-4 w-4 text-primary" />
          <span>محاسبه زمان تحویل کتونی</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
          <Clock className="h-3 w-3" /> ثبت سفارش تا {cutoffTime} برای ارسال امروز
        </span>
      </div>

      <form onSubmit={handleEstimate} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="کد پستی یا نام شهر (مثلاً تهران، شیراز، اصفهان...)"
            className="h-8 pr-8 text-xs rounded-xl"
            maxLength={15}
          />
        </div>
        <Button
          type="submit"
          size="xs"
          variant="secondary"
          disabled={loading || !zipCode.trim()}
          className="h-8 px-3 rounded-xl font-semibold"
        >
          {loading ? "در حال استعلام..." : "محاسبه"}
        </Button>
      </form>

      {estimatedLocation ? (
        <div className="rounded-xl bg-muted/40 p-3 space-y-1.5 text-muted-foreground">
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>تخمین زمان ارسال به {zipCode}:</span>
          </div>
          <div className="flex justify-between">
            <span>• پیک اکسپرس تهران و کرج:</span>
            <strong className="text-foreground">امروز تا ساعت ۱۹</strong>
          </div>
          <div className="flex justify-between">
            <span>• پست پیشتاز و تیپاکس سراسری:</span>
            <strong className="text-foreground">حداکثر ۲ الی ۳ روز کاری</strong>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          ارسال رایگان سراسر ایران برای خریدهای بالای ۳.۵ میلیون تومان همراه با بیمه سلامت کالا.
        </p>
      )}
    </div>
  );
}
