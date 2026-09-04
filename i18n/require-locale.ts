import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "./routing";

export function requireLocale(locale: string) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}
