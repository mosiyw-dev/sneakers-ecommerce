"use client";

import { create } from "zustand";
import { ToastItem, ToastType } from "@/types";

interface ToastState {
  toasts: ToastItem[];
  addToast: (options: {
    type?: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: ({ type = "info", title, message, duration = 4000, action }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration,
      action,
    };

    set((state) => ({
      toasts: [...state.toasts.slice(-4), newToast], // Keep max 5 visible toasts
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),
}));

// Quick helper functions to trigger toasts anywhere
export const toast = {
  success: (title: string, message?: string, action?: ToastItem["action"]) =>
    useToastStore.getState().addToast({ type: "success", title, message, action }),
  error: (title: string, message?: string, action?: ToastItem["action"]) =>
    useToastStore.getState().addToast({ type: "error", title, message, action }),
  info: (title: string, message?: string, action?: ToastItem["action"]) =>
    useToastStore.getState().addToast({ type: "info", title, message, action }),
  warning: (title: string, message?: string, action?: ToastItem["action"]) =>
    useToastStore.getState().addToast({ type: "warning", title, message, action }),
};
