import type { FiatCurrency, HoldingUnit } from "./calculator/calculator.schemas";
import { MONTHS_PER_YEAR } from "./calculator/calculator.constants";

export function formatNumber(value: number, maximumFractionDigits = 8) {
  return new Intl.NumberFormat("en", { maximumFractionDigits }).format(value);
}

export function formatInteger(value: number) {
  return formatNumber(value, 0);
}

export function formatPercent(value: number, maximumFractionDigits = 8) {
  return `${formatNumber(value, maximumFractionDigits)}%`;
}

export function formatFiat(value: number, currency: FiatCurrency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRateFiat(value: number, currency: FiatCurrency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: value < 0.01 ? 6 : 2,
    maximumFractionDigits: value < 0.01 ? 6 : 2,
  }).format(value);
}

export function formatBitcoin(value: number) {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format(value);
}

export function formatAccumulationAmount(value: number, unit: HoldingUnit) {
  return unit === "BTC" ? `${formatNumber(value)} BTC` : formatFiat(value, unit);
}

type CompactTimeUnits = {
  month: string;
  year: string;
};

const DEFAULT_COMPACT_TIME_UNITS: CompactTimeUnits = { month: "mo", year: "y" };

export function formatImpactHorizon(
  months: number,
  units: CompactTimeUnits = DEFAULT_COMPACT_TIME_UNITS
) {
  if (months < MONTHS_PER_YEAR) {
    return `${months}${units.month}`;
  }

  const years = Math.floor(months / MONTHS_PER_YEAR);
  const remainingMonths = months % MONTHS_PER_YEAR;

  if (remainingMonths === 0) {
    return `${years}${units.year}`;
  }

  return `${years}${units.year} ${remainingMonths}${units.month}`;
}
