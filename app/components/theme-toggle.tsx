"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FiMoon, FiSun } from "react-icons/fi";
import { useSyncExternalStore } from "react";

import { useAppTheme } from "@/lib/theme/use-app-theme";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { resolvedTheme, setTheme } = useAppTheme();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const isDark = isHydrated && resolvedTheme === "dark";

  return (
    <Button
      isIconOnly
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
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
