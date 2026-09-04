export const IMPACT_TARGETS = [10, 25, 50, 100] as const;

export const IMPACT_BANDS = [
  { id: "negligible", minimum: 0 },
  { id: "low", minimum: 10 },
  { id: "moderate", minimum: 25 },
  { id: "meaningful", minimum: 50 },
  { id: "high", minimum: 75 },
  { id: "extreme", minimum: 100 },
] as const;

export type ImpactTarget = (typeof IMPACT_TARGETS)[number];
export type ImpactBand = (typeof IMPACT_BANDS)[number];
export type GrowthMetric = "btc" | "percent";
