"use client";

import { Label, ListBox, Select } from "@heroui/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_OPTIONS = {
  en: { code: "EN", flagSrc: "/flag-united-kingdom.svg" },
  bg: { code: "BG", flagSrc: "/flag-bulgaria.svg" },
} as const satisfies Record<(typeof routing.locales)[number], { code: string; flagSrc: string }>;

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      aria-label={t("label")}
      className="w-20"
      value={locale}
      onChange={(value) => {
        const nextLocale = routing.locales.find((candidate) => candidate === value);
        if (nextLocale) {
          const hash = window.location.hash;
          router.replace(`${pathname}${hash}`, { locale: nextLocale, scroll: false });
        }
      }}
    >
      <Label className="sr-only">{t("label")}</Label>
      <Select.Trigger className="h-8 min-h-8 px-2 text-sm">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {routing.locales.map((cur) => {
            const label = t("locale", { locale: cur });
            const option = LOCALE_OPTIONS[cur];
            return (
              <ListBox.Item
                key={cur}
                className={
                  cur === locale ? "bg-accent-soft text-accent-soft-foreground" : undefined
                }
                id={cur}
                textValue={label}
              >
                <span className="inline-flex items-center gap-2">
                  <Image alt="" aria-hidden="true" height={18} src={option.flagSrc} width={18} />
                  <span>{option.code}</span>
                </span>
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
