import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";

import { CalculatorDataBoundary } from "../calculator/calculator-data-boundary";
import { ImpactSummary } from "../impact/impact-summary";

type PriceSummaryPanelProps = {
  input: AccumulationInput | null;
};

export function PriceSummaryPanel({ input }: PriceSummaryPanelProps) {
  return (
    <CalculatorDataBoundary input={input}>
      <ImpactSummary />
    </CalculatorDataBoundary>
  );
}
