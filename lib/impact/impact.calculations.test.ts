import { describe, expect, it } from "vitest";

import type { AccumulationResults } from "../calculator/calculator.types";
import type { BitcoinPrices } from "../prices/price.schemas";
import { getImpactHorizonData, getPriceImpactData } from "./impact.calculations";

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
  relativeImpact: { status: "available", percent: 6 },
};

describe("impact chart data", () => {
  it("shares calculated horizon rows with chart data", () => {
    const data = getImpactHorizonData(RESULTS, "btc");

    expect(data.status).toBe("available");
    if (data.status !== "available") {
      return;
    }
    expect(data.rows[0]).toEqual({ target: 10, months: 20 });
    expect(data.chartData[0]).toEqual({ x: 0, y: 0.4 });
    expect(data.chartData.at(-1)).toEqual({ x: 200, y: 0.8 });
  });

  it("explains why horizon data is unavailable", () => {
    expect(
      getImpactHorizonData(
        {
          ...RESULTS,
          monthlyBtc: 0,
          addedBtc: 0,
          relativeImpact: { status: "available", percent: 0 },
        },
        "btc"
      )
    ).toEqual({ status: "unavailable", reason: "zero-contribution" });
  });

  it("keeps a flat price chart when contributions are zero", () => {
    const data = getPriceImpactData(
      { holding: 0.4, holdingUnit: "BTC", contribution: 0, contributionUnit: "EUR" },
      {
        ...RESULTS,
        monthlyBtc: 0,
        addedBtc: 0,
        relativeImpact: { status: "available", percent: 0 },
      },
      PRICES
    );

    expect(data.status).toBe("available");
    if (data.status !== "available") {
      return;
    }
    expect(data.rows.every((row) => row.price === 0)).toBe(true);
    expect(data.chartData).toEqual([
      { x: 0, y: 0 },
      { x: 100_000, y: 0 },
    ]);
  });

  it("does not fabricate fiat data for BTC contributions", () => {
    expect(
      getPriceImpactData(
        { holding: 0.4, holdingUnit: "BTC", contribution: 0.01, contributionUnit: "BTC" },
        RESULTS,
        PRICES
      )
    ).toEqual({ status: "unavailable", reason: "btc-contribution" });
  });
});
