import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const title = "BitCoinverter | Bitcoin Accumulation Calculator";
const description =
  "A private, open-source calculator for understanding the impact of steady Bitcoin accumulation.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary", title, description },
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
