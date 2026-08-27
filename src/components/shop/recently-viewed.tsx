"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { History } from "lucide-react";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { useIsMounted } from "@/hooks/use-is-mounted";

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const isMounted = useIsMounted();
  const { items } = useRecentlyViewedStore();
  const { format } = useCurrencyStore();

  const filteredItems = React.useMemo(() => {
    if (!currentProductId) return items.slice(0, 6);
    return items.filter((p) => p.id !== currentProductId).slice(0, 6);
  }, [items, currentProductId]);

  if (!isMounted || filteredItems.length === 0) return null;

  return (
    <section className="space-y-6 pt-12 border-t border-border/80 text-right">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          کتونی‌های اخیراً مشاهده شده
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {filteredItems.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex flex-col rounded-2xl border border-border/60 bg-card p-2.5 transition-all duration-200 hover:border-border hover:shadow-lg"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted mb-2">
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground truncate">
              {product.brand}
            </span>
            <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {product.name}
            </h4>
            <span className="text-xs font-bold text-foreground font-mono mt-1">
              {format(product.price)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
