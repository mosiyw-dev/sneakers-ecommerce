import { Suspense } from "react";
import { CatalogView } from "@/components/shop/catalog-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Catalog & Artifacts • LUMEN",
  description: "Browse our complete collection of architectural tech, audio monitors, minimalist apparel, and luxury horology.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-96 rounded-2xl hidden md:block" />
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} className="h-80 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
