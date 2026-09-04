import { Card, Meter, Skeleton } from "@heroui/react";
import { useTranslations } from "next-intl";
import { TbTriangleFilled } from "react-icons/tb";

import type { AccumulationResults } from "@/lib/calculator/calculator.types";
import { getImpactBand, getImpactRange, type ImpactRange } from "@/lib/impact/impact.calculations";
import { IMPACT_BANDS } from "@/lib/impact/impact.constants";
import {
  formatAccumulationAmount,
  formatFiat,
  formatNumber,
  formatPercent,
} from "@/lib/number-format.utils";
import type { BitcoinPrices } from "@/lib/prices/price.schemas";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { BitcoinSymbol } from "../shared/currency-symbol";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { Result } from "../shared/result";
import { renderNode, renderStrong } from "../shared/rich-text.utils";
import { UnavailableValue } from "../shared/unavailable-value";
import { HoldingAtCurrentPrice } from "./holding-at-current-price";
import { HoldingScarcityBadge } from "./holding-scarcity-badge";
import { ImpactInfoDialog } from "./impact-info-dialog";

export function ImpactSummary() {
  const t = useTranslations("ImpactSummary");
  const state = useCalculatorData();

  return (
    <Card className="gap-2 overflow-hidden border-accent/30 bg-accent-soft py-3">
      <Card.Header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <Card.Title>
          {t("title")}
          <span className="ms-2 text-sm font-normal text-muted">{t("atTodaysPrice")}</span>
        </Card.Title>
        <div className="col-start-1 row-start-2 justify-self-start sm:col-start-2 sm:row-start-1">
          <HoldingScarcityBadge state={state} />
        </div>
        <ImpactInfoDialog ariaLabel={t("infoAriaLabel")} title={t("infoTitle")}>
          <ImpactExplanation state={state} />
          <ImpactBandGuide />
        </ImpactInfoDialog>
      </Card.Header>
      <Card.Content>
        <ImpactValues state={state} />
        <ImpactScale state={state} />
      </Card.Content>
    </Card>
  );
}

type ImpactExplanationProps = { state: CalculatorData };

function ImpactExplanation({ state }: ImpactExplanationProps) {
  const t = useTranslations("ImpactSummary");

  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <p>{t("explanationEmpty")}</p>;
  }

  const { input, results } = state.calculation;
  return (
    <>
      <p>
        {t.rich("explanationHoldings", {
          holding: renderNode(
            <HoldingAtCurrentPrice currentBtc={results.currentBtc} input={input} />
          ),
        })}
      </p>
      <p>
        {t.rich("explanationContributions", {
          contribution: formatAccumulationAmount(input.contribution, input.contributionUnit),
          added: formatNumber(results.addedBtc),
          strong: renderStrong,
        })}
      </p>
      <RelativeImpactExplanation prices={state.prices} results={results} />
      <p>{t("scarcityExplanation")}</p>
    </>
  );
}

type RelativeImpactExplanationProps = {
  prices: BitcoinPrices;
  results: AccumulationResults;
};

function RelativeImpactExplanation({ prices, results }: RelativeImpactExplanationProps) {
  const t = useTranslations("ImpactSummary");
  const currentPrices = `${formatFiat(prices.EUR, "EUR")} / ${formatFiat(prices.USD, "USD")}`;

  if (results.relativeImpact.status === "unavailable") {
    return <p>{t("relativeUnavailable", { prices: currentPrices })}</p>;
  }

  return (
    <p>
      {t.rich("relativeAvailable", {
        percent: formatPercent(results.relativeImpact.percent, 1),
        prices: currentPrices,
        strong: renderStrong,
      })}
    </p>
  );
}

