"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { TOUCH_GESTURE_CLASS, TOUCH_GESTURE_CONTENT_CLASS } from "@/lib/touch";
import { cn } from "@/lib/utils";

export interface SlideActionButtonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children: ReactNode;
  completeLabel?: ReactNode;
  threshold?: number;
  resetDelay?: number;
  onComplete?: () => void;
  thumbClassName?: string;
  fillClassName?: string;
}

export function SlideActionButton({
  children,
  completeLabel = "ثبت شد",
  threshold = 0.82,
  resetDelay = 1200,
  onComplete,
  thumbClassName,
  fillClassName,
  className,
  ...rest
}: SlideActionButtonProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);
  const x = useMotionValue(0);
  const [maxDistance, setMaxDistance] = useState(0);
  const [completed, setCompleted] = useState(false);
  const safeDistance = Math.max(maxDistance, 1);
  const dragProgress = useTransform(x, [0, safeDistance], [0, 1]);
  const fillProgress = useTransform(x, [0, safeDistance], [0, 1]);
  const labelOpacity = useTransform(
    x,
    [0, safeDistance * 0.35, safeDistance * 0.65],
    [1, 0.75, 0],
  );
  const iconPath = useTransform(
    dragProgress,
    [0, 0.5, 1],
    [
      "M 16 5 L 9 12 L 16 19",
      "M 17 8 L 12 14 L 7 10",
      "M 19 12 L 14 17 L 5 7",
    ],
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const measure = () => {
      setMaxDistance(Math.max(track.clientWidth - thumb.clientWidth - 8, 0));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(thumb);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const moveTo = (target: number) => {
    if (reduce) {
      x.set(target);
      return;
    }
    animate(x, target, SPRING_LAYOUT);
  };

  const reset = () => {
    completedRef.current = false;
    setCompleted(false);
    moveTo(0);
  };

  const complete = () => {
    if (completedRef.current || maxDistance === 0) return;
    completedRef.current = true;
    setCompleted(true);
    moveTo(maxDistance);
    onComplete?.();

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(reset, resetDelay);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    complete();
  };

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-14 w-72 overflow-hidden rounded-2xl bg-primary/10 p-1 border border-primary/20",
        TOUCH_GESTURE_CONTENT_CLASS,
        className,
      )}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        style={{ scaleX: fillProgress }}
        className={cn(
          "absolute inset-0 origin-right bg-primary will-change-transform",
          fillClassName,
        )}
      />

      <motion.span
        aria-hidden="true"
        style={{ opacity: labelOpacity }}
        className="pointer-events-none absolute inset-0 grid place-items-center pr-10 text-xs sm:text-sm font-bold text-foreground"
      >
        {children}
      </motion.span>

      <motion.span
        aria-live="polite"
        animate={{ opacity: completed ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-0 grid place-items-center text-xs sm:text-sm font-bold text-primary-foreground"
      >
        {completed ? completeLabel : null}
      </motion.span>

      <motion.button
        ref={thumbRef}
        type="button"
        aria-label={typeof children === "string" ? children : "Slide action"}
        drag={completed ? false : "x"}
        dragConstraints={{ left: -maxDistance, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => {
          if (Math.abs(x.get()) >= maxDistance * threshold) complete();
          else moveTo(0);
        }}
        onKeyDown={handleKeyDown}
        whileTap={reduce || completed ? undefined : { scale: 0.94 }}
        transition={SPRING_PRESS}
        className={cn(
          "relative z-10 grid size-12 touch-none cursor-grab place-items-center rounded-xl bg-primary text-primary-foreground shadow-md",
          TOUCH_GESTURE_CLASS,
          "outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          completed && "cursor-default bg-background text-foreground",
          thumbClassName,
        )}
      >
        <motion.svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
          <motion.path
            d={iconPath}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </motion.svg>
      </motion.button>
    </div>
  );
}
