export const FIAT_CURRENCIES = ["EUR", "USD"] as const;
export const HOLDING_UNITS = ["USD", "EUR", "BTC"] as const;
export const CONTRIBUTION_UNITS = HOLDING_UNITS;
export const CONVERTER_UNITS = ["SATS", "EUR", "USD", "BTC"] as const;

export const MONTHS_PER_YEAR = 12;
export const SATS_PER_BTC = 100_000_000;
export const ACCUMULATION_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const CONTRIBUTION_DEFAULTS = {
  USD: "100",
  EUR: "100",
  BTC: "0.001",
} as const;
