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

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail column */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 lg:pb-0 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-18 w-18 lg:h-20 lg:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-muted",
                activeIndex === idx
                  ? "border-primary shadow-xs ring-2 ring-primary/20"
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

      {/* Main High-Res Image with Zoom Preview */}
      <div className="relative flex-1">
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/60 bg-muted cursor-zoom-in"
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

          {/* Smooth Zoom Layer on Hover */}
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
          <div className="absolute left-4 top-4 flex flex-col gap-2 z-10 pointer-events-none">
            {isNew && <Badge variant="success">NEW RELEASE</Badge>}
            {discountBadge && <Badge variant="destructive">{discountBadge}</Badge>}
          </div>

          {/* Lightbox Trigger Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-xs hover:bg-background active:scale-95 transition-all z-10"
            aria-label="Expand image fullscreen"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Mobile Nav arrows */}
          {images.length > 1 && (
            <div className="flex md:hidden absolute inset-x-2 top-1/2 -translate-y-1/2 justify-between pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen} maxWidth="5xl">
        <DialogContent className="p-2 sm:p-4 bg-background/95 backdrop-blur-xl">
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
            <div className="flex justify-center gap-2 mt-3 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    activeIndex === idx ? "border-primary" : "border-transparent opacity-60"
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
