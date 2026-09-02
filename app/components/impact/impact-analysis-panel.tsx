import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";

import { CalculatorDataBoundary } from "../calculator/calculator-data-boundary";
import { ImpactHorizon } from "./impact-horizon";
import { PriceImpactLevels } from "./price-impact-levels";

type ImpactAnalysisPanelProps = {
  input: AccumulationInput | null;
};

export function ImpactAnalysisPanel({ input }: ImpactAnalysisPanelProps) {
  return (
    <CalculatorDataBoundary input={input}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ImpactHorizon />
        <PriceImpactLevels />
      </div>
    </CalculatorDataBoundary>
  );
}
