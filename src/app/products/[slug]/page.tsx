import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { PdpClient } from "@/components/shop/pdp-client";
import { SITE_CONFIG } from "@/lib/constants";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: `کتونی یافت نشد • ${SITE_CONFIG.nameFa}` };
  return {
    title: `${product.name} (${product.nameEn}) • ${SITE_CONFIG.nameFa}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.images[0].url }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return <PdpClient product={product} relatedProducts={relatedProducts} />;
}
