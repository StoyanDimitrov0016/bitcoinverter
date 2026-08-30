import { priceProvider } from "@/lib/price-provider";
import { PriceApiErrorSchema } from "@/lib/schemas/price.schemas";

export async function GET() {
  try {
    return Response.json(await priceProvider.getBitcoinPrices());
  } catch {
    return Response.json(
      PriceApiErrorSchema.parse({
        error: "Live Bitcoin prices are temporarily unavailable.",
      }),
      { status: 503 }
    );
  }
}
