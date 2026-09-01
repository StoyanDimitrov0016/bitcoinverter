import { describe, expect, it } from "vitest";

import {
  adjustDecimalAmount,
  calculateAccumulation,
  calculateImpactHorizon,
  calculatePriceImpactLevel,
  convertToBitcoin,
  parseDecimalAmount,
  SATS_PER_BTC,
  type AccumulationResults,
} from "./bitcoin-calculator.utils";
import type { BitcoinPrices } from "./schemas/price.schemas";

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
    expect(
      calculateAccumulation(
        {
          holding: 10_000,
          holdingUnit: "EUR",
          contribution: 500,
          contributionUnit: "USD",
        },
        PRICES
      )
    ).toEqual({
      currentBtc: 0.2,
      monthlyBtc: 0.005,
      addedBtc: 0.06,
      impact: 30,
    });
  });

  it("leaves relative impact undefined when current holdings are zero", () => {
    expect(
      calculateAccumulation(
        {
          holding: 0,
          holdingUnit: "BTC",
          contribution: 0.01,
          contributionUnit: "BTC",
        },
        PRICES
      )
    ).toEqual({
      currentBtc: 0,
      monthlyBtc: 0.01,
      addedBtc: 0.12,
      impact: null,
    });
  });
});

describe("conversion and impact helpers", () => {
  it("converts BTC, satoshis, and fiat to Bitcoin", () => {
    expect(convertToBitcoin({ value: 1, unit: "BTC" }, PRICES)).toBe(1);
    expect(convertToBitcoin({ value: SATS_PER_BTC, unit: "SATS" }, PRICES)).toBe(1);
    expect(convertToBitcoin({ value: 50_000, unit: "EUR" }, PRICES)).toBe(1);
  });

  it("calculates time and price thresholds", () => {
    const results: AccumulationResults = {
      currentBtc: 1,
      monthlyBtc: 0.01,
      addedBtc: 0.12,
      impact: 12,
    };

    expect(calculateImpactHorizon(results, 50)).toBe(50);
    expect(calculatePriceImpactLevel(1_000, 1, 50)).toBe(24_000);
  });

  it("leaves relative thresholds undefined when current holdings are zero", () => {
    const results: AccumulationResults = {
      currentBtc: 0,
      monthlyBtc: 0.01,
      addedBtc: 0.12,
      impact: null,
    };

    expect(calculateImpactHorizon(results, 50)).toBeNull();
    expect(calculatePriceImpactLevel(1_000, 0, 50)).toBeNull();
  });
});
