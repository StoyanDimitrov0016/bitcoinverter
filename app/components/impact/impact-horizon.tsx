"use client";

import { Card, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbPercentage, TbTable } from "react-icons/tb";

import { MONTHS_PER_YEAR } from "@/lib/calculator/calculator.constants";
import type { AccumulationInput } from "@/lib/calculator/calculator.schemas";
import { getImpactHorizonData, getPriceImpactLevel } from "@/lib/impact/impact.calculations";
import { IMPACT_TARGETS, type GrowthMetric } from "@/lib/impact/impact.constants";
import {
  formatAccumulationAmount,
  formatFiat,
  formatImpactHorizon,
  formatInteger,
  formatNumber,
  formatPercent,
} from "@/lib/number-format.utils";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { BitcoinSymbol } from "../shared/currency-symbol";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";
import { renderNode, renderStrong } from "../shared/rich-text.utils";
import { UnavailableValue } from "../shared/unavailable-value";
import { GrowthMetricToggle } from "./growth-metric-toggle";
import { HoldingAtCurrentPrice } from "./holding-at-current-price";
import { ImpactChart } from "./impact-chart";
import { ImpactInfoDialog } from "./impact-info-dialog";

type PlannerView = "chart" | "targets";
type TargetTableView = "expected" | "required" | "price";

function useGrowthMetricConfig() {
  const t = useTranslations("ImpactAnalysisPanel");

  return {
    btc: {
      ariaLabel: t("btcHoldingsOverTime"),
      yLabel: t("totalBtcHoldings"),
      formatValue: (value: number) => `${formatNumber(value)} BTC`,
    },
    percent: {
      ariaLabel: t("percentIncreaseOverTime"),
      yLabel: t("increaseInHoldings"),
      formatValue: (value: number) => formatPercent(value, 0),
    },
  } satisfies Record<
    GrowthMetric,
    { ariaLabel: string; yLabel: string; formatValue: (value: number) => string }
  >;
}

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

function useMobilePlannerModes() {
  const t = useTranslations("ImpactAnalysisPanel");

  return [
    { id: "btc", label: t("btcChart") },
    { id: "percent", label: t("percentageChart") },
    { id: "targets", label: t("targets") },
  ] as const;
}

