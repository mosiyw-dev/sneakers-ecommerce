"use client";

import * as React from "react";

const emptySubscribe = () => () => {};

/**
 * Hydration-safe mounted hook using React's useSyncExternalStore.
 * Guarantees server snapshot during initial hydration to prevent mismatch errors.
 */
export function useIsMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
