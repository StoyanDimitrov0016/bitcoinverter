import { priceProvider } from "@/lib/price-provider";
import { PriceApiErrorSchema } from "@/lib/schemas/price.schemas";
import { Value } from "typebox/value";

export async function GET() {
  try {
    return Response.json(await priceProvider.getBitcoinPrices());
  } catch {
    return Response.json(
      Value.Parse(PriceApiErrorSchema, {
        error: "Live Bitcoin prices are temporarily unavailable.",
      }),
      { status: 503 }
    );
  }
}