function MobilePlannerToggle({
  metric,
  view,
  onMetricChange,
  onViewChange,
}: MobilePlannerToggleProps) {
  const t = useTranslations("ImpactAnalysisPanel");
  const modes = useMobilePlannerModes();
  const value = view === "targets" ? "targets" : metric;

  return (
    <ToggleButtonGroup
      aria-label={t("mobileViewAriaLabel")}
      className="w-full border border-border"
      disallowEmptySelection
      selectedKeys={[value]}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const next = modes.find((option) => keys.has(option.id));
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
      {modes.map(({ id, label }) => (
        <ToggleButton key={id} aria-label={label} className="flex-1 gap-1.5 px-3" id={id}>
          <MobilePlannerModeIcon id={id} isActive={value === id} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

type MobilePlannerModeIconProps = {
  id: ReturnType<typeof useMobilePlannerModes>[number]["id"];
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
  const t = useTranslations("ImpactAnalysisPanel");
  const growthMetricConfig = useGrowthMetricConfig();
  const compactTimeUnits = {
    month: t("monthAbbreviation"),
    year: t("yearAbbreviation"),
  };

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
  const metricConfig = growthMetricConfig[metric];
  const formatTime = useYears
    ? (value: number) => `${formatNumber(value, 1)}${compactTimeUnits.year}`
    : (value: number) => `${formatInteger(value)}${compactTimeUnits.month}`;

  return (
    <div className="grid lg:grid-cols-[minmax(18rem,3fr)_minmax(0,7fr)] lg:items-stretch lg:gap-6">
      <section
        aria-label={t("growthTargetsAriaLabel")}
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
        aria-label={t("growthChartAriaLabel")}
        className={`${view === "chart" ? "visible" : "pointer-events-none invisible lg:pointer-events-auto lg:visible"} col-start-1 row-start-1 impact-chart-frame lg:col-auto lg:row-auto`}
      >
        <div className="mb-3 hidden items-center justify-between gap-3 lg:flex">
          <GrowthMetricToggle
            ariaLabel={t("chartMetricAriaLabel")}
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
            xLabel={useYears ? t("years") : t("months")}
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

function useTargetTableViews() {
  const t = useTranslations("ImpactAnalysisPanel");

  return [
    { id: "expected", label: t("currentPlan") },
    { id: "required", label: t("monthlyPlan") },
    { id: "price", label: t("priceLevels") },
  ] as const;
}

type TargetTableToggleProps = {
  value: TargetTableView;
  onChange: (value: TargetTableView) => void;
};

function TargetTableToggle({ value, onChange }: TargetTableToggleProps) {
  const t = useTranslations("ImpactAnalysisPanel");
  const views = useTargetTableViews();

  return (
    <ToggleButtonGroup
      aria-label={t("targetPlanViewAriaLabel")}
      className="w-full border border-border lg:w-auto"
      disallowEmptySelection
      selectedKeys={[value]}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const next = views.find((option) => keys.has(option.id));
        if (next) {
          onChange(next.id);
        }
      }}
    >
      {views.map(({ id, label }) => (
        <ToggleButton key={id} className="flex-1 px-3 lg:flex-none" id={id}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function ImpactTargetList({ data, state, tableView, onTableViewChange }: ImpactTargetListProps) {
  const t = useTranslations("ImpactAnalysisPanel");
  const compactTimeUnits = {
    month: t("monthAbbreviation"),
    year: t("yearAbbreviation"),
  };

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

          let targetValue: React.ReactNode = formatImpactHorizon(months, compactTimeUnits);
          if (tableView === "required") {
            targetValue = t("perMonth", {
              value: formatAccumulationAmount(monthlyNeeded, input.contributionUnit),
            });
          } else if (tableView === "price") {
            if (input.contributionUnit === "BTC") {
              targetValue = <UnavailableValue />;
            } else {
              const priceLevel = getPriceImpactLevel(
                input.contribution,
                results.currentBtc,
                target
              );
              targetValue =
                priceLevel === null ? (
                  <UnavailableValue />
                ) : (
                  formatFiat(priceLevel, input.contributionUnit)
                );
            }
          }

          let targetDescription: React.ReactNode = (
            <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs text-muted">
              <span>{t("btcNeeded", { value: formatNumber(btcNeeded) })}</span>
              <span>
                {t("totalNeeded", {
                  value: formatAccumulationAmount(totalNeeded, input.contributionUnit),
                })}
              </span>
            </div>
          );
          if (tableView === "required") {
            targetDescription = (
              <p className="mt-1 line-clamp-2 text-xs text-muted">
                {t("addsInTwelveMonths", { value: formatNumber(btcNeeded) })}
              </p>
            );
          } else if (tableView === "price") {
            targetDescription = (
              <p className="mt-1 line-clamp-2 text-xs text-muted">
                {input.contributionUnit === "BTC"
                  ? t("priceLevelsRequireFiat")
                  : t("priceLevelInTwelveMonths", { value: formatNumber(btcNeeded) })}
              </p>
            );
          }

          return (
            <div key={target} className="impact-target-row">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="font-semibold text-foreground">{t("moreBtc", { target })}</dt>
                <dd className="m-0 font-mono font-semibold text-foreground tabular-nums">
                  {targetValue}
                </dd>
              </div>
              {targetDescription}
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
  const t = useTranslations("ImpactAnalysisPanel");

  return (
    <div className="grid lg:grid-cols-[minmax(18rem,3fr)_minmax(0,7fr)] lg:gap-6">
      <div
        className={`${view === "targets" ? "visible" : "pointer-events-none invisible lg:pointer-events-auto lg:visible"} col-start-1 row-start-1 lg:col-auto lg:row-auto lg:border-e lg:border-separator lg:pe-6`}
      >
        <dl className="m-0 space-y-1">
          {IMPACT_TARGETS.map((target) => (
            <ResultRow
              key={target}
              label={t("moreBtcRow", { target })}
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
  const t = useTranslations("ImpactAnalysisPanel");

  return (
    <>
      <NumericSkeleton /> {t("monthsWord")}
    </>
  );
}

type ImpactHorizonExplanationProps = { state: CalculatorData };

function ImpactHorizonExplanation({ state }: ImpactHorizonExplanationProps) {
  const t = useTranslations("ImpactAnalysisPanel");
  const compactTimeUnits = {
    month: t("monthAbbreviation"),
    year: t("yearAbbreviation"),
  };

  if (state.status !== "ready" || state.calculation.status !== "ready") {
    return <p>{t("explanationEmpty")}</p>;
  }

  const { input, results } = state.calculation;
  const data = getImpactHorizonData(results, "btc");

  if (data.status === "unavailable") {
    return (
      <p>
        {t(data.reason === "zero-current-holdings" ? "zeroCurrentHoldings" : "zeroContribution")}
      </p>
    );
  }

  return (
    <>
      <p>
        {t.rich("explanationHoldings", {
          holding: renderNode(
            <HoldingAtCurrentPrice currentBtc={results.currentBtc} input={input} />
          ),
        })}
      </p>
      <p>{t("explanationCharts")}</p>
      <p>
        {t.rich("explanationPlans", {
          contribution: formatAccumulationAmount(input.contribution, input.contributionUnit),
          horizon: formatImpactHorizon(data.hundredPercentMonths, compactTimeUnits),
          strong: renderStrong,
        })}
      </p>
      <p>
        {t(
          input.contributionUnit === "BTC"
            ? "explanationPriceLevelsUnavailable"
            : "explanationPriceLevels"
        )}
      </p>
    </>
  );
}

type ImpactHorizonInfoProps = { state: CalculatorData };

function ImpactHorizonInfo({ state }: ImpactHorizonInfoProps) {
  const t = useTranslations("ImpactAnalysisPanel");

  return (
    <ImpactInfoDialog ariaLabel={t("infoAriaLabel")} title={t("infoTitle")}>
      <ImpactHorizonExplanation state={state} />
    </ImpactInfoDialog>
  );
}
