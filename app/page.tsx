import Calculator from "./calculator";

import { priceProvider } from "@/lib/price-provider";

import type { BitcoinPricesResult } from "@/lib/schemas/price.schemas";

export default function Home() {
  const pricesPromise: Promise<BitcoinPricesResult> = priceProvider
    .getBitcoinPrices()
    .then((prices) => ({ prices }))
    .catch(() => ({ prices: null }));

  return <Calculator pricesPromise={pricesPromise} />;
}
