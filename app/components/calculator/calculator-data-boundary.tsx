"use client";

import { Suspense, type ReactNode } from "react";

import { calculateAccumulation } from "@/lib/calculator/calculator.calculations";
import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";

import { useBitcoinPrices } from "../../providers/bitcoin-prices-provider";
import { CalculatorDataProvider } from "./calculator-data-context";

type CalculatorDataBoundaryProps = {
  children: ReactNode;
  input?: AccumulationInput | null;
};

type ResolvedCalculatorDataProps = Required<CalculatorDataBoundaryProps>;

export function CalculatorDataBoundary({ children, input = null }: CalculatorDataBoundaryProps) {
  const fallback = (
    <CalculatorDataProvider value={{ status: "loading" }}>{children}</CalculatorDataProvider>
  );

  return (
    <Suspense fallback={fallback}>
      <ResolvedCalculatorData input={input}>{children}</ResolvedCalculatorData>
    </Suspense>
  );
}

function ResolvedCalculatorData({ children, input }: ResolvedCalculatorDataProps) {
  const priceState = useBitcoinPrices();

  if (priceState.status === "error") {
    return (
      <CalculatorDataProvider value={{ status: "price-error" }}>{children}</CalculatorDataProvider>
    );
  }

  const calculation = getCalculationState(input, priceState.prices);

  return (
    <CalculatorDataProvider value={{ status: "ready", prices: priceState.prices, calculation }}>
      {children}
    </CalculatorDataProvider>
  );
}

function getCalculationState(
  input: AccumulationInput | null,
  prices: Parameters<typeof calculateAccumulation>[1]
) {
  if (!input) {
    return { status: "invalid-input" as const };
  }

  return {
    status: "ready" as const,
    input,
    results: calculateAccumulation(input, prices),
  };
}
