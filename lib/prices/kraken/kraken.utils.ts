import { BitcoinPricesSchema, type BitcoinPrices } from "../price.schemas";
import {
  RETRYABLE_KRAKEN_ERROR_FRAGMENTS,
  RETRYABLE_KRAKEN_HTTP_STATUSES,
} from "./kraken.constants";
import type { KrakenTickerResult } from "./kraken.schemas";

export function isRetryableKrakenStatus(status: number) {
  return RETRYABLE_KRAKEN_HTTP_STATUSES.has(status) || status >= 500;
}

export function containsRetryableKrakenError(errors: string[]) {
  return errors.some((error) =>
    RETRYABLE_KRAKEN_ERROR_FRAGMENTS.some((fragment) => error.includes(fragment))
  );
}

export function toBitcoinPrices(tickerResult: KrakenTickerResult): BitcoinPrices {
  return BitcoinPricesSchema.parse({
    EUR: tickerResult.XXBTZEUR.c[0],
    USD: tickerResult.XXBTZUSD.c[0],
    fetchedAt: new Date().toISOString(),
    provider: "Kraken",
  });
}
