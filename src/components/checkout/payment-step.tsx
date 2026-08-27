"use client";

import * as React from "react";
import { PaymentDetails } from "@/types";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  Building2,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStepProps {
  initialPayment: PaymentDetails;
  totalAmount: string;
  onBack: () => void;
  onSubmitOrder: (payment: PaymentDetails) => void;
  isProcessing: boolean;
}

export function PaymentStep({
  initialPayment,
  totalAmount,
  onBack,
  onSubmitOrder,
  isProcessing,
}: PaymentStepProps) {
  const [formData, setFormData] = React.useState<PaymentDetails>(initialPayment);

  const handleMethodChange = (method: PaymentDetails["method"]) => {
    setFormData((prev) => ({ ...prev, method }));
  };

  const validate = (): boolean => {
    return true; // Seamless simulated gateway validation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmitOrder(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          انتخاب شیوه پرداخت
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          کلیه تراکنش‌ها از طریق درگاه امن شاپرک و با پروتکل امنیتی SSL انجام می‌شوند.
        </p>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => handleMethodChange("online_gateway")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border p-4 cursor-pointer transition-all duration-200 text-center gap-2",
            formData.method === "online_gateway"
              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
              : "border-border/80 bg-card hover:bg-muted/40"
          )}
        >
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground">
            درگاه بانکی شتاب (شاپرک)
          </span>
          <span className="text-[10px] text-muted-foreground">
            تمامی کارت‌های عضو شتاب
          </span>
        </div>

        <div
          onClick={() => handleMethodChange("card_to_card")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border p-4 cursor-pointer transition-all duration-200 text-center gap-2",
            formData.method === "card_to_card"
              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
              : "border-border/80 bg-card hover:bg-muted/40"
          )}
        >
          <Building2 className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground">
            کارت به کارت مستقیم
          </span>
          <span className="text-[10px] text-muted-foreground">
            واریز فیش و تأیید واتس‌اپ
          </span>
        </div>

        <div
          onClick={() => handleMethodChange("crypto")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border p-4 cursor-pointer transition-all duration-200 text-center gap-2",
            formData.method === "crypto"
              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
              : "border-border/80 bg-card hover:bg-muted/40"
          )}
        >
          <Coins className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground">
            تتر / ارز دیجیتال (USDT)
          </span>
          <span className="text-[10px] text-muted-foreground">
            پرداخت بر بستر TRC20
          </span>
        </div>
      </div>

      {/* Online Gateway Info & Security Trust Box */}
      {formData.method === "online_gateway" && (
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">
                اتصال مستقیم به درگاه امن پرداخت رسمی
              </h4>
              <p className="text-[11px] text-muted-foreground">
                پس از کلیک، به صفحه پرداخت الکترونیک بانک هدایت خواهید شد.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-card p-3 border border-border flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">مبلغ نهایی تراکنش:</span>
            <span className="text-primary font-bold font-mono text-sm">{totalAmount}</span>
          </div>
        </div>
      )}

      {formData.method === "card_to_card" && (
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3 text-xs">
          <h4 className="font-bold text-foreground">اطلاعات حساب واریز جردن کلاب:</h4>
          <div className="bg-card p-3 rounded-xl border border-border space-y-1 font-mono">
            <div>شماره کارت: <strong className="text-foreground">۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸</strong></div>
            <div>به نام: <strong>فروشگاه تخصصی جردن کلاب</strong> (بانک ملی)</div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            پس از ثبت، شماره پیگیری سفارش را همراه با تصویر فیش به پشتیبانی ارسال فرمایید.
          </p>
        </div>
      )}

      {formData.method === "crypto" && (
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3 text-xs">
          <h4 className="font-bold text-foreground">آدرس کیف پول تتر (USDT-TRC20):</h4>
          <div className="bg-card p-3 rounded-xl border border-border font-mono text-[11px] break-all select-all text-left">
            TX9z8qL9pMnKbWvQ2yRrTeEsVxZnB4kL9w
          </div>
        </div>
      )}

      {/* Trust & Submit */}
      <div className="pt-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="gap-2 rounded-xl text-xs font-semibold"
        >
          <ArrowRight className="h-4 w-4" /> بازگشت به شیوه ارسال
        </Button>

        <Button
          type="submit"
          size="lg"
          disabled={isProcessing}
          className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          <Lock className="h-4 w-4" />
          {isProcessing ? "در حال ثبت سفارش و اتصال..." : `پرداخت نهایی (${totalAmount})`}
        </Button>
      </div>
    </form>
  );
}
