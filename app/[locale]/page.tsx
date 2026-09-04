import { getTranslations, setRequestLocale } from "next-intl/server";

import { CalculatorContent } from "@/app/components/calculator/calculator-content";
import { Methodology } from "@/app/components/methodology/methodology";
import { PriceHeader } from "@/app/components/price-header";
import { SiteFooter } from "@/app/components/site-footer";
import { SectionHeading } from "@/app/components/section-heading";
import { BitcoinPricesProvider } from "@/app/providers/bitcoin-prices-provider";

import { requireLocale } from "@/i18n/require-locale";
import type { BitcoinPricesResult } from "@/lib/prices/price.schemas";
import { priceService } from "@/lib/prices/price.service";

async function getBitcoinPricesResult(): Promise<BitcoinPricesResult> {
  try {
    const prices = await priceService.getBitcoinPrices();
    return { status: "ready", prices };
  } catch {
    return { status: "error" };
  }
}

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  const [t, tLayout, tSections] = await Promise.all([
    getTranslations("Home"),
    getTranslations("Layout"),
    getTranslations("Sections"),
  ]);
  const pricesPromise = getBitcoinPricesResult();

  return (
    <BitcoinPricesProvider pricesPromise={pricesPromise}>
      <>
        <a
          className="fixed start-2 top-2 z-[60] -translate-y-16 rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-transform focus:translate-y-0"
          href="#main-content"
        >
          {tLayout("skipToContent")}
        </a>
        <PriceHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="layout-container space-y-8 py-6 outline-none sm:py-8"
        >
          <div className="sr-only">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("heading")}
            </h1>
            <p className="text-muted">{t("subheading")}</p>
          </div>
          <CalculatorContent />
          <section
            aria-labelledby="methodology-section-title"
            className="scroll-mt-32 space-y-3"
            id="methodology"
          >
            <SectionHeading id="methodology-section-title" title={tSections("methodology")} />
            <Methodology />
          </section>
        </main>
        <SiteFooter />
      </>
    </BitcoinPricesProvider>
  );
}
