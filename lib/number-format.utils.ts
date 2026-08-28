import type { FiatCurrency, HoldingUnit } from "./schemas/calculator.schemas";

export function formatNumber(value: number, maximumFractionDigits = 8) {
  return new Intl.NumberFormat("en", { maximumFractionDigits }).format(value);
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

export function formatImpactHorizon(months: number | null) {
  if (!months) {
    return "—";
  }
  return months < 24
    ? `${months} months`
    : `${formatNumber(months / 12, 1)} years (${months} months)`;
}
