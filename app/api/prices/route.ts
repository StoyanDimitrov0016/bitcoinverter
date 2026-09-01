import { priceProvider } from "@/lib/price-provider";

const PRICE_API_ERROR = {
  error: "Live Bitcoin prices are temporarily unavailable.",
} as const;

export async function GET() {
  try {
    const prices = await priceProvider.getBitcoinPrices();
    return Response.json(prices);
  } catch {
    return Response.json(PRICE_API_ERROR, { status: 503 });
  }
}
