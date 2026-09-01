import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/lib/site-config";
import "./globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
};

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
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
    { media: "(prefers-color-scheme: light)", color: "#f5f0e6" },
    { media: "(prefers-color-scheme: dark)", color: "#17130f" },
  ],
};

const themeInitScript = `try {
  var stored = localStorage.getItem("heroui-theme") || "system";
  var resolved = stored === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : stored;
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
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <script>{themeInitScript}</script>
        {children}
      </body>
    </html>
  );
}
