import { formatAccumulationAmount, formatNumber } from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";

type HoldingAtCurrentPriceProps = {
  currentBtc: number;
  input: AccumulationInput;
};

export function HoldingAtCurrentPrice({ currentBtc, input }: HoldingAtCurrentPriceProps) {
  return (
    <>
      <strong>{formatAccumulationAmount(input.holding, input.holdingUnit)}</strong>
      {input.holdingUnit === "BTC" ? null : (
        <>
          , equivalent to <strong>{formatNumber(currentBtc)} BTC</strong> at today's price
        </>
      )}
    </>
  );
}
