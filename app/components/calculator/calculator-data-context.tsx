"use client";

import { createContext, use, type ReactNode } from "react";

import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";
import type { AccumulationResults } from "@/lib/calculator/calculator.types";
import type { BitcoinPrices } from "@/lib/prices/price.schemas";

export type CalculatorData =
  | { status: "loading" }
  | { status: "price-error" }
  | {
      status: "ready";
      prices: BitcoinPrices;
      calculation:
        | { status: "invalid-input" }
        | { status: "ready"; input: AccumulationInput; results: AccumulationResults };
    };

type CalculatorDataProviderProps = {
  children: ReactNode;
  value: CalculatorData;
};

const CalculatorDataContext = createContext<CalculatorData | null>(null);

export function CalculatorDataProvider({ children, value }: CalculatorDataProviderProps) {
  return <CalculatorDataContext value={value}>{children}</CalculatorDataContext>;
}

export function useCalculatorData() {
  const value = use(CalculatorDataContext);
  if (!value) {
    throw new Error("useCalculatorData must be used within CalculatorDataProvider");
  }
  return value;
}
