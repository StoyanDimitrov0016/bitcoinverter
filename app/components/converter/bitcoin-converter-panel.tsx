import { Suspense } from "react";

import { calculateAccumulation } from "@/lib/bitcoin-calculator.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";

import { useBitcoinPrices } from "../../hooks/use-bitcoin-prices";
import { BitcoinConverter } from "./bitcoin-converter";
import { CalculatorDataProvider } from "../shared/calculator-data-context";

type BitcoinConverterPanelProps = {
  input: AccumulationInput | null;
};

type ResolvedBitcoinConverterProps = BitcoinConverterPanelProps;
type BitcoinConverterFallbackProps = BitcoinConverterPanelProps;

export function BitcoinConverterPanel({ input }: BitcoinConverterPanelProps) {
  return (
    <Suspense fallback={<BitcoinConverterFallback input={input} />}>
      <ResolvedBitcoinConverter input={input} />
    </Suspense>
  );
}

function ResolvedBitcoinConverter({ input }: ResolvedBitcoinConverterProps) {
  const { isPriceLoading, prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <BitcoinConverter />
    </CalculatorDataProvider>
  );
}

function BitcoinConverterFallback({ input }: BitcoinConverterFallbackProps) {
  return (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      <BitcoinConverter />
    </CalculatorDataProvider>
  );
}
