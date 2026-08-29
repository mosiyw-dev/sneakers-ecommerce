"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  History,
  TrendingUp,
  X,
  Sparkles,
  Flame,
  Percent,
} from "lucide-react";
import { useSearchStore } from "@/stores/search-store";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { PRODUCTS } from "@/data/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/stores/toast-store";
import { motion, AnimatePresence } from "framer-motion";

const POPULAR_TAGS = [
  { label: "ایر جردن ۱", query: "جردن ۱", icon: Sparkles },
  { label: "جردن ۴ رترو", query: "جردن ۴", icon: Flame },
  { label: "ترویس اسکات", query: "ترویس اسکات", icon: Sparkles },
  { label: "شیکاگو ۱۹۸۵", query: "شیکاگو", icon: Flame },
  { label: "تخفیف ویژه", query: "تخفیف", icon: Percent },
];

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
  const mobileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        mobileInputRef.current?.focus();
      }, 60);
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
    ).slice(0, 8);
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

  const handleSelectQuery = (q: string) => {
    setSearchQuery(q);
    addRecentSearch(q);
    closeSearch();
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Dedicated Full-Screen Search View */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-background text-foreground md:hidden text-right"
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {/* Top Search App Bar */}
          <div className="flex items-center gap-2 border-b border-border/80 p-3 bg-card">
            <button
              type="button"
              onClick={closeSearch}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted active:scale-90 transition-all shrink-0 touch-target"
              aria-label="بستن جستجو"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 relative">
              <input
                ref={mobileInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی جردن ۱، جردن ۴، ترویس اسکات..."
                enterKeyHint="search"
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                className="w-full h-10 rounded-xl bg-muted/60 px-3.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label="پاک کردن متن"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <Button
              type="button"
              size="sm"
              onClick={handleSearchSubmit}
              className="h-10 px-3.5 rounded-xl text-xs font-bold shrink-0"
            >
              جستجو
            </Button>
          </div>

          {/* Quick Preset Search Chips */}
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 border-b border-border/50 bg-muted/20 scrollbar-none">
            {POPULAR_TAGS.map((tag) => {
              const Icon = tag.icon;
              return (
                <button
                  key={tag.query}
                  type="button"
                  onClick={() => handleSelectQuery(tag.query)}
                  className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground whitespace-nowrap active:scale-95 transition-all"
                >
                  <Icon className="h-3 w-3 text-primary" />
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Content Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {searchQuery.trim() !== "" ? (
              <div>
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                  <span>نتایج جستجو ({searchResults.length} کتونی)</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <p className="text-sm font-bold text-foreground">
                      کتونی با نام «{searchQuery}» پیدا نشد.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      عبارت دیگری مانند «جردن ۱»، «شیکاگو» یا «ترویس» را جستجو نمایید.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-2.5 active:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                              {product.brand} • {product.categoryName}
                            </span>
                            <h4 className="text-xs font-black text-foreground truncate">
                              {product.name}
                            </h4>
                            <span className="text-xs font-mono font-bold text-foreground">
                              {format(product.price)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="gap-1 text-xs shrink-0 rounded-xl h-8 px-2.5 font-bold"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          خرید
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground mb-2.5">
                      <span className="flex items-center gap-1.5">
                        <History className="h-4 w-4 text-primary" /> جستجوهای اخیر شما
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        پاک کردن همه
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectQuery(term)}
                          className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-foreground active:scale-95 transition-all"
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Jordan Sneakers */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                    <TrendingUp className="h-4 w-4 text-amber-500" /> پرطرفدارترین کتونی‌های جردن کلاب
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRODUCTS.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-2.5 active:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                          <Image
                            src={p.images[0].url}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-foreground truncate block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono font-bold">
                            {format(p.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Desktop Standard Modal Dialog */}
      <div className="hidden md:block">
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
                            onClick={() => handleSelectQuery(term)}
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
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="flex items-center gap-2 rounded-xl border border-border/60 p-2 hover:bg-muted transition-colors cursor-pointer"
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
                        </div>
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
      </div>
    </>
  );
}
