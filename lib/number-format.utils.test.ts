import { describe, expect, it } from "vitest";

import {
  formatBitcoin,
  formatFiat,
  formatImpactHorizon,
  formatInteger,
  formatNumber,
  formatPercent,
  formatRateFiat,
} from "./number-format.utils";

describe("number formatting", () => {
  it("formats general numbers with configurable precision", () => {
    expect(formatNumber(12_345.6789, 2)).toBe("12,345.68");
    expect(formatInteger(12_345.6)).toBe("12,346");
  });

  it("formats percentages with a consistent suffix", () => {
    expect(formatPercent(0.123_456_789)).toBe("0.12345679%");
    expect(formatPercent(12.345, 1)).toBe("12.3%");
  });

  it("formats fiat values and small exchange rates", () => {
    expect(formatFiat(1_234.5, "USD")).toBe("$1,234.50");
    expect(formatRateFiat(0.000_012_345, "EUR")).toBe("€0.000012");
  });

  it("formats Bitcoin with eight decimal places", () => {
    expect(formatBitcoin(0.1)).toBe("0.10000000");
  });
});

describe("formatImpactHorizon", () => {
  it.each([
    [8, "8mo"],
    [12, "1y"],
    [13, "1y 1mo"],
    [24, "2y"],
    [27, "2y 3mo"],
  ])("formats %i months as %s", (months, expected) => {
    expect(formatImpactHorizon(months)).toBe(expected);
  });
});
