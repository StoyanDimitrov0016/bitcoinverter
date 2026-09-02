"use client";

import { Card, Tabs } from "@heroui/react";
import { useState } from "react";

import { getPriceImpactData, type PriceImpactData } from "@/lib/impact/impact.calculations";
import { IMPACT_TARGETS } from "@/lib/impact/impact.constants";
import {
  formatAccumulationAmount,
  formatChartFiat,
  formatFiat,
  formatNumber,
} from "@/lib/number-format.utils";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { FiatSkeleton } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";
import { UnavailableValue } from "../shared/unavailable-value";
import { ImpactChart } from "./impact-chart";
import { ImpactInfoDialog } from "./impact-info-dialog";
import { ImpactTabs, ImpactViewTabList, type ImpactView } from "./impact-view-tabs";

const formatPercent = (value: number) => `${formatNumber(value, 0)}%`;

export function PriceImpactLevels() {
  const state = useCalculatorData();
  const [view, setView] = useState<ImpactView>("chart");

  return (
    <Card>
      <ImpactTabs value={view} onChange={setView}>
        <Card.Header className="flex-row items-start justify-between gap-3">
          <div>
            <Card.Title>Monthly contribution runway by BTC price</Card.Title>
            <Card.Description className="-mt-1 text-xs">
              at today's reference price
            </Card.Description>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ImpactViewTabList ariaLabel="BTC price threshold view" />
            <ImpactInfoDialog
              ariaLabel="Explain the BTC price thresholds"
              title="How the price thresholds are calculated"
            >
              <PriceImpactExplanation state={state} />
            </ImpactInfoDialog>
          </div>
        </Card.Header>
        <Card.Content>
          <PriceImpactPanels state={state} />
        </Card.Content>
      </ImpactTabs>
    </Card>
  );
}

type PriceImpactPanelsProps = { state: CalculatorData };

function PriceImpactPanels({ state }: PriceImpactPanelsProps) {
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <UnavailablePriceImpactPanels isLoading={state.status === "loading"} />;
  }

  const data = getPriceImpactData(state.calculation.input, state.calculation.results, state.prices);
  if (data.status === "unavailable") {
    return <UnavailablePriceImpactPanels isLoading={false} />;
  }

  return <ResolvedPriceImpactPanels data={data} />;
}

type ResolvedPriceImpactPanelsProps = {
  data: Extract<PriceImpactData, { status: "available" }>;
};

function ResolvedPriceImpactPanels({ data }: ResolvedPriceImpactPanelsProps) {
  const formatPrice = (value: number) => formatChartFiat(value, data.currency);

  return (
    <>
      <Tabs.Panel className="m-0 p-0" id="chart">
        <ImpactChart
          ariaLabel="Percentage increase in holdings at different BTC price levels"
          data={data.chartData}
          xLabel={`BTC price (${data.currency})`}
          xValue={formatPrice}
          yLabel="Increase in holdings (%)"
          yValue={formatPercent}
        />
      </Tabs.Panel>
      <Tabs.Panel className="m-0 p-0" id="table">
        <dl className="space-y-1">
          {data.rows.toReversed().map(({ target, price }) => (
            <ResultRow
              key={target}
              label={`Adds ${target}% of current holdings`}
              value={formatFiat(price, data.currency)}
            />
          ))}
        </dl>
      </Tabs.Panel>
    </>
  );
}

type UnavailablePriceImpactPanelsProps = { isLoading: boolean };

function UnavailablePriceImpactPanels({ isLoading }: UnavailablePriceImpactPanelsProps) {
  return (
    <>
      <Tabs.Panel className="m-0 p-0" id="chart">
        {null}
      </Tabs.Panel>
      <Tabs.Panel className="m-0 p-0" id="table">
        <dl className="space-y-1">
          {IMPACT_TARGETS.toReversed().map((target) => (
            <ResultRow
              key={target}
              label={`Adds ${target}% of current holdings`}
              value={
                isLoading ? <FiatSkeleton currency="EUR" width="long" /> : <UnavailableValue />
              }
            />
          ))}
        </dl>
      </Tabs.Panel>
    </>
  );
}

type PriceImpactExplanationProps = { state: CalculatorData };

function PriceImpactExplanation({ state }: PriceImpactExplanationProps) {
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return (
      <p>Enter valid amounts and wait for the live BTC price to see personalized thresholds.</p>
    );
  }

  const { input, results } = state.calculation;
  const data = getPriceImpactData(input, results, state.prices);

  if (data.status === "unavailable") {
    if (data.reason === "btc-contribution") {
      return (
        <p>
          Your contribution is already in BTC, so price doesn't change its amount. Thresholds appear
          once the monthly contribution is set to EUR or USD.
        </p>
      );
    }

    return (
      <p>
        Relative price thresholds need current BTC holdings above zero. Enter an existing holding to
        compare it with one year of contributions.
      </p>
    );
  }

  return (
    <>
      <p>
        You currently hold <strong>{formatNumber(results.currentBtc)} BTC</strong> and contribute{" "}
        <strong>{formatAccumulationAmount(input.contribution, input.contributionUnit)}</strong> each
        month.
      </p>
      <p>
        Each row shows the BTC price at which 12 months of contributions would add that share of
        your current holdings. For example, the 100% threshold is{" "}
        <strong>{formatFiat(data.hundredPercentPrice, data.currency)}</strong>; at that price, your
        annual contributions would buy another {formatNumber(results.currentBtc)} BTC.
      </p>
      <p>
        Today's reference price is {formatFiat(state.prices.EUR, "EUR")} /{" "}
        {formatFiat(state.prices.USD, "USD")}. These thresholds are mathematical scenarios, not
        price forecasts.
      </p>
    </>
  );
}
