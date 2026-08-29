import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchCommand } from "@/components/layout/search-command";
import { QuickViewModal } from "@/components/layout/quick-view-modal";
import { ProductComparisonModal } from "@/components/shop/product-comparison-modal";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ToastContainer } from "@/components/layout/toast-container";
import { Footer } from "@/components/layout/footer";

const iranYekan = localFont({
  src: [
    {
      path: "../../public/fonts/woff/IRANYekanX-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-UltraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-DemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-Black.woff",
      weight: "850",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-ExtraBlack.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/woff/IRANYekanX-Heavy.woff",
      weight: "950",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "جردن کلاب • مرجع تخصصی کتونی‌های ایر جردن و استریت‌ویر",
  description:
    "فروشگاه تخصصی کتونی‌های اورجینال ایر جردن ۱، جردن ۴، جردن رترو و همکاری‌های نایاب ترویس اسکات با ضمانت ۱۰۰٪ اصالت فیزیکی و ارسال فوری سراسر ایران.",
  keywords: [
    "کتونی جردن",
    "ایر جردن ۱",
    "ایر جردن ۴",
    "جردن شیکاگو",
    "جردن ترویس اسکات",
    "نایک دانک پاندا",
    "خرید کتونی اورجینال",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${iranYekan.variable} ${geistMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/15 selection:text-primary">
        <SmoothScrollProvider>
          <ThemeProvider defaultTheme="system">
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0 overflow-x-clip max-w-full w-full">{children}</main>
            <Footer />

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* Global Client Portals & Drawers */}
            <CartDrawer />
            <SearchCommand />
            <QuickViewModal />
            <ProductComparisonModal />
            <ToastContainer />
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