function ImpactBandGuide() {
  const t = useTranslations("ImpactSummary");
  const tBands = useTranslations("ImpactBands");
  const tRange = useTranslations("ImpactRange");

  return (
    <div className="border-t border-separator pt-3">
      <p>{t.rich("bandGuideDescription", { strong: renderStrong })}</p>
      <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {IMPACT_BANDS.map((band, index) => (
          <li key={band.id} className="flex justify-between gap-3">
            <span>{tBands(`${band.id}.shortLabel`)}</span>
            <span className="font-mono text-foreground">
              {formatImpactRange(getImpactRange(index), tRange)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatImpactRange(range: ImpactRange, t: ReturnType<typeof useTranslations>) {
  if (range.type === "orMore") {
    return t("orMore", { minimum: range.minimum });
  }

  if (range.type === "under") {
    return t("under", { maximum: range.maximum });
  }

  return t("between", { minimum: range.minimum, maximum: range.maximum });
}

type ImpactValuesProps = { state: CalculatorData };

function ImpactValues({ state }: ImpactValuesProps) {
  const t = useTranslations("ImpactSummary");

  if (state.status === "loading") {
    return (
      <dl className="grid gap-5 sm:grid-cols-2">
        <Result
          label={t("bitcoinAdded")}
          value={
            <>
              <BitcoinSymbol />
              <NumericSkeleton width="long" />
            </>
          }
        />
        <Result
          label={t("netIncrease")}
          value={
            <>
              <NumericSkeleton />%
            </>
          }
        />
      </dl>
    );
  }

  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return (
      <dl className="grid gap-5 sm:grid-cols-2">
        <Result label={t("bitcoinAdded")} value={<UnavailableValue />} />
        <Result label={t("netIncrease")} value={<UnavailableValue />} />
      </dl>
    );
  }

  const { results } = state.calculation;
  const netIncrease =
    results.relativeImpact.status === "available" ? (
      formatPercent(results.relativeImpact.percent, 1)
    ) : (
      <UnavailableValue />
    );

  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      <Result
        label={t("bitcoinAdded")}
        value={
          <>
            <BitcoinSymbol />
            {formatNumber(results.addedBtc)}
          </>
        }
      />
      <Result label={t("netIncrease")} value={netIncrease} />
    </dl>
  );
}

type ImpactScaleProps = { state: CalculatorData };

function ImpactScale({ state }: ImpactScaleProps) {
  const tCommon = useTranslations("Common");
  const tBands = useTranslations("ImpactBands");

  if (state.status === "loading") {
    return <ImpactScaleLayout label={<ImpactStatusSkeleton />} value={0} />;
  }

  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <ImpactScaleLayout label={tCommon("unavailable")} value={0} />;
  }

  const { relativeImpact } = state.calculation.results;
  if (relativeImpact.status === "unavailable") {
    return <ImpactScaleLayout label={tCommon("unavailable")} value={0} />;
  }

  const band = getImpactBand(relativeImpact.percent);
  return (
    <ImpactScaleLayout
      label={tBands(`${band.id}.shortLabel`)}
      value={IMPACT_BANDS.indexOf(band) + 1}
      valueText={tBands(`${band.id}.label`)}
      showMarker
    />
  );
}

type ImpactScaleLayoutProps = {
  label: React.ReactNode;
  value: number;
  valueText?: string;
  showMarker?: boolean;
};

function ImpactScaleLayout({
  label,
  value,
  valueText,
  showMarker = false,
}: ImpactScaleLayoutProps) {
  const t = useTranslations("ImpactSummary");
  const tBands = useTranslations("ImpactBands");

  return (
    <div className="mt-2 border-t border-accent/20 pt-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-muted">{t("impactScale")}</span>
        <strong className="text-sm text-foreground">{label}</strong>
      </div>
      <Meter
        aria-label={t("impactLevelAriaLabel")}
        aria-valuetext={valueText ?? t("impactUnavailable")}
        maxValue={IMPACT_BANDS.length}
        minValue={0}
        value={value}
      >
        <Meter.Track className="relative h-2 overflow-visible! bg-linear-to-r from-meter-danger via-meter-warning to-meter-success">
          <Meter.Fill className="relative h-full bg-transparent! transition-[width] duration-500">
            {showMarker ? (
              <TbTriangleFilled
                aria-hidden="true"
                className="absolute end-0 bottom-full size-3 translate-x-1/2 rotate-180 text-foreground"
              />
            ) : null}
          </Meter.Fill>
        </Meter.Track>
      </Meter>
      <div
        aria-hidden="true"
        className="mt-2 hidden grid-cols-6 gap-2 text-center text-xs text-muted sm:grid"
      >
        {IMPACT_BANDS.map((band) => (
          <span key={band.id}>{tBands(`${band.id}.shortLabel`)}</span>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex justify-between text-xs text-muted sm:hidden">
        <span>{tBands(`${IMPACT_BANDS[0].id}.shortLabel`)}</span>
        <span>{tBands(`${IMPACT_BANDS[IMPACT_BANDS.length - 1].id}.shortLabel`)}</span>
      </div>
    </div>
  );
}

function ImpactStatusSkeleton() {
  const t = useTranslations("ImpactSummary");

  return (
    <Skeleton
      aria-label={t("loadingImpactStatusAriaLabel")}
      animationType="pulse"
      className="h-4 w-16 rounded-sm"
    />
  );
}
