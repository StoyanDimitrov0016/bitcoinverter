"use client";

import { Suspense } from "react";

import { useBitcoinPrices } from "../providers/bitcoin-prices-provider";

import { SiteHeader } from "./site-header";

export function PriceHeader() {
  return (
    <Suspense fallback={<SiteHeader price={{ status: "loading" }} />}>
      <ResolvedPriceHeader />
    </Suspense>
  );
}

function ResolvedPriceHeader() {
  const priceState = useBitcoinPrices();

  if (priceState.status === "error") {
    return <SiteHeader price={{ status: "error", retry: priceState.retry }} />;
  }

  return <SiteHeader price={{ status: "ready", prices: priceState.prices }} />;
}
