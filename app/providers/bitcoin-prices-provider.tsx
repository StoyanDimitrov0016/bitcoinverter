"use client";

import { createContext, use, useState, type ReactNode } from "react";

import { fetchBitcoinPrices } from "@/lib/prices/price.client";
import type { BitcoinPricesResult } from "@/lib/prices/price.schemas";

async function createClientPricesPromise(): Promise<BitcoinPricesResult> {
  try {
    const prices = await fetchBitcoinPrices();
    return { status: "ready", prices };
  } catch {
    return { status: "error" };
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

export function useBitcoinPrices() {
  const ctx = use(BitcoinPricesContext);
  if (!ctx) {
    throw new Error("useBitcoinPrices must be used within a BitcoinPricesProvider");
  }

  return { ...use(ctx.pricesPromise), retry: ctx.retry };
}
