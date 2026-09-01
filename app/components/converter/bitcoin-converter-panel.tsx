import { CalculatorDataBoundary } from "../calculator/calculator-data-boundary";
import { BitcoinConverter } from "./bitcoin-converter";

export function BitcoinConverterPanel() {
  return (
    <CalculatorDataBoundary>
      <BitcoinConverter />
    </CalculatorDataBoundary>
  );
}
