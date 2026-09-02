import { describe, expect, it } from "vitest";

import type { BitcoinPrices } from "../prices/price.schemas";
import {
  adjustDecimalAmount,
  calculateAccumulation,
  convertToBitcoin,
  parseDecimalAmount,
} from "./calculator.calculations";
import { SATS_PER_BTC } from "./calculator.constants";

const PRICES: BitcoinPrices = {
  EUR: 50_000,
  USD: 100_000,
  fetchedAt: "2026-09-01T00:00:00.000Z",
  provider: "Kraken",
};

describe("decimal amounts", () => {
  it("accepts decimal commas and rejects invalid amounts", () => {
    expect(parseDecimalAmount("1,25")).toBe(1.25);
    expect(parseDecimalAmount("-1")).toBeNull();
    expect(parseDecimalAmount("not a number")).toBeNull();
  });

  it("preserves whole-number steps and trims fractional trailing zeroes", () => {
    expect(adjustDecimalAmount("99", 1, 1)).toBe("100");
    expect(adjustDecimalAmount("0.001", 0.001, 1)).toBe("0.002");
    expect(adjustDecimalAmount("0", 0.001, -1)).toBe("0");
  });
});

describe("accumulation calculations", () => {
  it("converts fiat holdings and contributions to BTC", () => {
    const results = calculateAccumulation(
      {
        holding: 10_000,
        holdingUnit: "EUR",
        contribution: 500,
        contributionUnit: "USD",
      },
      PRICES
    );

    expect(results).toEqual({
      currentBtc: 0.2,
      monthlyBtc: 0.005,
      addedBtc: 0.06,
      relativeImpact: { status: "available", percent: 30 },
    });
  });

  it("explains why relative impact is unavailable", () => {
    const results = calculateAccumulation(
      {
        holding: 0,
        holdingUnit: "BTC",
        contribution: 0.01,
        contributionUnit: "BTC",
      },
      PRICES
    );

    expect(results.relativeImpact).toEqual({
      status: "unavailable",
      reason: "zero-current-holdings",
    });
  });
});

describe("conversion helpers", () => {
  it("converts BTC, satoshis, and fiat to Bitcoin", () => {
    expect(convertToBitcoin({ value: 1, unit: "BTC" }, PRICES)).toBe(1);
    expect(convertToBitcoin({ value: SATS_PER_BTC, unit: "SATS" }, PRICES)).toBe(1);
    expect(convertToBitcoin({ value: 50_000, unit: "EUR" }, PRICES)).toBe(1);
  });
});
