"use client";

import { Card, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { useState } from "react";
import { TbPercentage, TbTable } from "react-icons/tb";

import { MONTHS_PER_YEAR } from "@/lib/calculator/calculator.constants";
import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";
import { getImpactHorizonData } from "@/lib/impact/impact.calculations";
import { IMPACT_TARGETS, type GrowthMetric } from "@/lib/impact/impact.constants";
import {
  formatAccumulationAmount,
  formatImpactHorizon,
  formatNumber,
} from "@/lib/number-format.utils";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { BitcoinSymbol } from "../shared/currency-symbol";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";
import { UnavailableValue } from "../shared/unavailable-value";
import { GrowthMetricToggle } from "./growth-metric-toggle";
import { HoldingAtCurrentPrice } from "./holding-at-current-price";
import { ImpactChart } from "./impact-chart";
import { ImpactInfoDialog } from "./impact-info-dialog";

type PlannerView = "chart" | "targets";
type TargetTableView = "expected" | "required";

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
  const [view, setView] = useState<PlannerView>("chart");
  const [metric, setMetric] = useState<GrowthMetric>("btc");
  const [tableView, setTableView] = useState<TargetTableView>("expected");

  return (
    <Card className="relative rounded-2xl pb-2">
      <Card.Content className="pt-0 lg:pt-4">
        <div className="mb-3 flex items-center gap-2 lg:hidden">
          <div className="min-w-0 flex-1">
            <MobilePlannerToggle
              metric={metric}
              view={view}
              onMetricChange={setMetric}
              onViewChange={setView}
            />
          </div>
          <ImpactHorizonInfo state={state} />
        </div>
        <ImpactHorizonPanels
          metric={metric}
          state={state}
          tableView={tableView}
          view={view}
          onMetricChange={setMetric}
          onTableViewChange={setTableView}
        />
      </Card.Content>
    </Card>
  );
}

type MobilePlannerToggleProps = {
  metric: GrowthMetric;
  view: PlannerView;
  onMetricChange: (value: GrowthMetric) => void;
  onViewChange: (value: PlannerView) => void;
};

const MOBILE_PLANNER_MODES = [
  { id: "btc", label: "BTC chart" },
  { id: "percent", label: "Percentage chart" },
  { id: "targets", label: "Targets" },
] as const;

