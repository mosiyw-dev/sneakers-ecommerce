"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  PackageCheck,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  MapPin,
  Calendar,
} from "lucide-react";
import { Order } from "@/types";
import { useCurrencyStore } from "@/stores/currency-store";
import { Button } from "@/components/ui/button";
import { toast } from "@/stores/toast-store";
import confetti from "canvas-confetti";

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const { format } = useCurrencyStore();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Confetti celebration blast
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleCopyOrderNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      toast.success("کپی شد", "شماره سفارش در کلیپ‌بورد کپی شد.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 text-right">
      {/* Celebration Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          سفارش با موفقیت ثبت و تایید شد
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          تبریک! کتونی شما در حال آماده‌سازی است
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
          فاکتور رسمی و کد رهگیری پستی به ایمیل <strong className="text-foreground">{order.shippingAddress.email}</strong> ارسال شد.
        </p>
      </div>

      {/* Order Info & Tracking Badge Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs text-muted-foreground block">کد پیگیری سفارش:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black text-foreground font-mono">
                {order.orderNumber}
              </span>
              <button
                onClick={handleCopyOrderNumber}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="کپی شماره سفارش"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 rounded-xl text-xs"
            >
              <Printer className="h-3.5 w-3.5" /> چاپ فاکتور
            </Button>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            وضعیت پردازش و بسته‌بندی
          </h4>

          <div className="relative flex items-center justify-between text-xs pt-2">
            <div className="flex flex-col items-center gap-1 z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-foreground">تأیید پرداخت</span>
            </div>

            <div className="flex flex-col items-center gap-1 z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                <PackageCheck className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-foreground">کنترل اصالت و پلمپ</span>
            </div>

            <div className="flex flex-col items-center gap-1 z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted border-2 border-border text-muted-foreground">
                3
              </div>
              <span className="text-muted-foreground">تحویل به پست/پیک</span>
            </div>

            <div className="flex flex-col items-center gap-1 z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted border-2 border-border text-muted-foreground">
                4
              </div>
              <span className="text-muted-foreground">تحویل درب منزل</span>
            </div>

            {/* Background Line */}
            <div className="absolute top-5 inset-x-8 h-0.5 bg-border -z-0">
              <div className="h-full bg-emerald-500 w-1/3" />
            </div>
          </div>
        </div>

        {/* Order Details & Summary Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-6 text-xs">
          {/* Shipping destination */}
          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> آدرس تحویل سفارش:
            </span>
            <p className="text-foreground font-medium leading-relaxed">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName} <br />
              {order.shippingAddress.street} {order.shippingAddress.apartment && ` - ${order.shippingAddress.apartment}`} <br />
              {order.shippingAddress.city}، {order.shippingAddress.state} <br />
              تلفن تماس: {order.shippingAddress.phone}
            </p>
          </div>

          {/* Delivery speed */}
          <div className="space-y-1.5">
            <span className="font-bold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" /> شیوه و زمان تحویل:
            </span>
            <p className="text-foreground font-medium">
              {order.shippingOption.name} <br />
              <span className="text-primary font-bold">
                تحویل تخمینی: {order.estimatedDelivery}
              </span>
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="border-t border-border pt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            اقلام خریداری‌شده
          </h4>
          <div className="divide-y divide-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-foreground truncate">
                    {item.productName}
                  </h5>
                  <span className="text-[11px] text-muted-foreground">
                    تعداد: {item.quantity} جفت {item.size && `• سایز EU ${item.size}`}
                  </span>
                </div>
                <span className="text-xs font-bold text-foreground font-mono">
                  {format(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Receipt Total */}
        <div className="border-t border-border pt-4 space-y-1.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>مبلغ کل کتونی‌ها:</span>
            <span className="font-mono text-foreground">{format(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>تخفیف اعمال‌شده:</span>
              <span className="font-mono">-{format(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>هزینه ارسال:</span>
            <span className="font-mono text-foreground">
              {order.shippingCost === 0 ? "رایگان" : format(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-black text-foreground border-t border-border pt-2">
            <span>مبلغ پرداختی نهایی:</span>
            <span className="font-mono text-base text-primary">
              {format(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Return to shop */}
      <div className="text-center pt-2">
        <Link href="/products">
          <Button size="lg" className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md">
            مشاهده سایر مدل‌های جردن کلاب <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
