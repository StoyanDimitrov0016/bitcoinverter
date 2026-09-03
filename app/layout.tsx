import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  LEGACY_THEME_STORAGE_KEY,
  STATIC_THEME_COLORS,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme.constants";
import "./globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  applicationName: SITE_CONFIG.name,
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    locale: "en_US",
    siteName: SITE_CONFIG.name,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [{ url: "/opengraph-image", alt: `Preview of ${SITE_CONFIG.name}` }],
  },
};

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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="en"
    >
      <head>
        <script>{themeInitScript}</script>
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
