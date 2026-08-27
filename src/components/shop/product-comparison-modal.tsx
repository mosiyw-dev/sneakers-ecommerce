"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useCompareStore } from "@/stores/compare-store";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/stores/toast-store";
import { motion, AnimatePresence } from "framer-motion";

export function ProductComparisonModal() {
  const isMounted = useIsMounted();
  const { items, isOpen, closeModal, removeItem, clearCompare, openModal } = useCompareStore();
  const { addItem } = useCartStore();
  const { format } = useCurrencyStore();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product, 1);
    toast.success("به سبد اضافه شد", `${product.name} به سبد خرید افزوده شد.`);
  };

  return (
    <>
      {/* Floating Bottom Compare Trigger Bar */}
      <AnimatePresence>
        {isMounted && items.length > 0 && !isOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl max-w-lg w-full mx-4 text-right"
          >
            <div className="flex items-center gap-2 overflow-x-auto">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted border border-border"
                >
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white text-[9px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-foreground block">
                مقایسه مدل‌های جردن ({items.length}/۳)
              </span>
              <span className="text-[10px] text-muted-foreground">
                بررسی تخصصی متریال و قیمت
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="xs"
                onClick={clearCompare}
                className="text-xs text-muted-foreground"
              >
                پاک کردن
              </Button>
              <Button
                size="sm"
                onClick={openModal}
                className="gap-1.5 rounded-xl text-xs font-bold shadow-md"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> مقایسه الان
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Comparison Matrix Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()} maxWidth="5xl">
        <DialogHeader onClose={closeModal}>
          <div className="flex items-center justify-between pl-8">
            <DialogTitle>جدول مقایسه تخصصی کتونی‌های ایر جردن</DialogTitle>
            <Button
              variant="outline"
              size="xs"
              onClick={clearCompare}
              className="text-xs gap-1"
            >
              <Trash2 className="h-3 w-3" /> حذف همه
            </Button>
          </div>
        </DialogHeader>

        <DialogContent className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto text-right">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">کتونی برای مقایسه انتخاب نشده است.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 w-36 font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">
                      مشخصات
                    </th>
                    {items.map((product) => (
                      <th key={product.id} className="p-3 min-w-56 align-top">
                        <div className="space-y-2">
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted border border-border">
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                            <button
                              onClick={() => removeItem(product.id)}
                              className="absolute top-2 left-2 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">
                              {product.brand}
                            </span>
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeModal}
                              className="font-bold text-foreground text-sm hover:text-primary block line-clamp-1"
                            >
                              {product.name}
                            </Link>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-foreground font-mono">
                              {format(product.price)}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-xs text-muted-foreground line-through font-mono">
                                {format(product.compareAtPrice)}
                              </span>
                            )}
                          </div>

                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            className="w-full gap-1.5 rounded-xl text-xs font-bold shadow-xs"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" /> خرید این مدل
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {/* Category */}
                  <tr>
                    <td className="p-3 font-semibold text-muted-foreground bg-muted/30">
                      سری و سیلوئت
                    </td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-foreground font-medium">
                        {p.categoryName} ({p.series})
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-3 font-semibold text-muted-foreground bg-muted/30">
                      امتیاز رضایت خریداران
                    </td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-foreground">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{p.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground font-normal">
                            ({p.reviewCount} نظر)
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability */}
                  <tr>
                    <td className="p-3 font-semibold text-muted-foreground bg-muted/30">
                      وضعیت انبار
                    </td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.stock > 0 ? (
                          <Badge variant="success" size="sm">
                            موجود ({p.stock} جفت)
                          </Badge>
                        ) : (
                          <Badge variant="destructive" size="sm">
                            ناموجود
                          </Badge>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Core Features */}
                  <tr>
                    <td className="p-3 font-semibold text-muted-foreground bg-muted/30">
                      ویژگی‌های کلیدی
                    </td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 space-y-1 text-muted-foreground">
                        {p.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>

                  {/* Guarantee */}
                  <tr>
                    <td className="p-3 font-semibold text-muted-foreground bg-muted/30">
                      ضمانت و گواهی
                    </td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-foreground">
                        {p.warranty || "ضمانت مادام‌العمر اصالت فیزیکی و فاکتور"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
