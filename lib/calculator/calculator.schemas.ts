import * as z from "zod";

import {
  CONTRIBUTION_UNITS,
  CONVERTER_UNITS,
  FIAT_CURRENCIES,
  HOLDING_UNITS,
} from "./calculator.constants";

const DECIMAL_AMOUNT_PATTERN = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/;
const INVALID_AMOUNT_MESSAGE = "Enter non-negative number";

export const FiatCurrencySchema = z.enum(FIAT_CURRENCIES);
export const HoldingUnitSchema = z.enum(HOLDING_UNITS);
export const ContributionUnitSchema = z.enum(CONTRIBUTION_UNITS);
export const ConverterUnitSchema = z.enum(CONVERTER_UNITS);

export const DecimalAmountSchema = z
  .string()
  .regex(DECIMAL_AMOUNT_PATTERN, INVALID_AMOUNT_MESSAGE)
  .transform((value) => Number(value.replace(",", ".")))
  .pipe(z.number().nonnegative(INVALID_AMOUNT_MESSAGE));

export const AccumulationSchema = z.object({
  holding: DecimalAmountSchema,
  holdingUnit: HoldingUnitSchema,
  contribution: DecimalAmountSchema,
  contributionUnit: ContributionUnitSchema,
});

export const ConverterSchema = z.object({
  value: DecimalAmountSchema,
  unit: ConverterUnitSchema,
});

export type FiatCurrency = z.infer<typeof FiatCurrencySchema>;
export type HoldingUnit = z.infer<typeof HoldingUnitSchema>;
export type ContributionUnit = z.infer<typeof ContributionUnitSchema>;
export type ConverterUnit = z.infer<typeof ConverterUnitSchema>;
export type AccumulationFormValues = z.input<typeof AccumulationSchema>;
export type AccumulationInput = z.output<typeof AccumulationSchema>;
export type ConverterFormValues = z.input<typeof ConverterSchema>;
export type ConverterInput = z.output<typeof ConverterSchema>;
