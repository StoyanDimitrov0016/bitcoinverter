import { CalculatorDataBoundary } from "../calculator/calculator-data-boundary";
import { PercentileConverter } from "./percentile-converter";

export function PercentileConverterPanel() {
  return (
    <CalculatorDataBoundary>
      <PercentileConverter />
    </CalculatorDataBoundary>
  );
}
