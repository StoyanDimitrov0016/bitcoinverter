import { Value } from "typebox/value";
import {
  BitcoinPricesSchema,
  KrakenTickerResponseSchema,
  PositivePriceSchema,
  type BitcoinPrices,
} from "./schemas/price.schemas";

export interface PriceProvider {
  getBitcoinPrices(): Promise<BitcoinPrices>;
}

export class PriceProviderError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PriceProviderError";
  }
}

export class KrakenPriceProvider implements PriceProvider {
  async getBitcoinPrices(): Promise<BitcoinPrices> {
    try {
      const response = await fetch("https://api.kraken.com/0/public/Ticker?pair=XBTEUR,XBTUSD", {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8_000),
      });

      if (!response.ok) {
        throw new PriceProviderError(`Kraken responded with HTTP ${response.status}`);
      }

      const payload = Value.Parse(KrakenTickerResponseSchema, await response.json());
      if (payload.error.length > 0) {
        throw new PriceProviderError(payload.error.join(", "));
      }

      return Value.Parse(BitcoinPricesSchema, {
        EUR: Value.Parse(PositivePriceSchema, Number(payload.result.XXBTZEUR.c[0])),
        USD: Value.Parse(PositivePriceSchema, Number(payload.result.XXBTZUSD.c[0])),
        fetchedAt: new Date().toISOString(),
        provider: "Kraken",
      });
    } catch (error) {
      if (error instanceof PriceProviderError) {
        throw error;
      }
      throw new PriceProviderError("Unable to retrieve a valid Kraken Bitcoin price", {
        cause: error,
      });
    }
  }
}

export const priceProvider: PriceProvider = new KrakenPriceProvider();
