import { MONTHS_PER_YEAR } from "../calculator/calculator.constants";
import type { AccumulationInput, FiatCurrency } from "../calculator/calculator.schemas";
import type { AccumulationResults } from "../calculator/calculator.types";
import type { BitcoinPrices } from "../prices/price.schemas";
import {
  IMPACT_BANDS,
  IMPACT_TARGETS,
  type GrowthMetric,
  type ImpactBand,
  type ImpactTarget,
} from "./impact.constants";

export type ChartPoint = { x: number; y: number };

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

export type PriceImpactData =
  | {
      status: "available";
      currency: FiatCurrency;
      rows: { target: ImpactTarget; price: number }[];
      chartData: ChartPoint[];
      hundredPercentPrice: number;
    }
  | {
      status: "unavailable";
      reason: "btc-contribution" | "zero-current-holdings";
    };

export function getImpactBand(percent: number): ImpactBand {
  return IMPACT_BANDS.findLast((impactBand) => percent >= impactBand.minimum) ?? IMPACT_BANDS[0];
}

export function getImpactRange(index: number) {
  const impactBand = IMPACT_BANDS[index];
  const nextImpactBand = IMPACT_BANDS[index + 1];

  if (!impactBand) {
    throw new RangeError(`Unknown impact band index: ${index}`);
  }

  if (!nextImpactBand) {
    return `${impactBand.minimum}% or more`;
  }

  if (impactBand.minimum === 0) {
    return `Under ${nextImpactBand.minimum}%`;
  }

  return `${impactBand.minimum}% to under ${nextImpactBand.minimum}%`;
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
  const startingValue = metric === "btc" ? results.currentBtc : 0;
  const chartData = [
    { x: 0, y: startingValue },
    ...rows.map(({ target, months }) => ({
      x: months,
      y: metric === "btc" ? results.currentBtc + (results.currentBtc * target) / 100 : target,
    })),
  ];
  const hundredPercentMonths = Math.ceil(results.currentBtc / results.monthlyBtc);

  return { status: "available", rows, chartData, hundredPercentMonths };
}

export function getPriceImpactData(
  input: AccumulationInput,
  results: AccumulationResults,
  prices: BitcoinPrices
): PriceImpactData {
  if (input.contributionUnit === "BTC") {
    return { status: "unavailable", reason: "btc-contribution" };
  }

  if (results.currentBtc === 0) {
    return { status: "unavailable", reason: "zero-current-holdings" };
  }

  const currency = input.contributionUnit;
  const rows = IMPACT_TARGETS.map((target) => ({
    target,
    price: (input.contribution * MONTHS_PER_YEAR) / ((results.currentBtc * target) / 100),
  }));
  const hundredPercentPrice = (input.contribution * MONTHS_PER_YEAR) / results.currentBtc;

  const chartData = createPriceImpactChartData(rows, prices[currency]);
  return { status: "available", currency, rows, chartData, hundredPercentPrice };
}

function createPriceImpactChartData(
  rows: { target: ImpactTarget; price: number }[],
  referencePrice: number
) {
  const positivePoints = rows
    .filter(({ price }) => price > 0)
    .toSorted((left, right) => left.price - right.price)
    .map(({ price, target }) => ({ x: price, y: target }));

  if (positivePoints.length > 0) {
    return positivePoints;
  }

  return [
    { x: 0, y: 0 },
    { x: referencePrice * 2, y: 0 },
  ];
}

export function getMonthlyGrowthValue(
  month: number,
  results: AccumulationResults,
  metric: GrowthMetric
) {
  if (metric === "btc") {
    return results.monthlyBtc * month;
  }

  if (results.relativeImpact.status === "unavailable") {
    return 0;
  }

  return (results.relativeImpact.percent / MONTHS_PER_YEAR) * month;
}
