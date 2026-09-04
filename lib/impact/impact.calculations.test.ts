import { describe, expect, it } from "vitest";

import { EFFECTIVE_BITCOIN_SUPPLY, WORLD_POPULATION } from "../bitcoin.constants";
import type { AccumulationResults } from "../calculator/calculator.types";
import { getGlobalScarcityPercent, getImpactHorizonData } from "./impact.calculations";
import { IMPACT_TARGETS } from "./impact.constants";

const RESULTS: AccumulationResults = {
  currentBtc: 0.4,
  monthlyBtc: 0.002,
  addedBtc: 0.024,
  relativeImpact: { status: "available", percent: 6 },
};

describe("global scarcity ceiling", () => {
  it("estimates the maximum share of people who could own as much BTC", () => {
    expect(getGlobalScarcityPercent(0.4)).toBeCloseTo(
      (EFFECTIVE_BITCOIN_SUPPLY / 0.4 / WORLD_POPULATION) * 100
    );
  });

  it("caps small holdings at the full population and rejects zero holdings", () => {
    expect(getGlobalScarcityPercent(0.000_001)).toBe(100);
    expect(getGlobalScarcityPercent(0)).toBeNull();
  });
});

describe("impact chart data", () => {
  it("describes each growth target and ends at the 100% target", () => {
    const data = getImpactHorizonData(RESULTS, "percent");

    expect(data.status).toBe("available");
    if (data.status !== "available") {
      return;
    }
    expect(data.rows.map(({ target }) => target)).toEqual(IMPACT_TARGETS);
    expect(data.rows.every(({ months }) => months > 0)).toBe(true);
    expect(data.chartData[0]).toMatchObject({ x: 0, y: 0 });
    expect(data.chartData.at(-1)).toMatchObject({ x: data.hundredPercentMonths, y: 100 });
  });

  it("returns a clear unavailable state when the inputs cannot produce a timeline", () => {
    expect(getImpactHorizonData({ ...RESULTS, currentBtc: 0 }, "percent")).toEqual({
      status: "unavailable",
      reason: "zero-current-holdings",
    });

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

  it("ends the chart at 100% when that growth is reached within a year", () => {
    const data = getImpactHorizonData(
      {
        ...RESULTS,
        monthlyBtc: 0.06,
        addedBtc: 0.72,
        relativeImpact: { status: "available", percent: 180 },
      },
      "percent"
    );

    expect(data.status).toBe("available");
    if (data.status !== "available") {
      return;
    }
    expect(data.hundredPercentMonths).toBe(7);
    expect(data.chartData.at(-1)).toEqual({ x: 7, y: 100 });
  });
});
