"use client";

import { defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { useTranslations } from "next-intl";

type ImpactChartPoint = {
  x: number;
  y: number;
};

type ImpactChartProps = {
  ariaLabel: string;
  data: readonly ImpactChartPoint[];
  xLabel: string;
  xValue: (value: number) => string;
  yLabel: string;
  yValue: (value: number) => string;
  fillHeight?: boolean;
};

export function ImpactChart({
  ariaLabel,
  data,
  xLabel,
  xValue,
  yLabel,
  yValue,
  fillHeight = false,
}: ImpactChartProps) {
  const t = useTranslations("ImpactAnalysisPanel");
  const definition = defineChart({
    marks: [
      lineY(data, {
        x: "x",
        y: "y",
        points: true,
        stroke: "var(--accent)",
      }),
    ],
    scales: {
      x: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { ticks: { format: xValue } },
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { ticks: { format: yValue } },
      },
    },
    margin: { top: 8, right: 12, bottom: 24, left: 64 },
    svgAnimation: false,
    tooltip: {
      use: tooltip,
      format(point) {
        return `${xLabel}: ${xValue(point.xValue)}\n${yLabel}: ${yValue(point.yValue)}`;
      },
    },
  });

  return (
    <Chart
      ariaLabel={t("chartAxesAriaLabel", { ariaLabel, xLabel, yLabel })}
      className="min-w-0"
      definition={definition}
      height={fillHeight ? undefined : 280}
      initialWidth={560}
      style={fillHeight ? { height: "100%" } : undefined}
    />
  );
}
