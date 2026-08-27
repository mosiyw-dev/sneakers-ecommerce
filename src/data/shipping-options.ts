import { PromoCode, ShippingOption } from "@/types";

export const PROMO_CODES: PromoCode[] = [
  {
    code: "JORDAN10",
    discountType: "percentage",
    discountValue: 10,
    description: "۱۰٪ تخفیف ویژه خرید اول کتونی",
  },
  {
    code: "CACTUS20",
    discountType: "percentage",
    discountValue: 20,
    minSubtotal: 10000000,
    description: "۲۰٪ تخفیف برای سفارش‌های بالای ۱۰ میلیون تومان",
  },
  {
    code: "OFF500",
    discountType: "fixed",
    discountValue: 500000,
    minSubtotal: 6000000,
    description: "۵۰۰ هزار تومان تخفیف نقدی روی سفارش‌های بالای ۶ میلیون تومان",
  },
  {
    code: "FREESHIP",
    discountType: "percentage",
    discountValue: 5,
    description: "۵٪ تخفیف عضویت باشگاه مشتریان جردن کلاب",
  },
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    name: "پست پیشتاز اختصاصی سراسری",
    description: "بسته‌بندی دولایه ضد ضربه + ارسال فوری با پیامک رهگیری پستی",
    estimatedDays: "۲ الی ۳ روز کاری",
    price: 65000,
    freeAbove: 3500000,
  },
  {
    id: "express",
    name: "پیک اکسپرس فوری (مخصوص تهران و کرج)",
    description: "تحویل درب منزل با هماهنگی تلفنی و امکان بررسی سایز",
    estimatedDays: "تحویل زیر ۳ ساعت",
    price: 150000,
  },
  {
    id: "tipax",
    name: "تیپاکس ویژه باربری هوایی",
    description: "ارسال سریع به درب منزل در تمام شهرستان‌ها با بیمه کامل ارزش کتونی",
    estimatedDays: "۲۴ الی ۴۸ ساعت",
    price: 120000,
  },
];
