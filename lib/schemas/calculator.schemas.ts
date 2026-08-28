import { Type } from "typebox";

export const FiatCurrencySchema = Type.Union([Type.Literal("EUR"), Type.Literal("USD")]);
export const HoldingUnitSchema = Type.Union([Type.Literal("BTC"), FiatCurrencySchema]);
export const ContributionUnitSchema = HoldingUnitSchema;
export const ConverterUnitSchema = Type.Union([HoldingUnitSchema, Type.Literal("SATS")]);
export const NonNegativeAmountSchema = Type.Number({ minimum: 0 });
export const DecimalAmountInputSchema = Type.String({
  pattern: "^(?:\\d+(?:[.,]\\d*)?|[.,]\\d+)$",
});

export const AccumulationInputSchema = Type.Object({
  holding: NonNegativeAmountSchema,
  holdingUnit: HoldingUnitSchema,
  contribution: NonNegativeAmountSchema,
  contributionUnit: ContributionUnitSchema,
});

export const ConverterInputSchema = Type.Object({
  value: NonNegativeAmountSchema,
  unit: ConverterUnitSchema,
});

export const AccumulationFormSchema = Type.Object({
  holding: DecimalAmountInputSchema,
  holdingUnit: HoldingUnitSchema,
  contribution: DecimalAmountInputSchema,
  contributionUnit: ContributionUnitSchema,
});

export const ConverterFormSchema = Type.Object({
  value: DecimalAmountInputSchema,
  unit: ConverterUnitSchema,
});

export type FiatCurrency = Type.Static<typeof FiatCurrencySchema>;
export type HoldingUnit = Type.Static<typeof HoldingUnitSchema>;
export type ContributionUnit = Type.Static<typeof ContributionUnitSchema>;
export type ConverterUnit = Type.Static<typeof ConverterUnitSchema>;
export type AccumulationInput = Type.Static<typeof AccumulationInputSchema>;
export type ConverterInput = Type.Static<typeof ConverterInputSchema>;
export type AccumulationFormValues = Type.Static<typeof AccumulationFormSchema>;
export type ConverterFormValues = Type.Static<typeof ConverterFormSchema>;
