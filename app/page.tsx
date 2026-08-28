import Calculator from "./calculator";
import { priceProvider } from "@/lib/price-provider";

export default async function Home() {
  let initialPrices = null;
  try {
    initialPrices = await priceProvider.getBitcoinPrices();
  } catch {
    // The calculator renders a retry action when Kraken is unavailable.
  }
  return <Calculator initialPrices={initialPrices} />;
}
