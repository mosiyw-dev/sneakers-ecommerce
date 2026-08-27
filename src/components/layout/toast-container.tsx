"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "@/stores/toast-store";
import { ToastType } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="h-4 w-4 text-destructive shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-card-foreground",
              item.type === "success" && "border-emerald-500/20",
              item.type === "error" && "border-destructive/20"
            )}
          >
            <div className="mt-0.5">{iconMap[item.type]}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-foreground leading-tight">
                {item.title}
              </h4>
              {item.message && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                  {item.message}
                </p>
              )}
              {item.action && (
                <button
                  onClick={() => {
                    item.action?.onClick();
                    removeToast(item.id);
                  }}
                  className="mt-2 text-xs font-semibold text-primary hover:underline block"
                >
                  {item.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
