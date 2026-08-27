export const SITE_CONFIG = {
  name: "JORDAN CLUB",
  nameFa: "جردن کلاب",
  tagline: "مرجع تخصصی کتونی‌های اورجینال ایر جردن و استریت‌ویر",
  description: "بزرگترین فروشگاه تخصصی کتونی‌های ایر جردن ۱، جردن ۴، رترو، همکاری‌های ترویس اسکات و نایک دانک با ضمانت ۱۰۰٪ اصالت و ارسال فوری سراسر ایران.",
  url: "https://jordanclub.ir",
  freeShippingThreshold: 3500000, // 3,500,000 Tomans
  currencyDefault: "TMN" as const,
};

export const NAV_LINKS = [
  { name: "همه کتونی‌ها", href: "/products" },
  { name: "ایر جردن ۱", href: "/categories/jordan-1" },
  { name: "ایر جردن ۴", href: "/categories/jordan-4" },
  { name: "جردن رترو (۳، ۵، ۶)", href: "/categories/jordan-retro" },
  { name: "کالکشن ترویس اسکات", href: "/categories/travis-scott" },
  { name: "ایر جردن ۱۱", href: "/categories/jordan-11" },
  { name: "نایک دانک", href: "/categories/dunk-lifestyle" },
];

export const TRUST_BADGES = [
  {
    icon: "ShieldCheck",
    title: "ضمانت ۱۰۰٪ اصالت فیزیکی و فاکتور",
    description: "تمامی کتونی‌ها دارای برچسب اصالت، جعبه اورجینال و تست بارکد هستند.",
  },
  {
    icon: "Truck",
    title: "ارسال رایگان و فوری سراسر کشور",
    description: "تحویل با پیک اختصاصی در تهران زیر ۳ ساعت و تیپاکس به تمام شهرستان‌ها.",
  },
  {
    icon: "RefreshCw",
    title: "۷ روز مهلت تست و تعویض سایز رایگان",
    description: "در صورت عدم تطابق سایز یا سلیقه، بدون هزینه تعویض یا مرجوع می‌شود.",
  },
  {
    icon: "Sparkles",
    title: "کلکسیون نسخه‌های لیمیتد و کمیاب",
    description: "دسترسی مستقیم به خاص‌ترین مدل‌های کلاب نایک و ترویس اسکات.",
  },
];
