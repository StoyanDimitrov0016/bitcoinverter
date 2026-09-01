import { Suspense } from "react";

import { calculateAccumulation } from "@/lib/bitcoin-calculator.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";

import { useBitcoinPrices } from "../../hooks/use-bitcoin-prices";
import { CalculatorDataProvider } from "../shared/calculator-data-context";
import { ImpactHorizon } from "./impact-horizon";
import { PriceImpactLevels } from "./price-impact-levels";

type ImpactAnalysisPanelProps = {
  input: AccumulationInput | null;
};

type ResolvedImpactAnalysisProps = ImpactAnalysisPanelProps;
type ImpactAnalysisFallbackProps = ImpactAnalysisPanelProps;

export function ImpactAnalysisPanel({ input }: ImpactAnalysisPanelProps) {
  return (
    <Suspense fallback={<ImpactAnalysisFallback input={input} />}>
      <ResolvedImpactAnalysis input={input} />
    </Suspense>
  );
}

function ResolvedImpactAnalysis({ input }: ResolvedImpactAnalysisProps) {
  const { isPriceLoading, prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ImpactHorizon />
        <PriceImpactLevels />
      </div>
    </CalculatorDataProvider>
  );
}

function ImpactAnalysisFallback({ input }: ImpactAnalysisFallbackProps) {
  return (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ImpactHorizon />
        <PriceImpactLevels />
      </div>
    </CalculatorDataProvider>
  );
}
