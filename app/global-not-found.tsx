import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { SITE_CONFIG } from "@/lib/site-config";
import "./globals.css";

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
  title: `Page not found | ${SITE_CONFIG.name}`,
  description: "The page you're looking for doesn't exist or has moved.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-3 bg-background p-6 text-center font-sans text-foreground">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link className="text-accent underline underline-offset-2" href="/">
          Back to BitCoinverter
        </Link>
      </body>
    </html>
  );
}
