"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl bg-muted/70 p-1 text-muted-foreground border border-border/50",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "bg-muted-foreground/15 text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 -z-10 rounded-lg bg-background shadow-xs border border-border/40"
                transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
