"use client";

import { createContext, use, useContext, useState, type ReactNode } from "react";

import {
  BitcoinPricesSchema,
  type BitcoinPrices,
  type BitcoinPricesResult,
} from "@/lib/schemas/price.schemas";

export type PriceState = "loading" | "ready" | "error";

async function requestBitcoinPrices(): Promise<BitcoinPrices> {
  const response = await fetch("/api/prices", { cache: "no-store" });
  const responseData: unknown = await response.json();
  if (!response.ok) {
    throw new Error("The price service returned an error response");
  }
  return BitcoinPricesSchema.parse(responseData);
}

async function createClientPricesPromise(): Promise<BitcoinPricesResult> {
  try {
    const prices = await requestBitcoinPrices();
    return { prices };
  } catch {
    return { prices: null };
  }
}

type BitcoinPricesContext = {
  pricesPromise: Promise<BitcoinPricesResult>;
  retry: () => void;
};

const BitcoinPricesContext = createContext<BitcoinPricesContext | null>(null);

type BitcoinPricesProviderProps = {
  children: ReactNode;
  pricesPromise: Promise<BitcoinPricesResult>;
};

export function BitcoinPricesProvider({ children, pricesPromise }: BitcoinPricesProviderProps) {
  const [currentPricesPromise, setCurrentPricesPromise] = useState(pricesPromise);
  const retry = () => setCurrentPricesPromise(createClientPricesPromise());

  const contextValue = { pricesPromise: currentPricesPromise, retry };

  return <BitcoinPricesContext value={contextValue}>{children}</BitcoinPricesContext>;
}

export function usePriceRetry() {
  const value = useContext(BitcoinPricesContext);
  if (!value) {
    throw new Error("usePriceRetry must be used within a BitcoinPricesProvider");
  }
  return value.retry;
}

export function useBitcoinPrices() {
  const value = useContext(BitcoinPricesContext);
  if (!value) {
    throw new Error("useBitcoinPrices must be used within a BitcoinPricesProvider");
  }

  const result = use(value.pricesPromise);
  const priceState: Exclude<PriceState, "loading"> = result.prices ? "ready" : "error";

  return {
    prices: result.prices,
    priceState,
    retry: value.retry,
  };
}
