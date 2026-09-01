import { Suspense } from "react";

import { calculateAccumulation } from "@/lib/bitcoin-calculator.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";

import { CalculatorDataProvider } from "./calculator-data-context";
import { ImpactSummary } from "./impact-summary";
import { useBitcoinPrices } from "../../hooks/use-bitcoin-prices";

type PriceSummaryPanelProps = {
  input: AccumulationInput | null;
};

type ResolvedPriceSummaryProps = PriceSummaryPanelProps;
type PriceSummaryFallbackProps = PriceSummaryPanelProps;

export function PriceSummaryPanel({ input }: PriceSummaryPanelProps) {
  return (
    <Suspense fallback={<PriceSummaryFallback input={input} />}>
      <ResolvedPriceSummary input={input} />
    </Suspense>
  );
}

function ResolvedPriceSummary({ input }: ResolvedPriceSummaryProps) {
  const { isPriceLoading, prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <ImpactSummary />
    </CalculatorDataProvider>
  );
}

function PriceSummaryFallback({ input }: PriceSummaryFallbackProps) {
  return (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      <ImpactSummary />
    </CalculatorDataProvider>
  );
}
