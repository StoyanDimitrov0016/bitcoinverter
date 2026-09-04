import { Skeleton } from "@heroui/react";
import { useTranslations } from "next-intl";
import { TbSparkles } from "react-icons/tb";

import { getGlobalScarcityPercent } from "@/lib/impact/impact.calculations";
import { formatPercent } from "@/lib/number-format.utils";
import type { CalculatorData } from "../calculator/calculator-data-context";

type HoldingScarcityBadgeProps = { state: CalculatorData };

export function HoldingScarcityBadge({ state }: HoldingScarcityBadgeProps) {
  const t = useTranslations("HoldingScarcityBadge");
  const tCommon = useTranslations("Common");

  if (state.status === "loading") {
    return <Skeleton aria-label={t("loadingAriaLabel")} className="h-8 w-36 rounded-full" />;
  }

  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return null;
  }

  const { addedBtc, currentBtc } = state.calculation.results;
  const currentPercent = getGlobalScarcityPercent(currentBtc);
  const futurePercent = getGlobalScarcityPercent(currentBtc + addedBtc);

  if (currentPercent === null || futurePercent === null) {
    return null;
  }

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1.5 text-xs text-foreground"
      title={t("title")}
    >
      <TbSparkles aria-hidden="true" className="size-3.5 text-accent-soft-foreground" />
      <span className="font-medium">
        {tCommon("topPercent", { percent: formatScarcityPercent(currentPercent) })}
      </span>
      <span aria-hidden="true" className="text-muted">
        →
      </span>
      <span className="text-muted">
        {t("inOneYear", { percent: formatScarcityPercent(futurePercent) })}
      </span>
    </div>
  );
}

function formatScarcityPercent(value: number) {
  if (value < 1) {
    return formatPercent(value, 2);
  }

  if (value < 10) {
    return formatPercent(value, 1);
  }

  return formatPercent(value, 0);
}
