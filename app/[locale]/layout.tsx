import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/require-locale";
import { routing } from "@/i18n/routing";
import { InlineScript } from "@/app/components/inline-script";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  LEGACY_THEME_STORAGE_KEY,
  STATIC_THEME_COLORS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme.constants";
import "../globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const OPEN_GRAPH_LOCALES = { en: "en_US", bg: "bg_BG" } as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const languages: Record<string, string> = {};
  for (const cur of routing.locales) {
    languages[cur] = getPathname({ locale: cur, href: "/" });
  }

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    applicationName: SITE_CONFIG.name,
    title: t("title"),
    description: t("description"),
    alternates: { canonical: getPathname({ locale, href: "/" }), languages },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: SITE_CONFIG.name,
      type: "website",
      url: getPathname({ locale, href: "/" }),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/opengraph-image", alt: `Preview of ${SITE_CONFIG.name}` }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: STATIC_THEME_COLORS.lightBackground },
    { media: "(prefers-color-scheme: dark)", color: STATIC_THEME_COLORS.darkBackground },
  ],
};

const themeInitScript = `try {
  var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  var legacyStorageKey = ${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};
  var stored = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey) || "system";
  if (stored !== "light" && stored !== "dark" && stored !== "system") stored = "system";
  localStorage.setItem(storageKey, stored);
  localStorage.removeItem(legacyStorageKey);
  var resolved = stored;
  if (stored === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.classList.add(resolved);
  document.documentElement.setAttribute("data-theme", resolved);
} catch {}`;

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang={locale}
    >
      <head>
        <InlineScript>{themeInitScript}</InlineScript>
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
