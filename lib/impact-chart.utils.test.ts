import { describe, expect, it } from "vitest";

import { getImpactHorizonData, getPriceImpactData } from "./impact-chart.utils";
import type { AccumulationResults } from "./bitcoin-calculator.utils";
import type { BitcoinPrices } from "./schemas/price.schemas";

const PRICES: BitcoinPrices = {
  EUR: 50_000,
  USD: 100_000,
  fetchedAt: "2026-09-01T00:00:00.000Z",
  provider: "Kraken",
};

const RESULTS: AccumulationResults = {
  currentBtc: 0.4,
  monthlyBtc: 0.002,
  addedBtc: 0.024,
  impact: 6,
};

describe("impact chart data", () => {
  it("shares calculated horizon rows with the chart data", () => {
    const data = getImpactHorizonData(RESULTS, "btc");

    expect(data.rows[0]).toEqual({ target: 10, months: 20 });
    expect(data.chartData[0]).toEqual({ x: 0, y: 0.4 });
    expect(data.chartData.at(-1)).toEqual({ x: 200, y: 0.8 });
  });

  it("keeps a flat horizon chart when contributions are zero", () => {
    const data = getImpactHorizonData({ ...RESULTS, monthlyBtc: 0, addedBtc: 0, impact: 0 }, "btc");

    expect(data.rows.every((row) => row.months === null)).toBe(true);
    expect(data.chartData).toEqual([
      { x: 0, y: 0.4 },
      { x: 12, y: 0.4 },
    ]);
  });

  it("keeps a flat price chart when contributions are zero", () => {
    const data = getPriceImpactData(
      { holding: 0.4, holdingUnit: "BTC", contribution: 0, contributionUnit: "EUR" },
      { ...RESULTS, monthlyBtc: 0, addedBtc: 0, impact: 0 },
      PRICES,
      "EUR"
    );

    expect(data.rows.every((row) => row.level === 0)).toBe(true);
    expect(data.chartData).toEqual([
      { x: 0, y: 0 },
      { x: 100_000, y: 0 },
    ]);
  });
});
