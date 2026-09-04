import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

const MESSAGE_LOADERS = {
  en: async () => import("../messages/en.json"),
  bg: async () => import("../messages/bg.json"),
} satisfies Record<(typeof routing.locales)[number], () => Promise<{ default: unknown }>>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = await MESSAGE_LOADERS[locale]();

  return {
    locale,
    messages: messages.default,
  };
});
