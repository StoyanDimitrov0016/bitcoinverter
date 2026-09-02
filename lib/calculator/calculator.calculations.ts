import type { BitcoinPrices } from "../prices/price.schemas";
import { MONTHS_PER_YEAR, SATS_PER_BTC } from "./calculator.constants";
import {
  AccumulationSchema,
  ConverterSchema,
  DecimalAmountSchema,
  type AccumulationInput,
  type ConverterInput,
  type ConverterUnit,
  type HoldingUnit,
} from "./calculator.schemas";
import type { AccumulationResults, RelativeImpact } from "./calculator.types";

const DECIMAL_TRAILING_ZEROS_PATTERN = /(\.\d*?[1-9])0+$/;
const ZERO_DECIMAL_PATTERN = /\.0+$/;

export function parseAccumulationInput(value: unknown) {
  const result = AccumulationSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseConverterInput(value: unknown) {
  const result = ConverterSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseDecimalAmount(value: string) {
  const result = DecimalAmountSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function getAmountStep(unit: ConverterUnit) {
  return unit === "BTC" ? 0.001 : 1;
}

export function adjustDecimalAmount(value: string, step: number, direction: 1 | -1) {
  const amount = parseDecimalAmount(value) ?? 0;
  const precision = step < 1 ? 8 : 0;
  const formatted = Math.max(0, amount + step * direction).toFixed(precision);

  if (precision === 0) {
    return formatted;
  }

  return formatted.replace(DECIMAL_TRAILING_ZEROS_PATTERN, "$1").replace(ZERO_DECIMAL_PATTERN, "");
}

export function convertAmountToBitcoin(amount: number, unit: HoldingUnit, prices: BitcoinPrices) {
  if (unit === "BTC") {
    return amount;
  }

  return amount / prices[unit];
}

function calculateRelativeImpact(currentBtc: number, addedBtc: number): RelativeImpact {
  if (currentBtc === 0) {
    return { status: "unavailable", reason: "zero-current-holdings" };
  }

  return { status: "available", percent: (addedBtc / currentBtc) * 100 };
}

export function calculateAccumulation(
  input: AccumulationInput,
  prices: BitcoinPrices
): AccumulationResults {
  const currentBtc = convertAmountToBitcoin(input.holding, input.holdingUnit, prices);
  const monthlyBtc = convertAmountToBitcoin(input.contribution, input.contributionUnit, prices);
  const addedBtc = monthlyBtc * MONTHS_PER_YEAR;

  return {
    currentBtc,
    monthlyBtc,
    addedBtc,
    relativeImpact: calculateRelativeImpact(currentBtc, addedBtc),
  };
}

export function convertToBitcoin(input: ConverterInput, prices: BitcoinPrices) {
  if (input.unit === "BTC") {
    return input.value;
  }

  if (input.unit === "SATS") {
    return input.value / SATS_PER_BTC;
  }

  return input.value / prices[input.unit];
}
