import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { ProductGrid } from "@/components/shop/product-grid";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: `دسته‌بندی یافت نشد • ${SITE_CONFIG.nameFa}` };
  return {
    title: `${category.name} • ${SITE_CONFIG.nameFa}`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.category === category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-right">
      {/* Category Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-muted min-h-[260px] sm:min-h-[320px] flex flex-col justify-end p-6 sm:p-12">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        <div className="relative z-10 space-y-3 text-white max-w-2xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white mb-1 transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5" /> بازگشت به کاتالوگ همه کتونی‌ها
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Products Stream */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <p className="text-xs text-muted-foreground">
            نمایش <strong className="text-foreground font-mono">{categoryProducts.length}</strong> مدل اورجینال در {category.name}
          </p>
          <Link
            href={`/products?category=${category.slug}`}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            فیلتر پیشرفته در کاتالوگ <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductGrid products={categoryProducts} viewMode="grid-4" />
      </div>
    </div>
  );
}
