"use client";

import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

import { LEGACY_THEME_STORAGE_KEY, THEME_STORAGE_KEY } from "./theme.constants";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = Exclude<Theme, "system">;

const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light" || value === "system";
}

function getStoredTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  return isTheme(legacyTheme) ? legacyTheme : "system";
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

function getServerSystemTheme() {
  return undefined;
}

export function useAppTheme() {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === "undefined" ? "system" : getStoredTheme()
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme
  );
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const appliedThemeRef = useRef<ResolvedTheme | undefined>(undefined);

  useLayoutEffect(() => {
    if (!resolvedTheme || appliedThemeRef.current === resolvedTheme) {
      return;
    }

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    appliedThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    setThemeState(nextTheme);
  }, []);

  return { resolvedTheme, setTheme };
}
