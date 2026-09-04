import { describe, expect, it, vi } from "vitest";
import { PriceProviderError, PriceServiceError } from "./price.errors";
import type { BitcoinPrices } from "./price.schemas";
import { PriceService } from "./price.service";

vi.mock("server-only", () => ({}));

const PRICES: BitcoinPrices = {
  EUR: 50_000,
  USD: 55_000,
  fetchedAt: "2026-09-03T00:00:00.000Z",
  provider: "Kraken",
};

describe("PriceService", () => {
  it("returns prices without waiting when the first attempt succeeds", async () => {
    const fetchPrices = vi.fn().mockResolvedValue(PRICES);
    const wait = vi.fn().mockResolvedValue(undefined);
    const service = new PriceService({ fetchPrices, wait });

    await expect(service.getBitcoinPrices()).resolves.toEqual(PRICES);
    expect(fetchPrices).toHaveBeenCalledOnce();
    expect(wait).not.toHaveBeenCalled();
  });

  it("waits and retries once after a retryable provider error", async () => {
    const providerError = new PriceProviderError("Temporary failure", true);
    const fetchPrices = vi.fn().mockRejectedValueOnce(providerError).mockResolvedValue(PRICES);
    const wait = vi.fn().mockResolvedValue(undefined);
    const service = new PriceService({ fetchPrices, retryDelayMs: 125, wait });

    await expect(service.getBitcoinPrices()).resolves.toEqual(PRICES);
    expect(fetchPrices).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledOnce();
    expect(wait).toHaveBeenCalledWith(125);
  });

  it("stops immediately after a non-retryable provider error", async () => {
    const providerError = new PriceProviderError("Invalid response", false);
    const fetchPrices = vi.fn().mockRejectedValue(providerError);
    const wait = vi.fn().mockResolvedValue(undefined);
    const service = new PriceService({ fetchPrices, wait });

    const result = service.getBitcoinPrices();

    await expect(result).rejects.toMatchObject({ cause: providerError });
    await expect(result).rejects.toBeInstanceOf(PriceServiceError);
    expect(fetchPrices).toHaveBeenCalledOnce();
    expect(wait).not.toHaveBeenCalled();
  });

  it("wraps the final error after both retry attempts fail", async () => {
    const firstError = new PriceProviderError("First temporary failure", true);
    const finalError = new PriceProviderError("Second temporary failure", true);
    const fetchPrices = vi.fn().mockRejectedValueOnce(firstError).mockRejectedValueOnce(finalError);
    const wait = vi.fn().mockResolvedValue(undefined);
    const service = new PriceService({ fetchPrices, wait });

    const result = service.getBitcoinPrices();

    await expect(result).rejects.toMatchObject({ cause: finalError });
    expect(fetchPrices).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledOnce();
  });

  it("wraps unexpected errors without retrying", async () => {
    const unexpectedError = new Error("Unexpected failure");
    const fetchPrices = vi.fn().mockRejectedValue(unexpectedError);
    const wait = vi.fn().mockResolvedValue(undefined);
    const service = new PriceService({ fetchPrices, wait });

    await expect(service.getBitcoinPrices()).rejects.toMatchObject({ cause: unexpectedError });
    expect(fetchPrices).toHaveBeenCalledOnce();
    expect(wait).not.toHaveBeenCalled();
  });
});
