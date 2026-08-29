"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockItemData {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: number;
  isActive?: boolean;
}

interface DockProps {
  items: DockItemData[];
  className?: string;
  iconSize?: number;
  magnification?: number;
  distance?: number;
  direction?: "top" | "middle" | "bottom";
}

interface DockIconProps {
  item: DockItemData;
  mouseX: MotionValue<number>;
  iconSize: number;
  magnification: number;
  distance: number;
}

function DockIcon({
  item,
  mouseX,
  iconSize,
  magnification,
  distance,
}: DockIconProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [iconSize, magnification, iconSize]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  });

  const Icon = item.icon;

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.88 }}
      className={cn(
        "relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl transition-colors duration-200 select-none",
        item.isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-2 ring-primary/20"
          : "bg-background/80 text-foreground/80 hover:bg-foreground/10 hover:text-foreground hover:shadow-md border border-white/20 dark:border-white/10"
      )}
    >
      <Icon className="h-5 w-5 shrink-0 transition-transform duration-200" />

      {/* Notification / Count Badge */}
      {item.badge !== undefined && item.badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white font-mono shadow-md ring-2 ring-background">
          {item.badge}
        </span>
      )}

      {/* Active Indicator Dot */}
      {item.isActive && (
        <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-primary" />
      )}

      {/* Floating Tooltip Label on Desktop Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: -38, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute -top-2 z-50 whitespace-nowrap rounded-xl bg-foreground/95 px-2.5 py-1 text-[11px] font-bold text-background shadow-xl backdrop-blur-md"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className="focus:outline-none flex items-center justify-center"
        aria-label={item.label}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href || "/"}
      className="focus:outline-none flex items-center justify-center"
      aria-label={item.label}
    >
      {content}
    </Link>
  );
}

export function Dock({
  items,
  className,
  iconSize = 44,
  magnification = 58,
  distance = 140,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-16 items-center gap-3 rounded-3xl p-2 select-none",
        "bg-background/70 dark:bg-card/70 backdrop-blur-2xl",
        "border border-border/80 dark:border-white/10 shadow-2xl",
        className
      )}
    >
      {items.map((item) => (
        <DockIcon
          key={item.id}
          item={item}
          mouseX={mouseX}
          iconSize={iconSize}
          magnification={magnification}
          distance={distance}
        />
      ))}
    </motion.div>
  );
}
