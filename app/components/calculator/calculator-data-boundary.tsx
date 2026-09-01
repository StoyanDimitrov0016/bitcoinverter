"use client";

import { Suspense, type ReactNode } from "react";

import { calculateAccumulation } from "@/lib/bitcoin-calculator.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";

import { useBitcoinPrices } from "../../providers/bitcoin-prices-provider";
import { CalculatorDataProvider } from "./calculator-data-context";

type CalculatorDataBoundaryProps = {
  children: ReactNode;
  input?: AccumulationInput | null;
};

type ResolvedCalculatorDataProps = Required<CalculatorDataBoundaryProps>;

export function CalculatorDataBoundary({ children, input = null }: CalculatorDataBoundaryProps) {
  const fallback = (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      {children}
    </CalculatorDataProvider>
  );

  return (
    <Suspense fallback={fallback}>
      <ResolvedCalculatorData input={input}>{children}</ResolvedCalculatorData>
    </Suspense>
  );
}

function ResolvedCalculatorData({ children, input }: ResolvedCalculatorDataProps) {
  const { prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider input={input} isPriceLoading={false} prices={prices} results={results}>
      {children}
    </CalculatorDataProvider>
  );
}
