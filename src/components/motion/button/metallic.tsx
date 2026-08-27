"use client";

import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, useState, type ReactNode } from "react";
import { EASE_IN_OUT, SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface MetallicButtonProps {
  size?: "sm" | "md" | "lg" | "xl";
  paused?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const SILVER_DRIFT = {
  duration: 7,
  ease: EASE_IN_OUT,
  repeat: Infinity,
};

const CHROME_SHIMMER = {
  duration: 2.2,
  ease: EASE_IN_OUT,
};

const SIZE_CLASSES = {
  sm: "h-9 px-4 text-xs gap-1.5 rounded-xl",
  md: "h-11 px-5 text-xs sm:text-sm gap-2 rounded-2xl",
  lg: "h-13 px-7 text-sm sm:text-base gap-2.5 rounded-2xl",
  xl: "h-14 px-8 text-sm sm:text-base gap-3 rounded-2xl",
};

export const MetallicButton = forwardRef<
  HTMLButtonElement,
  MetallicButtonProps
>(function MetallicButton(
  {
    size = "md",
    paused = false,
    className,
    children,
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const reduce = useReducedMotion();
  const still = paused || Boolean(reduce);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={reduce || disabled ? undefined : { scale: 0.96 }}
      whileHover={reduce || disabled ? undefined : { scale: 1.02 }}
      transition={SPRING_PRESS}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative isolate overflow-hidden border-0 bg-transparent text-foreground cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "shadow-[0_8px_24px_rgba(0,0,0,0.18)] font-black inline-flex items-center justify-center",
        SIZE_CLASSES[size],
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[-20%] z-0 w-[140%] rounded-[inherit] bg-[linear-gradient(105deg,#262626_0%,#a3a3a3_16%,#ffffff_28%,#525252_40%,#171717_52%,#d4d4d4_66%,#ffffff_78%,#404040_88%,#262626_100%)]"
        animate={still ? undefined : { x: ["0%", "14%", "0%"] }}
        transition={still ? undefined : SILVER_DRIFT}
      />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[-60%] z-[1] w-[55%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6)_50%,transparent)] opacity-60 blur-[2px] mix-blend-screen"
        animate={still ? undefined : { x: hovered ? "320%" : "0%" }}
        transition={still ? undefined : CHROME_SHIMMER}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] z-[2] rounded-[inherit] bg-background/95 transition-colors group-hover:bg-background/80"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] z-[3] rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.25)]"
      />

      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});
