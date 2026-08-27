import { HeroSection } from "@/components/home/hero-section";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { CategoryBento } from "@/components/home/category-bento";
import { CuratedTabs } from "@/components/home/curated-tabs";
import { EditorialFeature } from "@/components/home/editorial-feature";
import { FaqSection } from "@/components/home/faq-section";
import { Testimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BrandMarquee />
      <CategoryBento />
      <CuratedTabs />
      <EditorialFeature />
      <FaqSection />
      <Testimonials />
    </div>
  );
}
