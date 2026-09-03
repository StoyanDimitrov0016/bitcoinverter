import { Card, Meter, Skeleton } from "@heroui/react";
import { TbTriangleFilled } from "react-icons/tb";

import type { AccumulationResults } from "@/lib/calculator/calculator.types";
import { getImpactBand, getImpactRange } from "@/lib/impact/impact.calculations";
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
import { UnavailableValue } from "../shared/unavailable-value";
import { HoldingAtCurrentPrice } from "./holding-at-current-price";
import { HoldingScarcityBadge } from "./holding-scarcity-badge";
import { ImpactInfoDialog } from "./impact-info-dialog";

export function ImpactSummary() {
  const state = useCalculatorData();

  return (
    <Card className="gap-2 overflow-hidden border-accent/30 bg-accent-soft py-3">
      <Card.Header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <Card.Title>
          What one year of contributions adds
          <span className="ms-2 text-sm font-normal text-muted">at today's price</span>
        </Card.Title>
        <div className="col-start-1 row-start-2 justify-self-start sm:col-start-2 sm:row-start-1">
          <HoldingScarcityBadge state={state} />
        </div>
        <ImpactInfoDialog
          ariaLabel="Explain the one-year accumulation result"
          title="How this result is calculated"
        >
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
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return (
      <p>Enter valid amounts and wait for the live BTC price to see a personalized example.</p>
    );
  }

  const { input, results } = state.calculation;
  return (
    <>
      <p>
        You currently hold <HoldingAtCurrentPrice currentBtc={results.currentBtc} input={input} />.
      </p>
      <p>
        At today's Kraken price, 12 monthly contributions of{" "}
        <strong>{formatAccumulationAmount(input.contribution, input.contributionUnit)}</strong> add{" "}
        <strong>{formatNumber(results.addedBtc)} BTC</strong>.
      </p>
      <RelativeImpactExplanation prices={state.prices} results={results} />
      <p>
        The scarcity badge compares your holdings with the BTC available per person worldwide. It is
        a theoretical ceiling, not a wallet ranking.
      </p>
    </>
  );
}

type RelativeImpactExplanationProps = {
  prices: BitcoinPrices;
  results: AccumulationResults;
};

function RelativeImpactExplanation({ prices, results }: RelativeImpactExplanationProps) {
  const currentPrices = `${formatFiat(prices.EUR, "EUR")} / ${formatFiat(prices.USD, "USD")}`;

  if (results.relativeImpact.status === "unavailable") {
    return (
      <p>
        A relative percentage needs current BTC holdings above zero. The same price is used for each
        monthly purchase: {currentPrices}.
      </p>
    );
  }

  return (
    <p>
      That is a <strong>{formatPercent(results.relativeImpact.percent, 1)} increase</strong> in your
      current BTC holdings. The same price is used for each purchase: {currentPrices}.
    </p>
  );
}

function ImpactBandGuide() {
  return (
    <div className="border-t border-separator pt-3">
      <p>
        <strong>Impact percentage</strong> is the BTC added over 12 months divided by your current
        BTC holdings, multiplied by 100.
      </p>
      <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {IMPACT_BANDS.map((band, index) => (
          <li key={band.label} className="flex justify-between gap-3">
            <span>{band.shortLabel}</span>
            <span className="font-mono text-foreground">{getImpactRange(index)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ImpactValuesProps = { state: CalculatorData };

function ImpactValues({ state }: ImpactValuesProps) {
  if (state.status === "loading") {
    return (
      <dl className="grid gap-5 sm:grid-cols-2">
        <Result
          label="Bitcoin added"
          value={
            <>
              <BitcoinSymbol />
              <NumericSkeleton width="long" />
            </>
          }
        />
        <Result
          label="Net increase"
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
        <Result label="Bitcoin added" value={<UnavailableValue />} />
        <Result label="Net increase" value={<UnavailableValue />} />
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
        label="Bitcoin added"
        value={
          <>
            <BitcoinSymbol />
            {formatNumber(results.addedBtc)}
          </>
        }
      />
      <Result label="Net increase" value={netIncrease} />
    </dl>
  );
}

type ImpactScaleProps = { state: CalculatorData };

function ImpactScale({ state }: ImpactScaleProps) {
  if (state.status === "loading") {
    return <ImpactScaleLayout label={<ImpactStatusSkeleton />} value={0} />;
  }

  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <ImpactScaleLayout label="Unavailable" value={0} />;
  }

  const { relativeImpact } = state.calculation.results;
  if (relativeImpact.status === "unavailable") {
    return <ImpactScaleLayout label="Unavailable" value={0} />;
  }

  const band = getImpactBand(relativeImpact.percent);
  return (
    <ImpactScaleLayout
      label={band.shortLabel}
      value={IMPACT_BANDS.indexOf(band) + 1}
      valueText={band.label}
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
  valueText = "Impact unavailable",
  showMarker = false,
}: ImpactScaleLayoutProps) {
  return (
    <div className="mt-2 border-t border-accent/20 pt-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-muted">Impact scale</span>
        <strong className="text-sm text-foreground">{label}</strong>
      </div>
      <Meter
        aria-label="Accumulation impact level"
        aria-valuetext={valueText}
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
          <span key={band.label}>{band.shortLabel}</span>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex justify-between text-xs text-muted sm:hidden">
        <span>{IMPACT_BANDS[0].shortLabel}</span>
        <span>{IMPACT_BANDS[IMPACT_BANDS.length - 1].shortLabel}</span>
      </div>
    </div>
  );
}

function ImpactStatusSkeleton() {
  return (
    <Skeleton
      aria-label="Loading impact status"
      animationType="pulse"
      className="h-4 w-16 rounded-sm"
    />
  );
}
