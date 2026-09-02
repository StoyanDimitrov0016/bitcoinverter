"use client";

import { Button, useTheme } from "@heroui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useSyncExternalStore } from "react";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const isDark = isHydrated && resolvedTheme === "dark";

  return (
    <Button
      isIconOnly
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      size="sm"
      variant="ghost"
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <FiSun aria-hidden="true" className="size-4" />
      ) : (
        <FiMoon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
