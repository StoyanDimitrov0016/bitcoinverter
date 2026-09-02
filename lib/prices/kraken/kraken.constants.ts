export const KRAKEN_TICKER_URL = "https://api.kraken.com/0/public/Ticker?pair=XBTEUR,XBTUSD";

export const RETRYABLE_KRAKEN_HTTP_STATUSES = new Set([408, 429]);

export const RETRYABLE_KRAKEN_ERROR_FRAGMENTS = ["Rate limit exceeded", "Throttled"] as const;
