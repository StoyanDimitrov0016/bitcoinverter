"use client";

import { Switch, useTheme } from "@heroui/react";
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
    <Switch
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      isSelected={isDark}
      size="sm"
      onChange={(selected) => setTheme(selected ? "dark" : "light")}
    >
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb>
            <Switch.Icon>
              {isDark ? (
                <FiMoon aria-hidden="true" size={10} />
              ) : (
                <FiSun aria-hidden="true" size={10} />
              )}
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}
