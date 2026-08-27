"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface SharedLayoutBgProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "div" | "ul";
  pillClassName?: string;
  inset?: number;
  pillContainerClassName?: string;
}

const variants: Variants = {
  initial: { opacity: 0, filter: "blur(6px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: (isActive: boolean) =>
    !isActive ? { opacity: 0, filter: "blur(6px)" } : {},
};

const reducedVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: (isActive: boolean) => (!isActive ? { opacity: 0 } : {}),
};

export const SharedLayoutBg = forwardRef<HTMLElement, SharedLayoutBgProps>(
  function SharedLayoutBg(
    {
      children,
      as = "div",
      className,
      onMouseLeave,
      pillClassName,
      pillContainerClassName,
      inset = 4,
      ...props
    },
    forwardedRef,
  ) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const uid = useId();
    const reduce = useReducedMotion();

    const renderedChildren = Children.toArray(children)
      .filter(isValidElement)
      .map((child, index) => {
        const el = child as ReactElement<{
          className?: string;
          onMouseEnter?: () => void;
          children?: ReactNode;
        }>;
        const childKey = el.key ? String(el.key) : `item-${index}`;
        return cloneElement(
          el,
          {
            key: childKey,
            className: cn("relative", el.props.className),
            onMouseEnter: () => {
              el.props.onMouseEnter?.();
              setActiveId(childKey);
            },
          },
          <>
            <AnimatePresence custom={activeId !== null}>
              {activeId !== null ? (
                <motion.div
                  variants={reduce ? reducedVariants : variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={activeId !== null}
                  className={cn(
                    "pointer-events-none absolute inset-y-0",
                    pillContainerClassName,
                  )}
                  style={{ left: -inset, right: -inset }}
                >
                  {activeId === childKey ? (
                    <motion.div
                      layoutId={`shared-bg-${uid}`}
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      className={cn(
                        "pointer-events-none h-full w-full rounded-xl bg-primary/[0.08] dark:bg-primary/[0.15]",
                        pillClassName,
                      )}
                    />
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div className="relative z-10">{el.props.children}</div>
          </>,
        );
      });

    const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
      setActiveId(null);
      onMouseLeave?.(event);
    };

    if (as === "ul") {
      return (
        <ul
          ref={forwardedRef as never}
          onMouseLeave={handleMouseLeave}
          className={cn("flex w-full flex-col", className)}
          {...props}
        >
          {renderedChildren}
        </ul>
      );
    }

    return (
      <div
        ref={forwardedRef as never}
        onMouseLeave={handleMouseLeave}
        className={cn("flex w-full flex-col", className)}
        {...props}
      >
        {renderedChildren}
      </div>
    );
  },
);
