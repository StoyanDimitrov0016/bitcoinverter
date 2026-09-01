import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
