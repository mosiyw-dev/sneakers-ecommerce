"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowLeft,
  ShoppingBag,
  History,
  TrendingUp,
  X,
} from "lucide-react";
import { useSearchStore } from "@/stores/search-store";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { PRODUCTS } from "@/data/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/stores/toast-store";

export function SearchCommand() {
  const router = useRouter();
  const {
    isOpen,
    searchQuery,
    recentSearches,
    closeSearch,
    setSearchQuery,
    addRecentSearch,
    clearRecentSearches,
  } = useSearchStore();

  const { addItem, openDrawer } = useCartStore();
  const { format } = useCurrencyStore();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.series.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSelectProduct = (product: typeof PRODUCTS[0]) => {
    addRecentSearch(product.name);
    closeSearch();
    router.push(`/products/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: typeof PRODUCTS[0]) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success("به سبد اضافه شد", `${product.name} به سبد خرید افزوده شد.`);
    closeSearch();
    openDrawer();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      closeSearch();
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSearch()} maxWidth="xl">
      <DialogContent className="p-0 overflow-hidden text-right">
        {/* Search Input Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 border-b border-border px-4 py-3 bg-card"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی مدل کتونی (مثلاً جردن ۴، ترویس اسکات، شیکاگو...)"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <Button type="submit" size="xs" variant="secondary" className="text-xs">
            جستجو
          </Button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Active Search Results */}
          {searchQuery.trim() !== "" ? (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                نتایج جستجو ({searchResults.length})
              </div>

              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  هیچ کتونی با عبارت «{searchQuery}» یافت نشد.
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="group flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary">
                            {product.name}
                          </h4>
                          <span className="text-xs font-mono font-semibold text-foreground">
                            {format(product.price)}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="xs"
                        variant="outline"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="gap-1 text-xs shrink-0 rounded-lg"
                      >
                        <ShoppingBag className="h-3 w-3" />
                        خرید سریع
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default State: Recent & Trending */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <History className="h-3.5 w-3.5" /> جستجوهای اخیر
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-muted-foreground hover:text-foreground lowercase font-normal"
                    >
                      پاک کردن
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          router.push(`/products?q=${encodeURIComponent(term)}`);
                          closeSearch();
                        }}
                        className="rounded-lg bg-muted px-2.5 py-1 text-xs text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> مدل‌های پرطرفدار جردن
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCTS.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-2 rounded-xl border border-border/60 p-2 hover:bg-muted transition-colors"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-foreground truncate block">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {format(p.price)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span>برای انتخاب Enter و برای خروج Esc را بزنید</span>
          <Link
            href="/products"
            onClick={closeSearch}
            className="flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            مشاهده همه کتونی‌ها <ArrowLeft className="h-3 w-3" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
