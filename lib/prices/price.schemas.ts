import * as z from "zod";

export const BitcoinPricesSchema = z.compile(
  z.object({
    EUR: z.number().gt(0),
    USD: z.number().gt(0),
    fetchedAt: z.string(),
    provider: z.literal("Kraken"),
  })
);

export type BitcoinPrices = z.infer<typeof BitcoinPricesSchema>;

export type BitcoinPricesResult = { status: "ready"; prices: BitcoinPrices } | { status: "error" };
