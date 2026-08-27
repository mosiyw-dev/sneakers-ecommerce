"use client";

import * as React from "react";
import { ShippingAddress } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

interface ShippingStepProps {
  initialAddress: ShippingAddress;
  onContinue: (address: ShippingAddress) => void;
}

export function ShippingStep({ initialAddress, onContinue }: ShippingStepProps) {
  const [formData, setFormData] = React.useState<ShippingAddress>(initialAddress);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const handleChange = (field: keyof ShippingAddress, val: string | boolean | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDemoFill = () => {
    setFormData({
      firstName: "علی",
      lastName: "محمدی",
      email: "ali.mohammadi@example.com",
      phone: "09121234567",
      street: "خیابان فرشته، خیابان مریم غربی، پلاک ۱۲",
      apartment: "واحد ۴، زنگ ۴",
      city: "تهران",
      state: "تهران",
      postalCode: "1965843211",
      country: "ایران",
      saveAddress: true,
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!formData.firstName.trim()) errs.firstName = "نام الزامی است";
    if (!formData.lastName.trim()) errs.lastName = "نام خانوادگی الزامی است";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errs.email = "ایمیل معتبر الزامی است";
    if (!formData.phone.trim() || formData.phone.length < 10)
      errs.phone = "شماره همراه معتبر الزامی است";
    if (!formData.street.trim()) errs.street = "آدرس پستی الزامی است";
    if (!formData.city.trim()) errs.city = "نام شهر الزامی است";
    if (!formData.postalCode.trim() || formData.postalCode.length < 10)
      errs.postalCode = "کد پستی ۱۰ رقمی الزامی است";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            اطلاعات تحویل‌گیرنده و آدرس
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            کتونی شما در بسته‌بندی پلمپ و بیمه‌شده ارسال خواهد شد.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleDemoFill}
          className="gap-1.5 rounded-xl text-xs"
        >
          <Sparkles className="h-3 w-3 text-amber-500" />
          تکمیل خودکار (تست)
        </Button>
      </div>

      <div className="space-y-4">
        {/* First & Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              نام <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="مثلاً علی"
              error={errors.firstName}
              className="text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              نام خانوادگی <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="مثلاً محمدی"
              error={errors.lastName}
              className="text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              ایمیل جهت دریافت فاکتور <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@example.com"
              error={errors.email}
              className="text-xs rounded-xl font-mono text-left"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              شماره همراه (جهت هماهنگی پیک و پیامک رهگیری) <span className="text-destructive">*</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="09121234567"
              error={errors.phone}
              className="text-xs rounded-xl font-mono text-left"
            />
          </div>
        </div>

        {/* Street address */}
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            آدرس دقیق پستی <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک"
            error={errors.street}
            className="text-xs rounded-xl"
          />
        </div>

        {/* Apartment / Floor */}
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            واحد، طبقه یا توضیحات زنگ (اختیاری)
          </label>
          <Input
            type="text"
            value={formData.apartment || ""}
            onChange={(e) => handleChange("apartment", e.target.value)}
            placeholder="مثلاً واحد ۴، طبقه دوم"
            className="text-xs rounded-xl"
          />
        </div>

        {/* City & State & Postal code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              استان <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="مثلاً تهران"
              className="text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              شهر <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="مثلاً تهران"
              error={errors.city}
              className="text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              کد پستی ۱۰ رقمی <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="1234567890"
              maxLength={10}
              error={errors.postalCode}
              className="text-xs rounded-xl font-mono text-left"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end">
        <Button
          type="submit"
          size="lg"
          className="gap-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md active:scale-95"
        >
          مرحله بعد: انتخاب شیوه ارسال <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
