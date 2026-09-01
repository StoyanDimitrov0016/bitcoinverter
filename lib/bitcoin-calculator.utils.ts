import * as z from "zod";
import {
  AccumulationInputSchema,
  AccumulationFormSchema,
  ConverterInputSchema,
  ConverterFormSchema,
  type AccumulationFormValues,
  type AccumulationInput,
  type ConverterUnit,
  type ConverterInput,
  type ConverterFormValues,
} from "./schemas/calculator.schemas";
import type { BitcoinPrices } from "./schemas/price.schemas";

export const SATS_PER_BTC = 100_000_000;
export const IMPACT_TARGETS = [10, 25, 50, 75, 100] as const;
export const ACCUMULATION_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const IMPACT_BANDS = [
  { label: "Negligible Impact", minimum: 0 },
  { label: "Low Impact", minimum: 10 },
  { label: "Moderate Impact", minimum: 25 },
  { label: "Meaningful Impact", minimum: 50 },
  { label: "High Impact", minimum: 75 },
  { label: "Extreme Impact", minimum: 100 },
] as const;

const DECIMAL_TRAILING_ZEROS_PATTERN = /(\.\d*?[1-9])0+$/;
const ZERO_DECIMAL_PATTERN = /\.0+$/;

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
  return z.validate(z.number().min(0), amount) ? amount : null;
}

export function adjustDecimalAmount(value: string, step: number, direction: 1 | -1) {
  const amount = parseDecimalAmount(value) ?? 0;
  const precision = step < 1 ? 8 : 0;
  const formatted = Math.max(0, amount + step * direction).toFixed(precision);
  return precision === 0
    ? formatted
    : formatted.replace(DECIMAL_TRAILING_ZEROS_PATTERN, "$1").replace(ZERO_DECIMAL_PATTERN, "");
}

export function parseAccumulationForm(value: AccumulationFormValues) {
  if (!z.validate(AccumulationFormSchema, value)) {
    return null;
  }
  const holding = parseDecimalAmount(value.holding);
  const contribution = parseDecimalAmount(value.contribution);
  if (holding === null || contribution === null) {
    return null;
  }
  return AccumulationInputSchema.parse({ ...value, holding, contribution });
}

export function parseConverterForm(value: ConverterFormValues) {
  if (!z.validate(ConverterFormSchema, value)) {
    return null;
  }
  const amount = parseDecimalAmount(value.value);
  return amount === null ? null : ConverterInputSchema.parse({ ...value, value: amount });
}

export function calculateAccumulation(input: AccumulationInput, prices: BitcoinPrices) {
  if (!z.validate(AccumulationInputSchema, input)) {
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
  if (!z.validate(ConverterInputSchema, input)) {
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
  return (
    IMPACT_BANDS.findLast((impactBand) => percent >= impactBand.minimum)?.label ??
    IMPACT_BANDS[0].label
  );
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
