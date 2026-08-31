"use client";

import { useEffect, useState } from "react";

import { BitcoinPricesSchema, type BitcoinPrices } from "@/lib/schemas/price.schemas";

export type PriceState = "loading" | "ready" | "error";

async function requestBitcoinPrices(): Promise<BitcoinPrices> {
  const response = await fetch("/api/prices", { cache: "no-store" });
  const responseData: unknown = await response.json();
  if (!response.ok) {
    throw new Error("The price service returned an error response");
  }
  return BitcoinPricesSchema.parse(responseData);
}

export function useBitcoinPrices() {
  const [prices, setPrices] = useState<BitcoinPrices | null>(null);
  const [priceState, setPriceState] = useState<PriceState>("loading");

  const loadPrices = async () => {
    try {
      const nextPrices = await requestBitcoinPrices();
      setPrices(nextPrices);
      setPriceState("ready");
    } catch {
      setPrices(null);
      setPriceState("error");
    }
  };

  const retry = async () => {
    setPriceState("loading");
    await loadPrices();
  };

  useEffect(() => {
    let isCurrent = true;
    void requestBitcoinPrices().then(
      (nextPrices) => {
        if (isCurrent) {
          setPrices(nextPrices);
          setPriceState("ready");
        }
        return undefined;
      },
      () => {
        if (isCurrent) {
          setPrices(null);
          setPriceState("error");
        }
        return undefined;
      }
    );
    return () => {
      isCurrent = false;
    };
  }, []);

  return { prices, priceState, retry };
}
