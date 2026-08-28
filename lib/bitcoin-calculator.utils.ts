import { Value } from "typebox/value";
import {
  AccumulationInputSchema,
  AccumulationFormSchema,
  ConverterInputSchema,
  ConverterFormSchema,
  NonNegativeAmountSchema,
  type AccumulationFormValues,
  type AccumulationInput,
  type ConverterUnit,
  type ConverterInput,
  type ConverterFormValues,
} from "./schemas/calculator.schemas";
import type { BitcoinPrices } from "./schemas/price.schemas";

export const SATS_PER_BTC = 100_000_000;
export const ImpactTargets = [10, 25, 50, 75, 100] as const;
export const AccumulationMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type AccumulationResults = {
  currentBtc: number;
  monthlyBtc: number;
  addedBtc: number;
  impact: number;
};

export function getAmountStep(unit: ConverterUnit) {
  return unit === "BTC" ? 0.001 : 1;
}

export function parseDecimalAmount(value: string) {
  const normalizedValue = value.replace(",", ".");
  const amount = Number(normalizedValue);
  return Value.Check(NonNegativeAmountSchema, amount) ? amount : null;
}

export function adjustDecimalAmount(value: string, step: number, direction: 1 | -1) {
  const amount = parseDecimalAmount(value) ?? 0;
  const precision = step < 1 ? 8 : 0;
  return Math.max(0, amount + step * direction)
    .toFixed(precision)
    .replace(/\.?0+$/, "");
}

export function parseAccumulationForm(value: AccumulationFormValues) {
  if (!Value.Check(AccumulationFormSchema, value)) {
    return null;
  }
  const holding = parseDecimalAmount(value.holding);
  const contribution = parseDecimalAmount(value.contribution);
  if (holding === null || contribution === null) {
    return null;
  }
  return Value.Parse(AccumulationInputSchema, { ...value, holding, contribution });
}

export function parseConverterForm(value: ConverterFormValues) {
  if (!Value.Check(ConverterFormSchema, value)) {
    return null;
  }
  const amount = parseDecimalAmount(value.value);
  return amount === null ? null : Value.Parse(ConverterInputSchema, { ...value, value: amount });
}

export function calculateAccumulation(input: AccumulationInput, prices: BitcoinPrices) {
  if (!Value.Check(AccumulationInputSchema, input)) {
    return null;
  }
  const currentBtc =
    input.holdingUnit === "BTC" ? input.holding : input.holding / prices[input.holdingUnit];
  const monthlyBtc =
    input.contributionUnit === "BTC"
      ? input.contribution
      : input.contribution / prices[input.contributionUnit];
  const addedBtc = monthlyBtc * 12;
  const impact = currentBtc > 0 ? (addedBtc / currentBtc) * 100 : 0;
  return { currentBtc, monthlyBtc, addedBtc, impact } satisfies AccumulationResults;
}

export function convertToBitcoin(input: ConverterInput, prices: BitcoinPrices) {
  if (!Value.Check(ConverterInputSchema, input)) {
    return null;
  }
  if (input.unit === "BTC") {
    return input.value;
  }
  if (input.unit === "SATS") {
    return input.value / SATS_PER_BTC;
  }
  return input.value / prices[input.unit];
}

export function getImpactBand(percent: number) {
  if (percent >= 100) {
    return "Very High Impact";
  }
  if (percent >= 75) {
    return "High Impact";
  }
  if (percent >= 50) {
    return "Meaningful Impact";
  }
  if (percent >= 25) {
    return "Moderate Impact";
  }
  if (percent >= 10) {
    return "Low Impact";
  }
  return "Negligible Impact";
}

export function calculateImpactHorizon(results: AccumulationResults, target: number) {
  return results.monthlyBtc > 0
    ? Math.ceil((results.currentBtc * target) / 100 / results.monthlyBtc)
    : null;
}

export function calculatePriceImpactLevel(
  contribution: number,
  currentBtc: number,
  target: number
) {
  return currentBtc > 0 ? (contribution * 12) / ((currentBtc * target) / 100) : null;
}
