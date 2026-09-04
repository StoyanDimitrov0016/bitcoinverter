import { useTranslations } from "next-intl";

import { formatAccumulationAmount, formatNumber } from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";

import { renderStrong } from "../shared/rich-text.utils";

type HoldingAtCurrentPriceProps = {
  currentBtc: number;
  input: AccumulationInput;
};

export function HoldingAtCurrentPrice({ currentBtc, input }: HoldingAtCurrentPriceProps) {
  const t = useTranslations("HoldingAtCurrentPrice");

  return (
    <>
      <strong>{formatAccumulationAmount(input.holding, input.holdingUnit)}</strong>
      {input.holdingUnit === "BTC"
        ? null
        : t.rich("equivalent", {
            btc: formatNumber(currentBtc),
            strong: renderStrong,
          })}
    </>
  );
}
