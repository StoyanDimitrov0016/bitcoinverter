"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AccumulationResults } from "@/lib/bitcoin-calculator.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

type CalculatorData = {
  input: AccumulationInput | null;
  isPriceLoading: boolean;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

type CalculatorDataProviderProps = CalculatorData & {
  children: ReactNode;
};

const CalculatorDataContext = createContext<CalculatorData | null>(null);

export function CalculatorDataProvider({
  children,
  input,
  isPriceLoading,
  prices,
  results,
}: CalculatorDataProviderProps) {
  const value = { input, isPriceLoading, prices, results };

  return <CalculatorDataContext value={value}>{children}</CalculatorDataContext>;
}

export function useCalculatorData() {
  const value = useContext(CalculatorDataContext);
  if (!value) {
    throw new Error("useCalculatorData must be used within CalculatorDataProvider");
  }
  return value;
}
