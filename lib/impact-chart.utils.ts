import {
  calculateImpactHorizon,
  calculatePriceImpactLevel,
  IMPACT_TARGETS,
  type AccumulationResults,
} from "./bitcoin-calculator.utils";
import type { AccumulationInput } from "./schemas/calculator.schemas";
import type { BitcoinPrices } from "./schemas/price.schemas";

export type GrowthMetric = "btc" | "percent";

export type ImpactHorizonRow = {
  target: (typeof IMPACT_TARGETS)[number];
  months: number | null;
};

export function getImpactHorizonData(results: AccumulationResults | null, metric: GrowthMetric) {
  const rows: ImpactHorizonRow[] = IMPACT_TARGETS.map((target) => ({
    target,
    months: results ? calculateImpactHorizon(results, target) : null,
  }));

  if (!results) {
    return { rows, chartData: [] };
  }

  const startingValue = metric === "btc" ? results.currentBtc : 0;
  const targetPoints = rows.flatMap(({ target, months }) => {
    if (months === null) {
      return [];
    }
    return [
      {
        x: months,
        y: metric === "btc" ? results.currentBtc + (results.currentBtc * target) / 100 : target,
      },
    ];
  });

  return {
    rows,
    chartData:
      targetPoints.length > 0
        ? [{ x: 0, y: startingValue }, ...targetPoints]
        : [
            { x: 0, y: startingValue },
            { x: 12, y: startingValue },
          ],
  };
}

export type PriceThresholdRow = {
  target: (typeof IMPACT_TARGETS)[number];
  level: number | null;
};

export function getPriceImpactData(
  input: AccumulationInput | null,
  results: AccumulationResults | null,
  prices: BitcoinPrices | null,
  currency: "EUR" | "USD"
) {
  const rows: PriceThresholdRow[] = IMPACT_TARGETS.map((target) => ({
    target,
    level:
      input && results && input.contributionUnit !== "BTC"
        ? calculatePriceImpactLevel(input.contribution, results.currentBtc, target)
        : null,
  }));

  if (!input || !results || input.contributionUnit === "BTC") {
    return { rows, chartData: [], hundredPercentLevel: null };
  }

  if (input.contribution === 0 && results.currentBtc > 0) {
    const referencePrice = prices?.[currency] ?? 1;
    return {
      rows,
      hundredPercentLevel: rows.find((row) => row.target === 100)?.level ?? null,
      chartData: [
        { x: 0, y: 0 },
        { x: referencePrice * 2, y: 0 },
      ],
    };
  }

  const chartData = rows
    .map(({ level, target }) => ({ price: level ?? 0, target }))
    .filter((point) => point.price > 0)
    .toSorted((left, right) => left.price - right.price)
    .map((point) => ({ x: point.price, y: point.target }));

  return {
    rows,
    chartData,
    hundredPercentLevel: rows.find((row) => row.target === 100)?.level ?? null,
  };
}
