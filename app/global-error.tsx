"use client";

import { Geist, Geist_Mono } from "next/font/google";
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

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-3 bg-background p-6 text-center font-sans text-foreground">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted">An unexpected error occurred. You can try again.</p>
        <button className="text-accent underline underline-offset-2" type="button" onClick={retry}>
          Try again
        </button>
      </body>
    </html>
  );
}
