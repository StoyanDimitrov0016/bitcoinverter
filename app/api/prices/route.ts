import { priceService } from "@/lib/prices/price.service";

export async function GET() {
  try {
    const prices = await priceService.getBitcoinPrices();
    return Response.json(prices);
  } catch {
    const error = { error: "Live Bitcoin prices are temporarily unavailable." };
    return Response.json(error, { status: 503 });
  }
}
