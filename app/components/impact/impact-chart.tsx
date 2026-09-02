"use client";

import { defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";

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
};

export function ImpactChart({ ariaLabel, data, xLabel, xValue, yLabel, yValue }: ImpactChartProps) {
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
        axis: { label: xLabel, ticks: { format: xValue } },
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: yLabel, ticks: { format: yValue } },
      },
    },
    svgAnimation: false,
    tooltip,
  });

  return <Chart ariaLabel={ariaLabel} definition={definition} height={260} initialWidth={560} />;
}
