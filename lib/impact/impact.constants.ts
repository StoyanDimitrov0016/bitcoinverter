export const IMPACT_TARGETS = [10, 25, 50, 75, 100] as const;

export const IMPACT_BANDS = [
  { label: "Negligible Impact", shortLabel: "Negligible", minimum: 0 },
  { label: "Low Impact", shortLabel: "Low", minimum: 10 },
  { label: "Moderate Impact", shortLabel: "Moderate", minimum: 25 },
  { label: "Meaningful Impact", shortLabel: "Meaningful", minimum: 50 },
  { label: "High Impact", shortLabel: "High", minimum: 75 },
  { label: "Extreme Impact", shortLabel: "Extreme", minimum: 100 },
] as const;

export type ImpactTarget = (typeof IMPACT_TARGETS)[number];
export type ImpactBand = (typeof IMPACT_BANDS)[number];
export type GrowthMetric = "btc" | "percent";
