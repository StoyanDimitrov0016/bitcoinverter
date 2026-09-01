"use client";

import { CalculatorContent } from "./components/calculator/calculator-content";
import { BitcoinPricesProvider } from "./hooks/use-bitcoin-prices";

import type { BitcoinPricesResult } from "@/lib/schemas/price.schemas";

type CalculatorProps = {
  pricesPromise: Promise<BitcoinPricesResult>;
};

export default function Calculator({ pricesPromise }: CalculatorProps) {
  return (
    <BitcoinPricesProvider pricesPromise={pricesPromise}>
      <CalculatorContent />
    </BitcoinPricesProvider>
  );
}
