"use client";

import { useSyncExternalStore } from "react";
import { clearTokenCache } from "../tokens/token-reader";

export type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";
const listeners = new Set<() => void>();
let explicitTheme: Theme | undefined;
let systemPreference: MediaQueryList | undefined;

function isTheme(value: string | undefined): value is Theme {
  return value === "dark" || value === "light";
}

function getStoredTheme(): Theme | null {
  if (explicitTheme) return explicitTheme;
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? undefined;
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function notify(): void {
  clearTokenCache();
  for (const listener of listeners) listener();
}

function syncSystemTheme(event: MediaQueryListEvent): void {
  if (getStoredTheme() !== null || typeof document === "undefined") return;
  document.documentElement.dataset.theme = event.matches ? "light" : "dark";
  notify();
}

function startSystemSubscription(): void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return;
  }

  systemPreference = window.matchMedia("(prefers-color-scheme: light)");
  systemPreference.addEventListener("change", syncSystemTheme);
}

function stopSystemSubscription(): void {
  systemPreference?.removeEventListener("change", syncSystemTheme);
  systemPreference = undefined;
}

export function getTheme(): Theme {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (isTheme(current)) return current;
  }
  return getStoredTheme() ?? getSystemTheme();
}

/** Stable snapshot for server rendering and useSyncExternalStore hydration. */
export function getServerTheme(): Theme {
  return "dark";
}

export function setTheme(theme: Theme): void {
  explicitTheme = theme;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
    explicitTheme = undefined;
  } catch {
    // The in-memory choice still applies for this session when storage is blocked.
    explicitTheme = theme;
  }
  notify();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) startSystemSubscription();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stopSystemSubscription();
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}
