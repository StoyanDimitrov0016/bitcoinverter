import * as z from "zod";

export const BitcoinPricesSchema = z.compile(
  z.object({
    EUR: z.number().gt(0),
    USD: z.number().gt(0),
    fetchedAt: z.string(),
    provider: z.literal("Kraken"),
  })
);

export type BitcoinPricesResult = {
  prices: BitcoinPrices | null;
};

const KrakenTickerSchema = z.object({ c: z.tuple([z.string(), z.string()]) });

export const KrakenTickerResponseSchema = z.compile(
  z.object({
    error: z.array(z.string()),
    result: z.object({
      XXBTZEUR: KrakenTickerSchema,
      XXBTZUSD: KrakenTickerSchema,
    }),
  })
);

export type BitcoinPrices = z.infer<typeof BitcoinPricesSchema>;
