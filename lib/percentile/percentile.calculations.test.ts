import { describe, expect, it } from "vitest";

import { bitcoinForPercentile, calculateGlobalPercentile } from "./percentile.calculations";
import { EFFECTIVE_BITCOIN_SUPPLY, WORLD_POPULATION } from "./percentile.constants";

describe("scarcity-based percentile calculations", () => {
  it("calculates a conservative global percentile", () => {
    expect(calculateGlobalPercentile(1)).toEqual({
      bitcoin: 1,
      topPercentile: (EFFECTIVE_BITCOIN_SUPPLY / WORLD_POPULATION) * 100,
      maximumPeers: EFFECTIVE_BITCOIN_SUPPLY,
    });
  });

  it("caps a zero holding at the full population", () => {
    expect(calculateGlobalPercentile(0)).toEqual({
      bitcoin: 0,
      topPercentile: 100,
      maximumPeers: WORLD_POPULATION,
    });
  });

  it("calculates bitcoin required for a target global percentile", () => {
    expect(bitcoinForPercentile(1)).toBeCloseTo(0.2369512195);
  });
});
