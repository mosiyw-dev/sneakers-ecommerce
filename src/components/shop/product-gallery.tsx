"use client";

import * as React from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Expand, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  discountBadge?: string;
  isNew?: boolean;
}

export function ProductGallery({
  images,
  productName,
  discountBadge,
  isNew,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  // Touch Swipe Handling for Mobile
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const activeImage = images[activeIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    // In RTL: swiping right-to-left moves to next, left-to-right moves to prev
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4">
      {/* Desktop Thumbnail Column (hidden on mobile, visible on lg+) */}
      {images.length > 1 && (
        <div className="hidden lg:flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all bg-muted cursor-pointer",
                activeIndex === idx
                  ? "border-primary shadow-xs ring-2 ring-primary/20 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative flex-1">
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/30 cursor-zoom-in select-none"
        >
          {/* Base Image */}
          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
            className={cn(
              "object-cover transition-opacity duration-300",
              isHovering ? "opacity-0 md:opacity-0" : "opacity-100"
            )}
          />

          {/* Smooth Zoom Layer on Desktop Hover */}
          {isHovering && (
            <div
              className="absolute inset-0 hidden md:block bg-no-repeat transition-transform duration-75 pointer-events-none"
              style={{
                backgroundImage: `url(${activeImage.url})`,
                backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                backgroundSize: "220%",
              }}
            />
          )}

          {/* Badges */}
          <div className="absolute right-3.5 top-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {isNew && <Badge variant="success">جدید</Badge>}
            {discountBadge && <Badge variant="destructive">{discountBadge}</Badge>}
          </div>

          {/* Lightbox Expand Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute left-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-foreground shadow-xs hover:bg-background active:scale-95 transition-all z-10 touch-target"
            aria-label="بزرگنمایی تصویر کتونی"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Mobile Image Index Counter Pill */}
          {images.length > 1 && (
            <div className="md:hidden absolute bottom-3.5 right-3.5 rounded-full bg-background/85 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-foreground border border-border shadow-xs z-10">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Mobile Navigation Arrows */}
          {images.length > 1 && (
            <div className="flex md:hidden absolute inset-x-2.5 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-foreground shadow-md active:scale-90 touch-target"
                aria-label="عکس قبلی"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-foreground shadow-md active:scale-90 touch-target"
                aria-label="عکس بعدی"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Horizontal Thumbnail / Dot Slider */}
        {images.length > 1 && (
          <div className="flex lg:hidden items-center justify-center gap-2 mt-3 overflow-x-auto py-1 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-muted touch-target",
                  activeIndex === idx
                    ? "border-primary shadow-xs ring-2 ring-primary/20 scale-105"
                    : "border-transparent opacity-60"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen} maxWidth="5xl">
        <DialogContent className="p-2 sm:p-4 bg-background/95 backdrop-blur-xl text-right">
          <div className="relative aspect-square sm:aspect-4/3 w-full overflow-hidden rounded-2xl">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-3 overflow-x-auto py-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all touch-target",
                    activeIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60"
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
