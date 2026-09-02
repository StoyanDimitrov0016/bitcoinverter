import "server-only";

import { fetchKrakenBitcoinPrices } from "./kraken/kraken.client";
import { PriceProviderError, PriceServiceError } from "./price.errors";
import type { BitcoinPrices } from "./price.schemas";

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 250;

type PriceFetcher = () => Promise<BitcoinPrices>;
type Wait = (delayMs: number) => Promise<void>;

type PriceServiceOptions = {
  fetchPrices?: PriceFetcher;
  retryDelayMs?: number;
  wait?: Wait;
};

async function wait(delayMs: number) {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export class PriceService {
  private readonly fetchPrices: PriceFetcher;
  private readonly retryDelayMs: number;
  private readonly wait: Wait;

  constructor(options: PriceServiceOptions = {}) {
    this.fetchPrices = options.fetchPrices ?? fetchKrakenBitcoinPrices;
    this.retryDelayMs = options.retryDelayMs ?? RETRY_DELAY_MS;
    this.wait = options.wait ?? wait;
  }

  async getBitcoinPrices(): Promise<BitcoinPrices> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        return await this.fetchPrices();
      } catch (error) {
        lastError = error;
        const shouldRetry =
          error instanceof PriceProviderError && error.retryable && attempt < MAX_ATTEMPTS;

        if (!shouldRetry) {
          break;
        }

        await this.wait(this.retryDelayMs);
      }
    }

    throw new PriceServiceError("Unable to retrieve a valid Bitcoin price", {
      cause: lastError,
    });
  }
}

export const priceService = new PriceService();
