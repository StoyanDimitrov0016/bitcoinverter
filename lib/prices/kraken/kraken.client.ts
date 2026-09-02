import "server-only";

import type { BitcoinPrices } from "../price.schemas";
import { KRAKEN_TICKER_URL } from "./kraken.constants";
import { KrakenRequestError } from "./kraken.errors";
import { KrakenResponseEnvelopeSchema, KrakenTickerResultSchema } from "./kraken.schemas";
import {
  containsRetryableKrakenError,
  isRetryableKrakenStatus,
  toBitcoinPrices,
} from "./kraken.utils";

export async function fetchKrakenBitcoinPrices(): Promise<BitcoinPrices> {
  let response: Response;

  try {
    response = await fetch(KRAKEN_TICKER_URL, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8_000),
    });
  } catch (error) {
    throw new KrakenRequestError("Unable to reach Kraken", true, { cause: error });
  }

  if (!response.ok) {
    throw new KrakenRequestError(
      `Kraken responded with HTTP ${response.status}`,
      isRetryableKrakenStatus(response.status)
    );
  }

  try {
    const responseData: unknown = await response.json();
    const responseEnvelope = KrakenResponseEnvelopeSchema.parse(responseData);

    if (responseEnvelope.error.length > 0) {
      throw new KrakenRequestError(
        responseEnvelope.error.join(", "),
        containsRetryableKrakenError(responseEnvelope.error)
      );
    }

    return toBitcoinPrices(KrakenTickerResultSchema.parse(responseEnvelope.result));
  } catch (error) {
    if (error instanceof KrakenRequestError) {
      throw error;
    }

    throw new KrakenRequestError("Kraken returned an invalid price response", false, {
      cause: error,
    });
  }
}
