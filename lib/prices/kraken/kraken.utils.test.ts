import { describe, expect, it } from "vitest";

import { KrakenResponseEnvelopeSchema, KrakenTickerResultSchema } from "./kraken.schemas";
import {
  containsRetryableKrakenError,
  isRetryableKrakenStatus,
  toBitcoinPrices,
} from "./kraken.utils";

const KRAKEN_RESPONSE = {
  error: [],
  result: {
    XXBTZEUR: { c: ["50000.25", "1"] },
    XXBTZUSD: { c: ["60000.50", "1"] },
  },
};

describe("Kraken response handling", () => {
  it("coerces ticker price strings before mapping them to Bitcoin prices", () => {
    const responseEnvelope = KrakenResponseEnvelopeSchema.parse(KRAKEN_RESPONSE);
    const tickerResult = KrakenTickerResultSchema.parse(responseEnvelope.result);
    const prices = toBitcoinPrices(tickerResult);

    expect(prices).toMatchObject({
      EUR: 50_000.25,
      USD: 60_000.5,
      provider: "Kraken",
    });
  });

  it("rejects ticker values that cannot become positive numbers", () => {
    expect(() =>
      KrakenTickerResultSchema.parse({
        ...KRAKEN_RESPONSE,
        XXBTZEUR: { c: ["not-a-price", "1"] },
      })
    ).toThrow();
  });

  it("parses Kraken errors without requiring a successful ticker result", () => {
    expect(
      KrakenResponseEnvelopeSchema.parse({
        error: ["EAPI:Rate limit exceeded"],
        result: {},
      })
    ).toEqual({
      error: ["EAPI:Rate limit exceeded"],
      result: {},
    });
  });

  it("identifies transient HTTP and Kraken API errors", () => {
    expect(isRetryableKrakenStatus(429)).toBe(true);
    expect(isRetryableKrakenStatus(503)).toBe(true);
    expect(isRetryableKrakenStatus(400)).toBe(false);
    expect(containsRetryableKrakenError(["EAPI:Rate limit exceeded"])).toBe(true);
    expect(containsRetryableKrakenError(["EQuery:Unknown asset pair"])).toBe(false);
  });
});
