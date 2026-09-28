"use client";

import { useSyncExternalStore } from "react";

/** Media query reativa, segura para SSR (no servidor retorna `serverValue`). */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
