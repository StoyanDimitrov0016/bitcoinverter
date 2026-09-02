import { CalculatorContent } from "./components/calculator/calculator-content";
import { Methodology } from "./components/methodology/methodology";
import { PriceHeader } from "./components/price-header";
import { SiteFooter } from "./components/site-footer";
import { SectionHeading } from "./components/section-heading";
import { BitcoinPricesProvider } from "./providers/bitcoin-prices-provider";

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

export default function Home() {
  const pricesPromise = getBitcoinPricesResult();

  return (
    <BitcoinPricesProvider pricesPromise={pricesPromise}>
      <>
        <a
          className="fixed start-2 top-2 z-[60] -translate-y-16 rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <PriceHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="layout-container space-y-8 py-6 outline-none sm:py-8"
        >
          <div className="sr-only">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Bitcoin accumulation calculator
            </h1>
            <p className="text-muted">
              See how steady contributions compound, priced against Kraken's live BTC rate.
            </p>
          </div>
          <CalculatorContent />
          <section
            aria-labelledby="methodology-section-title"
            className="scroll-mt-32 space-y-3"
            id="methodology"
          >
            <SectionHeading id="methodology-section-title" title="Methodology" />
            <Methodology />
          </section>
        </main>
        <SiteFooter />
      </>
    </BitcoinPricesProvider>
  );
}
