"use client";

import { Button, Modal, Table, Tabs } from "@heroui/react";
import { TbChartLine } from "react-icons/tb";
import { useState } from "react";

import { ACCUMULATION_MONTHS } from "@/lib/bitcoin-calculator.utils";
import type { GrowthMetric } from "@/lib/impact-chart.utils";
import { formatNumber } from "@/lib/number-format.utils";

import { BitcoinSymbol } from "../shared/currency-symbol";
import { useCalculatorData } from "../calculator/calculator-data-context";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { GrowthMetricToggle } from "./growth-metric-toggle";
import { ImpactChart } from "./impact-chart";
import { ImpactTabs, ImpactViewTabList, type ImpactView } from "./impact-view-tabs";

const formatMonth = (value: number) => `${Math.round(value)}m`;
const formatBtc = (value: number) => `${formatNumber(value)} BTC`;
const formatPercent = (value: number) => `${formatNumber(value, 0)}%`;

function getGrowthValue(
  month: number,
  monthlyBtc: number,
  currentBtc: number,
  metric: GrowthMetric
) {
  if (metric === "btc") {
    return monthlyBtc * month;
  }
  return currentBtc > 0 ? ((monthlyBtc * month) / currentBtc) * 100 : 0;
}

export function MonthlyHoldingsDialog() {
  const { isPriceLoading, results } = useCalculatorData();
  const [view, setView] = useState<ImpactView>("chart");
  const [metric, setMetric] = useState<GrowthMetric>("btc");
  const chartData = results
    ? [0, ...ACCUMULATION_MONTHS].map((month) => ({
        x: month,
        y: getGrowthValue(month, results.monthlyBtc, results.currentBtc, metric),
      }))
    : [];

  return (
    <Modal>
      <Button className="px-2" size="sm" variant="ghost">
        Monthly
        <TbChartLine aria-hidden="true" className="size-4 shrink-0" />
      </Button>
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
                      <GrowthMetricToggle value={metric} onChange={setMetric} />
                    ) : null}
                    <ImpactViewTabList />
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <Tabs.Panel className="m-0 p-0" id="chart">
                  {chartData.length > 0 ? (
                    <ImpactChart
                      ariaLabel={`${metric === "btc" ? "Net" : "Percentage"} increase in BTC holdings by month`}
                      data={chartData}
                      xLabel="Months"
                      xValue={formatMonth}
                      yLabel={metric === "btc" ? "Net BTC added" : "Increase in holdings (%)"}
                      yValue={metric === "btc" ? formatBtc : formatPercent}
                    />
                  ) : null}
                </Tabs.Panel>
                <Tabs.Panel className="m-0 p-0" id="table">
                  <Table variant="secondary">
                    <Table.ScrollContainer>
                      <Table.Content aria-label="Month-by-month BTC holdings for the next 12 months">
                        <Table.Header>
                          <Table.Column isRowHeader>Month</Table.Column>
                          <Table.Column>Added</Table.Column>
                          <Table.Column className="text-end">Total</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {ACCUMULATION_MONTHS.map((month) => (
                            <Table.Row key={month} id={month}>
                              <Table.Cell className="font-mono tabular-nums">{month}</Table.Cell>
                              <Table.Cell className="font-mono tabular-nums">
                                {results ? (
                                  <span className="flex items-center gap-0.5">
                                    <BitcoinSymbol />
                                    {formatNumber(results.monthlyBtc * month)}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-0.5">
                                    <BitcoinSymbol />
                                    {isPriceLoading ? <NumericSkeleton width="long" /> : "—"}
                                  </span>
                                )}
                              </Table.Cell>
                              <Table.Cell className="font-mono tabular-nums">
                                {results ? (
                                  <span className="flex items-center justify-end gap-0.5">
                                    <BitcoinSymbol />
                                    {formatNumber(results.currentBtc + results.monthlyBtc * month)}
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-end gap-0.5">
                                    <BitcoinSymbol />
                                    {isPriceLoading ? <NumericSkeleton width="long" /> : "—"}
                                  </span>
                                )}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                </Tabs.Panel>
              </Modal.Body>
            </ImpactTabs>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
