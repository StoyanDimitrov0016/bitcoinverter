import * as z from "zod";

const KrakenPriceSchema = z.string().pipe(z.coerce.number<string>().gt(0));

const KrakenTickerSchema = z.object({
  c: z.tuple([KrakenPriceSchema, z.string()]),
});

export const KrakenResponseEnvelopeSchema = z.compile(
  z.object({
    error: z.array(z.string()),
    result: z.unknown(),
  })
);

export const KrakenTickerResultSchema = z.compile(
  z.object({
    XXBTZEUR: KrakenTickerSchema,
    XXBTZUSD: KrakenTickerSchema,
  })
);

export type KrakenTickerResult = z.infer<typeof KrakenTickerResultSchema>;
