"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function AccordionItem({
  title,
  children,
  isOpenDefault = false,
  className,
  icon,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(isOpenDefault);

  return (
    <div className={cn("border-b border-border/70 py-1", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground transition-all hover:text-primary focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="tracking-tight font-medium text-base sm:text-sm">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("divide-y divide-border/60", className)}>{children}</div>;
}
