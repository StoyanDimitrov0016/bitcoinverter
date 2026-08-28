import { Type } from "typebox";

export const PositivePriceSchema = Type.Number({ exclusiveMinimum: 0 });

export const BitcoinPricesSchema = Type.Object({
  EUR: PositivePriceSchema,
  USD: PositivePriceSchema,
  fetchedAt: Type.String(),
  provider: Type.Literal("Kraken"),
});

const KrakenTickerSchema = Type.Object(
  { c: Type.Tuple([Type.String(), Type.String()]) },
  { additionalProperties: true }
);

export const KrakenTickerResponseSchema = Type.Object(
  {
    error: Type.Array(Type.String()),
    result: Type.Object(
      {
        XXBTZEUR: KrakenTickerSchema,
        XXBTZUSD: KrakenTickerSchema,
      },
      { additionalProperties: true }
    ),
  },
  { additionalProperties: true }
);

export const PriceApiErrorSchema = Type.Object({
  error: Type.String(),
});

export type BitcoinPrices = Type.Static<typeof BitcoinPricesSchema>;
export type KrakenTickerResponse = Type.Static<typeof KrakenTickerResponseSchema>;
export type PriceApiError = Type.Static<typeof PriceApiErrorSchema>;
