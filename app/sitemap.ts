import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_CONFIG } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = SITE_CONFIG.url + getPathname({ locale, href: "/" });
  }

  return [
    {
      url: SITE_CONFIG.url,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
  ];
}
