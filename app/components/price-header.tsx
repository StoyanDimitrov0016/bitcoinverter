"use client";

import { Suspense } from "react";

import { useBitcoinPrices, usePriceRetry } from "../providers/bitcoin-prices-provider";

import { SiteHeader } from "./site-header";

export function PriceHeader() {
  const retry = usePriceRetry();

  return (
    <Suspense fallback={<SiteHeader prices={null} priceState="loading" onRetry={retry} />}>
      <ResolvedPriceHeader />
    </Suspense>
  );
}

function ResolvedPriceHeader() {
  const { prices, priceState, retry } = useBitcoinPrices();
  return <SiteHeader prices={prices} priceState={priceState} onRetry={retry} />;
}
