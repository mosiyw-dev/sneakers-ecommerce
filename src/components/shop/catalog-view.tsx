"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FilterState, SortOption, ViewMode, CategorySlug } from "@/types";
import { PRODUCTS } from "@/data/products";
import { FilterSidebar } from "./filter-sidebar";
import { FilterSheet } from "./filter-sheet";
import { ActiveFilters } from "./active-filters";
import { SortingBar } from "./sorting-bar";
import { ProductGrid } from "./product-grid";
import { RecentlyViewed } from "./recently-viewed";
import { ChevronRight, ChevronLeft, Sparkles, Trophy, Percent, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  categories: ["all"],
  brands: [],
  priceRange: [0, 25000000],
  colors: [],
  sizes: [],
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: "featured",
  page: 1,
  itemsPerPage: 12,
};

export function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid-4");

  // Initialize filter state from URL search params
  const [filters, setFilters] = React.useState<FilterState>(() => {
    const q = searchParams.get("q") || "";
    const categoryParam = searchParams.get("category");
    const categories: CategorySlug[] = categoryParam
      ? (categoryParam.split(",") as CategorySlug[])
      : ["all"];
    const brandParam = searchParams.get("brand");
    const brands = brandParam ? brandParam.split(",") : [];
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 25000000);
    const colorParam = searchParams.get("color");
    const colors = colorParam ? colorParam.split(",") : [];
    const sizeParam = searchParams.get("size");
    const sizes = sizeParam ? sizeParam.split(",") : [];
    const minRating = Number(searchParams.get("rating") || 0);
    const inStockOnly = searchParams.get("inStock") === "true";
    const onSaleOnly = searchParams.get("sale") === "true";
    const sortBy = (searchParams.get("sort") as SortOption) || "featured";
    const page = Number(searchParams.get("page") || 1);

    return {
      searchQuery: q,
      categories: categories.length > 0 ? categories : ["all"],
      brands,
      priceRange: [minPrice, maxPrice],
      colors,
      sizes,
      minRating,
      inStockOnly,
      onSaleOnly,
      sortBy,
      page,
      itemsPerPage: 12,
    };
  });

  // Sync filter changes with URL
  const updateUrl = React.useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      if (newFilters.searchQuery.trim()) {
        params.set("q", newFilters.searchQuery.trim());
      }
      if (
        newFilters.categories.length > 0 &&
        !newFilters.categories.includes("all")
      ) {
        params.set("category", newFilters.categories.join(","));
      }
      if (newFilters.brands.length > 0) {
        params.set("brand", newFilters.brands.join(","));
      }
      if (newFilters.priceRange[0] > 0) {
        params.set("minPrice", newFilters.priceRange[0].toString());
      }
      if (newFilters.priceRange[1] < 25000000) {
        params.set("maxPrice", newFilters.priceRange[1].toString());
      }
      if (newFilters.colors.length > 0) {
        params.set("color", newFilters.colors.join(","));
      }
      if (newFilters.sizes.length > 0) {
        params.set("size", newFilters.sizes.join(","));
      }
      if (newFilters.minRating > 0) {
        params.set("rating", newFilters.minRating.toString());
      }
      if (newFilters.inStockOnly) {
        params.set("inStock", "true");
      }
      if (newFilters.onSaleOnly) {
        params.set("sale", "true");
      }
      if (newFilters.sortBy !== "featured") {
        params.set("sort", newFilters.sortBy);
      }
      if (newFilters.page > 1) {
        params.set("page", newFilters.page.toString());
      }

      const queryString = params.toString();
      const target = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(target, { scroll: false });
    },
    [pathname, router]
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    router.replace(pathname, { scroll: false });
  };

  // Filter & Sort computation
  const filteredProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchNameEn = p.nameEn.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCategory = p.categoryName.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchNameEn && !matchBrand && !matchCategory && !matchTag) return false;
      }

      // Categories
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes("all")
      ) {
        if (!filters.categories.includes(p.category)) return false;
      }

      // Brands
      if (filters.brands.length > 0) {
        if (!filters.brands.includes(p.brand)) return false;
      }

      // Price Range
      if (
        p.price < filters.priceRange[0] ||
        p.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Colors
      if (filters.colors.length > 0) {
        const hasColor = p.colors?.some((c) => filters.colors.includes(c.name));
        if (!hasColor) return false;
      }

      // Sizes
      if (filters.sizes.length > 0) {
        const hasSize = p.sizes?.some((s) => filters.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }

      // In-stock only
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }

      // On-sale only
      if (filters.onSaleOnly && !p.isOnSale) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low-to-high":
          return a.price - b.price;
        case "price-high-to-low":
          return b.price - a.price;
        case "highest-rated":
          return b.rating - a.rating;
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "featured":
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / filters.itemsPerPage);
  const paginatedProducts = React.useMemo(() => {
    const start = (filters.page - 1) * filters.itemsPerPage;
    return filteredProducts.slice(start, start + filters.itemsPerPage);
  }, [filteredProducts, filters.page, filters.itemsPerPage]);

  const activeFilterCount =
    (filters.categories.length > 0 && !filters.categories.includes("all")
      ? filters.categories.length
      : 0) +
    filters.brands.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 25000000 ? 1 : 0) +
    filters.colors.length +
    filters.sizes.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      {/* Header & Quick Filter Preset Chips */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          کاتالوگ کامل
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
          موجودی کتونی‌های اورجینال جردن
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
          کلکسیون کمیاب‌ترین مدل‌های ایر جردن ۱، جردن ۴، رترو و ترویس اسکات با فاکتور و تست اصالت فیزیکی.
        </p>

        {/* 1-Tap Quick Filter Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 scrollbar-none">
          <button
            onClick={() => handleResetFilters()}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              activeFilterCount === 0
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            همه مدل‌ها
          </button>

          <button
            onClick={() =>
              handleFilterChange({
                ...filters,
                priceRange: [0, 10000000],
                page: 1,
              })
            }
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              filters.priceRange[0] === 0 && filters.priceRange[1] === 10000000
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            زیر ۱۰ میلیون تومان
          </button>

          <button
            onClick={() =>
              handleFilterChange({
                ...filters,
                sortBy: "newest",
                page: 1,
              })
            }
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              filters.sortBy === "newest"
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Sparkles className="h-3 w-3 text-amber-500" /> جدیدترین ورودی‌ها
          </button>

          <button
            onClick={() =>
              handleFilterChange({
                ...filters,
                sortBy: "featured",
                page: 1,
              })
            }
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              filters.sortBy === "featured" && activeFilterCount > 0
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Trophy className="h-3 w-3 text-amber-500" /> پرفروش‌ترین‌ها
          </button>

          <button
            onClick={() =>
              handleFilterChange({
                ...filters,
                minRating: 4.8,
                page: 1,
              })
            }
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              filters.minRating === 4.8
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> بالاترین رضایت (+۴.۸)
          </button>

          <button
            onClick={() =>
              handleFilterChange({
                ...filters,
                onSaleOnly: !filters.onSaleOnly,
                page: 1,
              })
            }
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
              filters.onSaleOnly
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Percent className="h-3 w-3 text-emerald-500" /> تخفیف‌دارها
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Faceted Filter Sidebar */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Product Stream */}
        <div className="md:col-span-3 space-y-6">
          <SortingBar
            totalCount={filteredProducts.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={filters.sortBy}
            onSortChange={(sort) => handleFilterChange({ ...filters, sortBy: sort, page: 1 })}
            onOpenMobileFilter={() => setMobileFilterOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          <ActiveFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          <ProductGrid
            products={paginatedProducts}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />

          {/* Numbered Pagination (RTL Direction) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10 border-t border-border/60">
              <button
                onClick={() => {
                  handleFilterChange({ ...filters, page: Math.max(1, filters.page - 1) });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={filters.page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-muted transition-colors"
                aria-label="صفحه قبلی"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === filters.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      handleFilterChange({ ...filters, page: pageNum });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all font-mono",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  handleFilterChange({ ...filters, page: Math.min(totalPages, filters.page + 1) });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={filters.page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-muted transition-colors"
                aria-label="صفحه بعدی"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      {/* Mobile Filter Drawer */}
      <FilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        resultsCount={filteredProducts.length}
      />
    </div>
  );
}
