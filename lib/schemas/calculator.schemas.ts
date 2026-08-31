import * as z from "zod";

export const FiatCurrencySchema = z.union([z.literal("EUR"), z.literal("USD")]);
export const HoldingUnitSchema = z.union([z.literal("BTC"), FiatCurrencySchema]);
export const ContributionUnitSchema = HoldingUnitSchema;
export const ConverterUnitSchema = z.union([HoldingUnitSchema, z.literal("SATS")]);
export const NonNegativeAmountSchema = z.number().min(0);
export const DecimalAmountInputSchema = z.string().regex(/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/);

export const AccumulationInputSchema = z.compile(
  z.object({
    holding: NonNegativeAmountSchema,
    holdingUnit: HoldingUnitSchema,
    contribution: NonNegativeAmountSchema,
    contributionUnit: ContributionUnitSchema,
  })
);

export const ConverterInputSchema = z.compile(
  z.object({
    value: NonNegativeAmountSchema,
    unit: ConverterUnitSchema,
  })
);

export const AccumulationFormSchema = z.compile(
  z.object({
    holding: DecimalAmountInputSchema,
    holdingUnit: HoldingUnitSchema,
    contribution: DecimalAmountInputSchema,
    contributionUnit: ContributionUnitSchema,
  })
);

export const ConverterFormSchema = z.compile(
  z.object({
    value: DecimalAmountInputSchema,
    unit: ConverterUnitSchema,
  })
);

export type FiatCurrency = z.infer<typeof FiatCurrencySchema>;
export type HoldingUnit = z.infer<typeof HoldingUnitSchema>;
export type ContributionUnit = z.infer<typeof ContributionUnitSchema>;
export type ConverterUnit = z.infer<typeof ConverterUnitSchema>;
export type AccumulationInput = z.infer<typeof AccumulationInputSchema>;
export type ConverterInput = z.infer<typeof ConverterInputSchema>;
export type AccumulationFormValues = z.infer<typeof AccumulationFormSchema>;
export type ConverterFormValues = z.infer<typeof ConverterFormSchema>;
