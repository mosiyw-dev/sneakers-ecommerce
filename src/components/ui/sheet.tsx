"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
  width?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
  className,
  width = "max-w-md",
}: SheetProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const slideVariants = {
    closed: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0.5,
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0.5,
      transition: {
        ease: "easeInOut" as const,
        duration: 0.25,
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={slideVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className={cn(
              "relative z-10 flex h-full w-full flex-col border-border bg-card text-card-foreground shadow-2xl overflow-hidden",
              side === "right" ? "ml-auto border-l" : "mr-auto border-r",
              width,
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function SheetHeader({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border px-6 py-4.5 bg-card/80 backdrop-blur-md sticky top-0 z-20",
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close Drawer</span>
        </button>
      )}
    </div>
  );
}

export function SheetContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-6 space-y-4", className)}>
      {children}
    </div>
  );
}

export function SheetTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("text-base font-bold text-foreground", className)}>
      {children}
    </h3>
  );
}

export function SheetFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-t border-border p-6 bg-card/90 backdrop-blur-md mt-auto sticky bottom-0 z-20",
        className
      )}
    >
      {children}
    </div>
  );
}
