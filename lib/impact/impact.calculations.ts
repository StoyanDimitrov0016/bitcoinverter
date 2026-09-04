import { EFFECTIVE_BITCOIN_SUPPLY, WORLD_POPULATION } from "../bitcoin.constants";
import { MONTHS_PER_YEAR } from "../calculator/calculator.constants";
import type { AccumulationResults } from "../calculator/calculator.types";
import {
  IMPACT_BANDS,
  IMPACT_TARGETS,
  type GrowthMetric,
  type ImpactBand,
  type ImpactTarget,
} from "./impact.constants";

export type ChartPoint = { x: number; y: number };

export function getGlobalScarcityPercent(holdings: number) {
  if (holdings <= 0) {
    return null;
  }

  const maximumPeers = EFFECTIVE_BITCOIN_SUPPLY / holdings;
  return Math.min(100, (maximumPeers / WORLD_POPULATION) * 100);
}

export type ImpactHorizonData =
  | {
      status: "available";
      rows: { target: ImpactTarget; months: number }[];
      chartData: ChartPoint[];
      hundredPercentMonths: number;
    }
  | {
      status: "unavailable";
      reason: "zero-current-holdings" | "zero-contribution";
    };

export function getImpactBand(percent: number): ImpactBand {
  return IMPACT_BANDS.findLast((impactBand) => percent >= impactBand.minimum) ?? IMPACT_BANDS[0];
}

export type ImpactRange =
  | { type: "orMore"; minimum: number }
  | { type: "under"; maximum: number }
  | { type: "between"; minimum: number; maximum: number };

export function getImpactRange(index: number): ImpactRange {
  const impactBand = IMPACT_BANDS[index];
  const nextImpactBand = IMPACT_BANDS[index + 1];

  if (!impactBand) {
    throw new RangeError(`Unknown impact band index: ${index}`);
  }

  if (!nextImpactBand) {
    return { type: "orMore", minimum: impactBand.minimum };
  }

  if (impactBand.minimum === 0) {
    return { type: "under", maximum: nextImpactBand.minimum };
  }

  return { type: "between", minimum: impactBand.minimum, maximum: nextImpactBand.minimum };
}

export function getImpactHorizonData(
  results: AccumulationResults,
  metric: GrowthMetric
): ImpactHorizonData {
  if (results.currentBtc === 0) {
    return { status: "unavailable", reason: "zero-current-holdings" };
  }

  if (results.monthlyBtc === 0) {
    return { status: "unavailable", reason: "zero-contribution" };
  }

  const rows = IMPACT_TARGETS.map((target) => ({
    target,
    months: Math.ceil((results.currentBtc * target) / 100 / results.monthlyBtc),
  }));
  const startingValue = getStartingValue(results, metric);
  const targetPoints = rows.map(({ target, months }) => ({
    x: months,
    y: getTargetValue(results, metric, target),
  }));
  const hundredPercentMonths = Math.ceil(results.currentBtc / results.monthlyBtc);
  const yearEndPoint =
    hundredPercentMonths > MONTHS_PER_YEAR
      ? [{ x: MONTHS_PER_YEAR, y: getYearEndValue(results, metric) }]
      : [];
  const chartData = [{ x: 0, y: startingValue }, ...targetPoints, ...yearEndPoint].toSorted(
    (left, right) => left.x - right.x
  );

  return { status: "available", rows, chartData, hundredPercentMonths };
}

function getStartingValue(results: AccumulationResults, metric: GrowthMetric) {
  if (metric === "btc") {
    return results.currentBtc;
  }

  return 0;
}

function getTargetValue(results: AccumulationResults, metric: GrowthMetric, target: ImpactTarget) {
  if (metric === "btc") {
    return results.currentBtc + (results.currentBtc * target) / 100;
  }

  return target;
}

function getYearEndValue(results: AccumulationResults, metric: GrowthMetric) {
  if (metric === "btc") {
    return results.currentBtc + results.monthlyBtc * MONTHS_PER_YEAR;
  }

  return (results.monthlyBtc * MONTHS_PER_YEAR * 100) / results.currentBtc;
}
