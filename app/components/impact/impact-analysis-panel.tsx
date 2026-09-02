import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";

import { CalculatorDataBoundary } from "../calculator/calculator-data-boundary";
import { ImpactHorizon } from "./impact-horizon";

type ImpactAnalysisPanelProps = {
  input: AccumulationInput | null;
};

export function ImpactAnalysisPanel({ input }: ImpactAnalysisPanelProps) {
  return (
    <CalculatorDataBoundary input={input}>
      <ImpactHorizon />
    </CalculatorDataBoundary>
  );
}
