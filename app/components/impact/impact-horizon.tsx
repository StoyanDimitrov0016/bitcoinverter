"use client";

import { Card, Tabs } from "@heroui/react";
import { useState } from "react";

import { MONTHS_PER_YEAR } from "@/lib/calculator/calculator.constants";
import { getImpactHorizonData } from "@/lib/impact/impact.calculations";
import { IMPACT_TARGETS, type GrowthMetric } from "@/lib/impact/impact.constants";
import {
  formatAccumulationAmount,
  formatFiat,
  formatImpactHorizon,
  formatNumber,
} from "@/lib/number-format.utils";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";
import { UnavailableValue } from "../shared/unavailable-value";
import { GrowthMetricToggle } from "./growth-metric-toggle";
import { HoldingAtReferencePrice } from "./holding-at-reference-price";
import { ImpactChart } from "./impact-chart";
import { ImpactInfoDialog } from "./impact-info-dialog";
import { ImpactTabs, ImpactViewTabList, type ImpactView } from "./impact-view-tabs";

const GROWTH_METRIC_CONFIG = {
  btc: {
    ariaLabel: "Total BTC holdings over time",
    yLabel: "Total BTC holdings",
    formatValue: (value: number) => `${formatNumber(value)} BTC`,
  },
  percent: {
    ariaLabel: "Percentage increase in BTC holdings over time",
    yLabel: "Increase in holdings (%)",
    formatValue: (value: number) => `${formatNumber(value, 0)}%`,
  },
} satisfies Record<
  GrowthMetric,
  { ariaLabel: string; yLabel: string; formatValue: (value: number) => string }
>;

export function ImpactHorizon() {
  const state = useCalculatorData();
  const [view, setView] = useState<ImpactView>("chart");
  const [metric, setMetric] = useState<GrowthMetric>("btc");

  return (
    <Card>
      <ImpactTabs value={view} onChange={setView}>
        <Card.Header className="flex-row items-start justify-between gap-3">
          <div>
            <Card.Title>How long until you own more BTC</Card.Title>
            <Card.Description className="-mt-1 text-xs">
              at today's reference price
            </Card.Description>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {view === "chart" ? (
              <GrowthMetricToggle
                ariaLabel="Accumulation timeline metric"
                value={metric}
                onChange={setMetric}
              />
            ) : null}
            <ImpactViewTabList ariaLabel="Accumulation timeline view" />
            <ImpactInfoDialog
              ariaLabel="Explain the accumulation timeline"
              title="How the timeline is calculated"
            >
              <ImpactHorizonExplanation state={state} />
            </ImpactInfoDialog>
          </div>
        </Card.Header>
        <Card.Content>
          <ImpactHorizonPanels metric={metric} state={state} />
        </Card.Content>
      </ImpactTabs>
    </Card>
  );
}

type ImpactHorizonPanelsProps = {
  metric: GrowthMetric;
  state: CalculatorData;
};

function ImpactHorizonPanels({ metric, state }: ImpactHorizonPanelsProps) {
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <UnavailableHorizonPanels isLoading={state.status === "loading"} />;
  }

  const data = getImpactHorizonData(state.calculation.results, metric);
  if (data.status === "unavailable") {
    return <UnavailableHorizonPanels isLoading={false} />;
  }

  const useYears = data.hundredPercentMonths > MONTHS_PER_YEAR * 2;
  const chartData = data.chartData.map((point) => ({
    ...point,
    x: useYears ? point.x / MONTHS_PER_YEAR : point.x,
  }));
  const metricConfig = GROWTH_METRIC_CONFIG[metric];
  const formatTime = useYears
    ? (value: number) => `${formatNumber(value, 1)}y`
    : (value: number) => `${Math.round(value)}m`;

  return (
    <>
      <Tabs.Panel className="m-0 p-0" id="chart">
        <ImpactChart
          ariaLabel={metricConfig.ariaLabel}
          data={chartData}
          xLabel={useYears ? "Years" : "Months"}
          xValue={formatTime}
          yLabel={metricConfig.yLabel}
          yValue={metricConfig.formatValue}
        />
      </Tabs.Panel>
      <Tabs.Panel className="m-0 p-0" id="table">
        <dl className="space-y-1">
          {data.rows.map(({ target, months }) => (
            <ResultRow
              key={target}
              label={`${target}% more BTC`}
              value={formatImpactHorizon(months)}
            />
          ))}
        </dl>
      </Tabs.Panel>
    </>
  );
}

type UnavailableHorizonPanelsProps = { isLoading: boolean };

function UnavailableHorizonPanels({ isLoading }: UnavailableHorizonPanelsProps) {
  return (
    <>
      <Tabs.Panel className="m-0 p-0" id="chart">
        {null}
      </Tabs.Panel>
      <Tabs.Panel className="m-0 p-0" id="table">
        <dl className="space-y-1">
          {IMPACT_TARGETS.map((target) => (
            <ResultRow
              key={target}
              label={`${target}% more BTC`}
              value={isLoading ? <HorizonSkeleton /> : <UnavailableValue />}
            />
          ))}
        </dl>
      </Tabs.Panel>
    </>
  );
}

function HorizonSkeleton() {
  return (
    <>
      <NumericSkeleton /> months
    </>
  );
}

type ImpactHorizonExplanationProps = { state: CalculatorData };

function ImpactHorizonExplanation({ state }: ImpactHorizonExplanationProps) {
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return (
      <p>Enter valid amounts and wait for the live BTC price to see a personalized timeline.</p>
    );
  }

  const { input, results } = state.calculation;
  const data = getImpactHorizonData(results, "btc");

  if (data.status === "unavailable") {
    return <p>{HORIZON_UNAVAILABLE_MESSAGES[data.reason]}</p>;
  }

  return (
    <>
      <p>
        This timeline uses today's Kraken reference price for every monthly purchase. You currently
        hold <HoldingAtReferencePrice currentBtc={results.currentBtc} input={input} />.
      </p>
      <p>
        Each row shows how many months of{" "}
        <strong>{formatAccumulationAmount(input.contribution, input.contributionUnit)}</strong>{" "}
        contributions are needed to add that percentage of your current holdings.
      </p>
      <p>
        For example, the 100% row means adding another {formatNumber(results.currentBtc)} BTC. At
        today's reference price ({formatFiat(state.prices.EUR, "EUR")} /{" "}
        {formatFiat(state.prices.USD, "USD")}), that takes{" "}
        <strong>{formatImpactHorizon(data.hundredPercentMonths)}</strong>.
      </p>
    </>
  );
}

const HORIZON_UNAVAILABLE_MESSAGES = {
  "zero-current-holdings": "A relative timeline needs current BTC holdings above zero.",
  "zero-contribution": "A relative timeline needs a monthly contribution above zero.",
} as const;
