"use client";

import { buttonVariants, Modal, Table, Tabs } from "@heroui/react";
import { TbChartLine } from "react-icons/tb";
import { useState } from "react";

import { ACCUMULATION_MONTHS } from "@/lib/calculator/calculator.constants";
import type { AccumulationResults } from "@/lib/calculator/calculator.types";
import { getMonthlyGrowthValue } from "@/lib/impact/impact.calculations";
import type { GrowthMetric } from "@/lib/impact/impact.constants";
import { formatNumber } from "@/lib/number-format.utils";

import { BitcoinSymbol } from "../shared/currency-symbol";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { UnavailableValue } from "../shared/unavailable-value";
import { GrowthMetricToggle } from "./growth-metric-toggle";
import { ImpactChart } from "./impact-chart";
import { ImpactTabs, ImpactViewTabList, type ImpactView } from "./impact-view-tabs";

const formatMonth = (value: number) => `${Math.round(value)}m`;
const MONTHLY_METRIC_CONFIG = {
  btc: {
    ariaLabel: "Net increase in BTC holdings by month",
    yLabel: "Net BTC added",
    formatValue: (value: number) => `${formatNumber(value)} BTC`,
  },
  percent: {
    ariaLabel: "Percentage increase in BTC holdings by month",
    yLabel: "Increase in holdings (%)",
    formatValue: (value: number) => `${formatNumber(value, 0)}%`,
  },
} satisfies Record<
  GrowthMetric,
  { ariaLabel: string; yLabel: string; formatValue: (value: number) => string }
>;

export function MonthlyHoldingsDialog() {
  const state = useCalculatorData();
  const [view, setView] = useState<ImpactView>("chart");
  const [metric, setMetric] = useState<GrowthMetric>("btc");

  return (
    <Modal>
      <Modal.Trigger
        className={buttonVariants({ className: "px-2", size: "sm", variant: "ghost" })}
      >
        Monthly
        <TbChartLine aria-hidden="true" className="size-4 shrink-0" />
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-2xl">
            <Modal.CloseTrigger />
            <ImpactTabs value={view} onChange={setView}>
              <Modal.Header>
                <div className="flex items-center justify-between gap-3 pe-8">
                  <Modal.Heading>Month-by-month holdings</Modal.Heading>
                  <div className="flex items-center gap-2">
                    {view === "chart" ? (
                      <GrowthMetricToggle
                        ariaLabel="Monthly holdings chart metric"
                        value={metric}
                        onChange={setMetric}
                      />
                    ) : null}
                    <ImpactViewTabList ariaLabel="Monthly holdings view" />
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <MonthlyHoldingsPanels metric={metric} state={state} />
              </Modal.Body>
            </ImpactTabs>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

type MonthlyHoldingsPanelsProps = {
  metric: GrowthMetric;
  state: CalculatorData;
};

function MonthlyHoldingsPanels({ metric, state }: MonthlyHoldingsPanelsProps) {
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <UnavailableMonthlyHoldings isLoading={state.status === "loading"} />;
  }

  return <ResolvedMonthlyHoldings metric={metric} results={state.calculation.results} />;
}

type ResolvedMonthlyHoldingsProps = {
  metric: GrowthMetric;
  results: AccumulationResults;
};

function ResolvedMonthlyHoldings({ metric, results }: ResolvedMonthlyHoldingsProps) {
  const metricConfig = MONTHLY_METRIC_CONFIG[metric];
  const chartData = [0, ...ACCUMULATION_MONTHS].map((month) => ({
    x: month,
    y: getMonthlyGrowthValue(month, results, metric),
  }));

  return (
    <>
      <Tabs.Panel className="m-0 p-0" id="chart">
        <ImpactChart
          ariaLabel={metricConfig.ariaLabel}
          data={chartData}
          xLabel="Months"
          xValue={formatMonth}
          yLabel={metricConfig.yLabel}
          yValue={metricConfig.formatValue}
        />
      </Tabs.Panel>
      <MonthlyHoldingsTable state={{ status: "ready", results }} />
    </>
  );
}

type MonthlyHoldingsTableState =
  | { status: "ready"; results: AccumulationResults }
  | { status: "unavailable"; isLoading: boolean };

type MonthlyHoldingsTableProps = { state: MonthlyHoldingsTableState };

function MonthlyHoldingsTable({ state }: MonthlyHoldingsTableProps) {
  return (
    <Tabs.Panel className="m-0 p-0" id="table">
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Month-by-month BTC holdings for the next 12 months">
            <Table.Header>
              <Table.Column isRowHeader id="month">
                Month
              </Table.Column>
              <Table.Column id="added">Added</Table.Column>
              <Table.Column className="text-end" id="total">
                Total
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {ACCUMULATION_MONTHS.map((month) => (
                <Table.Row key={month} id={month}>
                  <Table.Cell className="font-mono tabular-nums">{month}</Table.Cell>
                  <Table.Cell className="font-mono tabular-nums">
                    <MonthlyBtcValue month={month} state={state} />
                  </Table.Cell>
                  <Table.Cell className="font-mono tabular-nums">
                    <MonthlyBtcValue alignEnd isTotal month={month} state={state} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Tabs.Panel>
  );
}

type UnavailableMonthlyHoldingsProps = { isLoading: boolean };

function UnavailableMonthlyHoldings({ isLoading }: UnavailableMonthlyHoldingsProps) {
  return (
    <>
      <Tabs.Panel className="m-0 p-0" id="chart">
        {null}
      </Tabs.Panel>
      <MonthlyHoldingsTable state={{ status: "unavailable", isLoading }} />
    </>
  );
}

type MonthlyBtcValueProps = {
  alignEnd?: boolean;
  isTotal?: boolean;
  month: number;
  state: MonthlyHoldingsTableState;
};

function MonthlyBtcValue({ alignEnd, isTotal = false, month, state }: MonthlyBtcValueProps) {
  if (state.status === "unavailable") {
    return <UnavailableBtcValue alignEnd={alignEnd} isLoading={state.isLoading} />;
  }

  const addedBtc = state.results.monthlyBtc * month;
  const value = isTotal ? state.results.currentBtc + addedBtc : addedBtc;
  return <BtcTableValue alignEnd={alignEnd} value={value} />;
}

type BtcTableValueProps = { alignEnd?: boolean; value: number };

function BtcTableValue({ alignEnd = false, value }: BtcTableValueProps) {
  const className = alignEnd
    ? "flex items-center justify-end gap-0.5"
    : "flex items-center gap-0.5";
  return (
    <span className={className}>
      <BitcoinSymbol />
      {formatNumber(value)}
    </span>
  );
}

type UnavailableBtcValueProps = { alignEnd?: boolean; isLoading: boolean };

function UnavailableBtcValue({ alignEnd = false, isLoading }: UnavailableBtcValueProps) {
  const className = alignEnd
    ? "flex items-center justify-end gap-0.5"
    : "flex items-center gap-0.5";

  if (!isLoading) {
    return (
      <span className={className}>
        <UnavailableValue />
      </span>
    );
  }

  return (
    <span className={className}>
      <BitcoinSymbol />
      <NumericSkeleton width="long" />
    </span>
  );
}
