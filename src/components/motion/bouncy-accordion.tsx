"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type BouncyAccordionItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type BouncyAccordionClassNames = {
  root?: string;
  item?: string;
  trigger?: string;
  icon?: string;
  title?: string;
  chevron?: string;
  content?: string;
  description?: string;
};

export interface BouncyAccordionProps {
  items: BouncyAccordionItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
  className?: string;
  classNames?: BouncyAccordionClassNames;
}

const ROW_TRANSITION: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.35,
};

const CONTENT_OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.58,
  bounce: 0.3,
};

const CONTENT_CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.46,
  bounce: 0.25,
};

const DESCRIPTION_TRANSITION: Transition = {
  duration: 0.18,
  ease: EASE_OUT,
};

const CHEVRON_TRANSITION: Transition = {
  type: "spring",
  duration: 0.42,
  bounce: 0.28,
};

function BouncyAccordionRow({
  item,
  open,
  startsGroup,
  endsGroup,
  separatedFromPrevious,
  contentId,
  triggerId,
  reduce,
  classNames,
  onToggle,
}: {
  item: BouncyAccordionItem;
  open: boolean;
  startsGroup: boolean;
  endsGroup: boolean;
  separatedFromPrevious: boolean;
  contentId: string;
  triggerId: string;
  reduce: boolean | null;
  classNames?: BouncyAccordionClassNames;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      setContentHeight(node.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      layout="position"
      initial={false}
      style={{ marginTop: separatedFromPrevious ? 10 : 0 }}
      transition={reduce ? { duration: 0 } : ROW_TRANSITION}
    >
      <motion.div
        data-state={open ? "open" : "closed"}
        initial={false}
        animate={{
          borderTopLeftRadius: startsGroup ? 20 : 0,
          borderTopRightRadius: startsGroup ? 20 : 0,
          borderBottomLeftRadius: endsGroup ? 20 : 0,
          borderBottomRightRadius: endsGroup ? 20 : 0,
        }}
        transition={reduce ? { duration: 0 } : ROW_TRANSITION}
        className={cn(
          "overflow-hidden border border-border/60 bg-card text-card-foreground shadow-xs transition-colors",
          open && "border-primary/40 bg-card/90",
          item.disabled && "opacity-50",
          classNames?.item,
        )}
      >
        <button
          id={triggerId}
          type="button"
          disabled={item.disabled}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={onToggle}
          className={cn(
            "flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3.5 text-right outline-none transition-colors cursor-pointer",
            "focus-visible:bg-muted/30 hover:bg-muted/20",
            "disabled:pointer-events-none",
            classNames?.trigger,
          )}
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {item.icon ? (
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
                  classNames?.icon,
                )}
              >
                {item.icon}
              </span>
            ) : null}
            <span
              className={cn(
                "min-w-0 flex-1 text-sm sm:text-base font-black text-foreground",
                classNames?.title,
              )}
            >
              {item.title}
            </span>
          </div>

          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : CHEVRON_TRANSITION}
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted/60 text-muted-foreground",
              classNames?.chevron,
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <motion.div
          layout="size"
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          aria-hidden={!open}
          inert={!open || undefined}
          initial={false}
          style={{ height: open && item.description ? contentHeight : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : open
                ? CONTENT_OPEN_TRANSITION
                : CONTENT_CLOSE_TRANSITION
          }
          className={cn("overflow-hidden", classNames?.content)}
        >
          <motion.div
            ref={contentRef}
            animate={{
              opacity: open ? 1 : 0,
            }}
            transition={reduce ? { duration: 0 } : DESCRIPTION_TRANSITION}
            className="px-5 pb-5 pt-1 text-right border-t border-border/40"
          >
            <div
              className={cn(
                "text-xs sm:text-sm leading-relaxed text-muted-foreground",
                classNames?.description,
              )}
            >
              {item.description}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function BouncyAccordion({
  items,
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className,
  classNames,
}: BouncyAccordionProps) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const activeValue = value !== undefined ? value : internalValue;

  const toggleItem = useCallback(
    (id: string) => {
      const next = activeValue === id ? (collapsible ? null : id) : id;
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [activeValue, collapsible, value, onValueChange],
  );

  const activeIndex = items.findIndex((item) => item.id === activeValue);

  return (
    <div className={cn("w-full space-y-2.5", className, classNames?.root)}>
      {items.map((item, index) => {
        const open = activeValue === item.id;
        const previousIsOpen = activeIndex === index - 1;
        const nextIsOpen = activeIndex === index + 1;
        const startsGroup = open || index === 0 || previousIsOpen;
        const endsGroup = open || index === items.length - 1 || nextIsOpen;
        const separatedFromPrevious = index > 0 && (open || previousIsOpen);
        const contentId = `${baseId}-${item.id}-content`;
        const triggerId = `${baseId}-${item.id}-trigger`;

        return (
          <BouncyAccordionRow
            key={item.id}
            item={item}
            open={open}
            startsGroup={startsGroup}
            endsGroup={endsGroup}
            separatedFromPrevious={separatedFromPrevious}
            contentId={contentId}
            triggerId={triggerId}
            reduce={reduce}
            classNames={classNames}
            onToggle={() => toggleItem(item.id)}
          />
        );
      })}
    </div>
  );
}
