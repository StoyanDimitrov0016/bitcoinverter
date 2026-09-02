"use client";

import { Card, Tabs } from "@heroui/react";
import { useState } from "react";

import { calculateImpactHorizon, type AccumulationResults } from "@/lib/bitcoin-calculator.utils";
import { getImpactHorizonData, type GrowthMetric } from "@/lib/impact-chart.utils";
import {
  formatAccumulationAmount,
  formatFiat,
  formatImpactHorizon,
  formatNumber,
} from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";
import { useCalculatorData } from "../calculator/calculator-data-context";
import { ImpactInfoDialog } from "./impact-info-dialog";
import { HoldingAtReferencePrice } from "./holding-at-reference-price";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";
import { ImpactChart } from "./impact-chart";
import { ImpactTabs, ImpactViewTabList, type ImpactView } from "./impact-view-tabs";
import { GrowthMetricToggle } from "./growth-metric-toggle";

const formatPercent = (value: number) => `${formatNumber(value, 0)}%`;
const formatBtc = (value: number) => `${formatNumber(value)} BTC`;

export function ImpactHorizon() {
  const { input, isPriceLoading, prices, results } = useCalculatorData();
  const [view, setView] = useState<ImpactView>("chart");
  const [metric, setMetric] = useState<GrowthMetric>("btc");
  const { rows: horizonRows, chartData } = getImpactHorizonData(results, metric);
  const useYears = (chartData.at(-1)?.x ?? 0) > 24;
  const displayedData = chartData.map((point) => ({
    ...point,
    x: useYears ? point.x / 12 : point.x,
  }));
  const formatTime = (value: number) =>
    useYears ? `${formatNumber(value, 1)}y` : `${Math.round(value)}m`;

  return (
    <Card>
      <ImpactTabs value={view} onChange={setView}>
        <Card.Header className="flex-row items-start justify-between gap-3">
          <div>
            <Card.Title>How long until you own more BTC</Card.Title>
            <Card.Description className="-mt-1 text-xs">
              at today’s reference price
            </Card.Description>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {view === "chart" ? <GrowthMetricToggle value={metric} onChange={setMetric} /> : null}
            <ImpactViewTabList />
            <ImpactInfoDialog
              ariaLabel="Explain the accumulation timeline"
              title="How the timeline is calculated"
            >
              <ImpactHorizonExplanation input={input} prices={prices} results={results} />
            </ImpactInfoDialog>
          </div>
        </Card.Header>
        <Card.Content>
          <Tabs.Panel className="m-0 p-0" id="chart">
            {displayedData.length > 1 ? (
              <ImpactChart
                ariaLabel={`${metric === "btc" ? "Total BTC holdings" : "Percentage increase in BTC holdings"} over time`}
                data={displayedData}
                xLabel={useYears ? "Years" : "Months"}
                xValue={formatTime}
                yLabel={metric === "btc" ? "Total BTC holdings" : "Increase in holdings (%)"}
                yValue={metric === "btc" ? formatBtc : formatPercent}
              />
            ) : null}
          </Tabs.Panel>
          <Tabs.Panel className="m-0 p-0" id="table">
            <dl className="space-y-1">
              {horizonRows.map(({ target, months }) => {
                return (
                  <ResultRow
                    key={target}
                    label={`${target}% more BTC`}
                    value={
                      months === null && isPriceLoading ? (
                        <>
                          <NumericSkeleton /> months
                        </>
                      ) : (
                        formatImpactHorizon(months)
                      )
                    }
                  />
                );
              })}
            </dl>
          </Tabs.Panel>
        </Card.Content>
      </ImpactTabs>
    </Card>
  );
}

type ImpactHorizonExplanationProps = {
  input: AccumulationInput | null;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

function ImpactHorizonExplanation({ input, prices, results }: ImpactHorizonExplanationProps) {
  if (results?.currentBtc === 0) {
    return (
      <p>
        A relative timeline needs current BTC holdings above zero. Enter an existing holding to
        compare it with future monthly contributions.
      </p>
    );
  }

  if (!input || !prices || !results) {
    return (
      <p>Enter valid amounts and wait for the live BTC price to see a personalized timeline.</p>
    );
  }

  return (
    <>
      <p>
        This timeline uses today’s Kraken reference price for every monthly purchase. You currently
        hold <HoldingAtReferencePrice currentBtc={results.currentBtc} input={input} />.
      </p>
      <p>
        Each row shows how many months of{" "}
        <strong>{formatAccumulationAmount(input.contribution, input.contributionUnit)}</strong>{" "}
        contributions are needed to add that percentage of your current holdings.
      </p>
      <p>
        For example, the 100% row means adding another {formatNumber(results.currentBtc)} BTC. At
        today’s reference price ({formatFiat(prices.EUR, "EUR")} / {formatFiat(prices.USD, "USD")}),
        that takes <strong>{formatImpactHorizon(calculateImpactHorizon(results, 100))}</strong>.
      </p>
    </>
  );
}
