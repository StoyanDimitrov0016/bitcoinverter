import { BitcoinPricesSchema, type BitcoinPrices } from "./price.schemas";

export async function fetchBitcoinPrices(): Promise<BitcoinPrices> {
  const response = await fetch("/api/prices", { cache: "no-store" });
  const responseData: unknown = await response.json();

  if (!response.ok) {
    throw new Error("The price service returned an error response");
  }

  return BitcoinPricesSchema.parse(responseData);
}