function MobilePlannerToggle({
  metric,
  view,
  onMetricChange,
  onViewChange,
}: MobilePlannerToggleProps) {
  const value = view === "targets" ? "targets" : metric;

  return (
    <ToggleButtonGroup
      aria-label="Impact analysis view"
      className="w-full border border-border"
      disallowEmptySelection
      selectedKeys={[value]}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const next = MOBILE_PLANNER_MODES.find((option) => keys.has(option.id));
        if (!next) {
          return;
        }

        if (next.id === "targets") {
          onViewChange("targets");
        } else {
          onMetricChange(next.id);
          onViewChange("chart");
        }
      }}
    >
      {MOBILE_PLANNER_MODES.map(({ id, label }) => (
        <ToggleButton key={id} aria-label={label} className="flex-1 gap-1.5 px-3" id={id}>
          <MobilePlannerModeIcon id={id} isActive={value === id} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

type MobilePlannerModeIconProps = {
  id: (typeof MOBILE_PLANNER_MODES)[number]["id"];
  isActive: boolean;
};

function MobilePlannerModeIcon({ id, isActive }: MobilePlannerModeIconProps) {
  if (id === "btc") {
    return (
      <span className="flex size-4 items-center justify-center text-xl">
        <BitcoinSymbol isActive={isActive} />
      </span>
    );
  }

  if (id === "percent") {
    return <TbPercentage aria-hidden="true" className="size-4" />;
  }

  return <TbTable aria-hidden="true" className="size-4" />;
}

type ImpactHorizonPanelsProps = {
  metric: GrowthMetric;
  state: CalculatorData;
  tableView: TargetTableView;
  view: PlannerView;
  onMetricChange: (value: GrowthMetric) => void;
  onTableViewChange: (value: TargetTableView) => void;
};

function ImpactHorizonPanels({
  metric,
  state,
  tableView,
  view,
  onMetricChange,
  onTableViewChange,
}: ImpactHorizonPanelsProps) {
  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <UnavailableHorizonPanels isLoading={state.status === "loading"} view={view} />;
  }

  const data = getImpactHorizonData(state.calculation.results, metric);
  if (data.status === "unavailable") {
    return <UnavailableHorizonPanels isLoading={false} view={view} />;
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
    <div className="grid lg:grid-cols-[minmax(18rem,3fr)_minmax(0,7fr)] lg:items-stretch lg:gap-6">
      <section
        aria-label="Growth targets"
        className={`${view === "targets" ? "visible" : "pointer-events-none invisible lg:pointer-events-auto lg:visible"} col-start-1 row-start-1 h-full lg:col-auto lg:row-auto lg:border-e lg:border-separator lg:pe-6`}
      >
        <ImpactTargetList
          data={data}
          state={state}
          tableView={tableView}
          onTableViewChange={onTableViewChange}
        />
      </section>
      <section
        aria-label="Growth chart"
        className={`${view === "chart" ? "visible" : "pointer-events-none invisible lg:pointer-events-auto lg:visible"} col-start-1 row-start-1 impact-chart-frame lg:col-auto lg:row-auto`}
      >
        <div className="mb-3 hidden items-center justify-between gap-3 lg:flex">
          <GrowthMetricToggle
            ariaLabel="Impact chart metric"
            value={metric}
            onChange={onMetricChange}
          />
          <div className="hidden lg:block">
            <ImpactHorizonInfo state={state} />
          </div>
        </div>
        <div className="min-h-0 flex-1 pb-6 lg:pb-0">
          <ImpactChart
            ariaLabel={metricConfig.ariaLabel}
            data={chartData}
            xLabel={useYears ? "Years" : "Months"}
            xValue={formatTime}
            yLabel={metricConfig.yLabel}
            yValue={metricConfig.formatValue}
            fillHeight
          />
        </div>
      </section>
    </div>
  );
}

type AvailableHorizonData = Extract<
  ReturnType<typeof getImpactHorizonData>,
  { status: "available" }
>;

type ImpactTargetListProps = {
  data: AvailableHorizonData;
  state: Extract<CalculatorData, { status: "ready" }>;
  tableView: TargetTableView;
  onTableViewChange: (value: TargetTableView) => void;
};

const TARGET_TABLE_VIEWS = [
  { id: "expected", label: "Current plan" },
  { id: "required", label: "Monthly plan" },
] as const;

type TargetTableToggleProps = {
  value: TargetTableView;
  onChange: (value: TargetTableView) => void;
};

function TargetTableToggle({ value, onChange }: TargetTableToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label="Target plan view"
      className="w-full border border-border lg:w-auto"
      disallowEmptySelection
      selectedKeys={[value]}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const next = TARGET_TABLE_VIEWS.find((option) => keys.has(option.id));
        if (next) {
          onChange(next.id);
        }
      }}
    >
      {TARGET_TABLE_VIEWS.map(({ id, label }) => (
        <ToggleButton key={id} className="flex-1 px-3 lg:flex-none" id={id}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function ImpactTargetList({ data, state, tableView, onTableViewChange }: ImpactTargetListProps) {
  if (state.calculation.status !== "ready") {
    return null;
  }

  const { input, results } = state.calculation;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex justify-start pe-10 lg:mb-3 lg:justify-center lg:pe-0">
        <TargetTableToggle value={tableView} onChange={onTableViewChange} />
      </div>
      <dl className="m-0 flex-1">
        {data.rows.map(({ target, months }) => {
          const btcNeeded = (results.currentBtc * target) / 100;
          const totalNeeded = getTotalNeeded(btcNeeded, input, state);
          const monthlyNeeded = totalNeeded / MONTHS_PER_YEAR;

          let targetValue = formatImpactHorizon(months);
          if (tableView === "required") {
            targetValue = `${formatAccumulationAmount(monthlyNeeded, input.contributionUnit)}/mo`;
          }

          return (
            <div key={target} className="impact-target-row">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="font-semibold text-foreground">+{target}%</dt>
                <dd className="m-0 font-mono font-semibold text-foreground tabular-nums">
                  {targetValue}
                </dd>
              </div>
              {tableView === "expected" ? (
                <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs text-muted">
                  <span>{formatNumber(btcNeeded)} BTC needed</span>
                  <span>{formatAccumulationAmount(totalNeeded, input.contributionUnit)} total</span>
                </div>
              ) : (
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  Adds {formatNumber(btcNeeded)} BTC in 12 months at today's price.
                </p>
              )}
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function getTotalNeeded(
  btcNeeded: number,
  input: AccumulationInput,
  state: Extract<CalculatorData, { status: "ready" }>
) {
  if (input.contributionUnit === "BTC") {
    return btcNeeded;
  }

  return btcNeeded * state.prices[input.contributionUnit];
}

type UnavailableHorizonPanelsProps = { isLoading: boolean; view: PlannerView };

function UnavailableHorizonPanels({ isLoading, view }: UnavailableHorizonPanelsProps) {
  return (
    <div className="grid lg:grid-cols-[minmax(18rem,3fr)_minmax(0,7fr)] lg:gap-6">
      <div
        className={`${view === "targets" ? "visible" : "pointer-events-none invisible lg:pointer-events-auto lg:visible"} col-start-1 row-start-1 lg:col-auto lg:row-auto lg:border-e lg:border-separator lg:pe-6`}
      >
        <dl className="m-0 space-y-1">
          {IMPACT_TARGETS.map((target) => (
            <ResultRow
              key={target}
              label={`${target}% more BTC`}
              value={isLoading ? <HorizonSkeleton /> : <UnavailableValue />}
            />
          ))}
        </dl>
      </div>
      <div
        className={`${view === "chart" ? "visible" : "pointer-events-none invisible lg:pointer-events-auto lg:visible"} col-start-1 row-start-1 min-h-65 lg:col-auto lg:row-auto`}
      />
    </div>
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
        The analysis uses today's Kraken price for every purchase. You currently hold{" "}
        <HoldingAtCurrentPrice currentBtc={results.currentBtc} input={input} />.
      </p>
      <p>
        The BTC chart shows total holdings; the percentage chart shows growth relative to your
        current holdings. Both charts stop at the +100% target.
      </p>
      <p>
        Current plan shows how long{" "}
        <strong>{formatAccumulationAmount(input.contribution, input.contributionUnit)}</strong>{" "}
        monthly contributions take to reach each target. The +100% target takes{" "}
        <strong>{formatImpactHorizon(data.hundredPercentMonths)}</strong>. Monthly plan instead
        shows the amount needed to reach each target within 12 months.
      </p>
    </>
  );
}

const HORIZON_UNAVAILABLE_MESSAGES = {
  "zero-current-holdings": "The analysis needs current BTC holdings above zero.",
  "zero-contribution": "The analysis needs a monthly contribution above zero.",
} as const;

type ImpactHorizonInfoProps = { state: CalculatorData };

function ImpactHorizonInfo({ state }: ImpactHorizonInfoProps) {
  return (
    <ImpactInfoDialog
      ariaLabel="Explain the impact analysis calculations"
      title="How the impact analysis is calculated"
    >
      <ImpactHorizonExplanation state={state} />
    </ImpactInfoDialog>
  );
}
